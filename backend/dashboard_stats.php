<?php
require 'conexion.php';
date_default_timezone_set('America/Bogota');
$conn->query("SET time_zone = '-05:00'");
header('Content-Type: application/json');

$stats = [
    "recaudado" => 0,
    "pagadas" => 0,
    "apartadas" => 0,
    "clientes" => 0,
    "mensual" => [
        "labels" => [],
        "data" => []
    ],
    "semanal" => [
        "labels" => [],
        "pagadas" => [],
        "apartadas" => []
    ],
    "por_dias" => [
        "labels" => [],
        "boletas" => [],
        "transacciones" => []
    ]
];

// 1. Totales generales
$sql = "
SELECT 
    COUNT(b.id) as total_boletas,
    p.estado_pago,
    SUM(COALESCE(s.precio_boleta, 1000)) as total_dinero
FROM boletas_vendidas b
LEFT JOIN pagos_pasarela p ON b.pago_id = p.id_transaccion
LEFT JOIN sorteos s ON b.sorteo_id = s.id
GROUP BY p.estado_pago
";

$result = $conn->query($sql);

if ($result) {
    while($row = $result->fetch_assoc()) {
        $estado = strtolower(trim($row['estado_pago'] ?? ''));
        if ($estado === 'aprobado' || $estado === 'pagado' || $estado === 'approved') {
            $stats['pagadas'] += (int)$row['total_boletas'];
            $stats['recaudado'] += (float)$row['total_dinero'];
        } else if ($estado === 'pendiente' || $estado === 'apartado') {
            $stats['apartadas'] += (int)$row['total_boletas'];
        }
    }
}

$resClientes = $conn->query("SELECT COUNT(*) as c FROM clientes");
if ($resClientes) {
    $stats['clientes'] = (int)$resClientes->fetch_assoc()['c'];
}

// 2. Ingresos Mensuales (últimos 6 meses en hora Bogotá)
$mesesNombres = [1=>'ENE', 2=>'FEB', 3=>'MAR', 4=>'ABR', 5=>'MAY', 6=>'JUN', 7=>'JUL', 8=>'AGO', 9=>'SEP', 10=>'OCT', 11=>'NOV', 12=>'DIC'];
$mapaMensual = [];
for ($i = 5; $i >= 0; $i--) {
    $ts = strtotime("-$i months");
    $ym = date('Y-m', $ts);
    $mesNum = (int)date('n', $ts);
    $mapaMensual[$ym] = [
        "label" => $mesesNombres[$mesNum],
        "total" => 0
    ];
}

$sqlMensual = "
SELECT 
    DATE_FORMAT(COALESCE(p.fecha_pago, NOW()), '%Y-%m') as ym,
    SUM(COALESCE(s.precio_boleta, 1000)) as total_mes
FROM boletas_vendidas b
LEFT JOIN pagos_pasarela p ON b.pago_id = p.id_transaccion
LEFT JOIN sorteos s ON b.sorteo_id = s.id
WHERE LOWER(TRIM(COALESCE(p.estado_pago, ''))) IN ('aprobado', 'pagado', 'approved')
GROUP BY ym
ORDER BY ym ASC
";
$resMensual = $conn->query($sqlMensual);
if ($resMensual) {
    while ($r = $resMensual->fetch_assoc()) {
        $ym = $r['ym'];
        if (isset($mapaMensual[$ym])) {
            $mapaMensual[$ym]['total'] = (float)$r['total_mes'];
        }
    }
}
foreach ($mapaMensual as $m) {
    $stats['mensual']['labels'][] = $m['label'];
    $stats['mensual']['data'][] = $m['total'];
}

// 3. Datos por Días (Últimos 7 días + días con actividad reciente)
$mapaDias = [];
for ($i = 6; $i >= 0; $i--) {
    $ts = strtotime("-$i days");
    $ymd = date('Y-m-d', $ts);
    $mesNum = (int)date('n', $ts);
    $mapaDias[$ymd] = [
        "label" => date('d', $ts) . ' ' . $mesesNombres[$mesNum],
        "pagadas" => 0,
        "apartadas" => 0,
        "boletas" => 0,
        "transacciones" => 0
    ];
}

$sqlDias = "
SELECT 
    DATE(COALESCE(p.fecha_pago, NOW())) as fecha_dia,
    SUM(CASE WHEN LOWER(TRIM(COALESCE(p.estado_pago, ''))) IN ('aprobado', 'pagado', 'approved') THEN 1 ELSE 0 END) as pagadas_dia,
    SUM(CASE WHEN LOWER(TRIM(COALESCE(p.estado_pago, ''))) NOT IN ('aprobado', 'pagado', 'approved') THEN 1 ELSE 0 END) as apartadas_dia,
    COUNT(b.id) as total_boletas_dia,
    COUNT(DISTINCT COALESCE(NULLIF(b.pago_id, ''), CONCAT(COALESCE(p.cliente_id, ''), '_', DATE(COALESCE(p.fecha_pago, NOW()))))) as total_compras_dia
FROM boletas_vendidas b
LEFT JOIN pagos_pasarela p ON b.pago_id = p.id_transaccion
WHERE COALESCE(p.fecha_pago, NOW()) >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
GROUP BY fecha_dia
ORDER BY fecha_dia ASC
";
$resDias = $conn->query($sqlDias);
if ($resDias) {
    while ($r = $resDias->fetch_assoc()) {
        $ymd = $r['fecha_dia'];
        if (!$ymd) continue;
        $ts = strtotime($ymd);
        $mesNum = (int)date('n', $ts);
        $mapaDias[$ymd] = [
            "label" => date('d', $ts) . ' ' . $mesesNombres[$mesNum],
            "pagadas" => (int)$r['pagadas_dia'],
            "apartadas" => (int)$r['apartadas_dia'],
            "boletas" => (int)$r['total_boletas_dia'],
            "transacciones" => (int)$r['total_compras_dia']
        ];
    }
}

ksort($mapaDias);
// Mantener máximo los últimos 7 días ordenados
$mapaDias = array_slice($mapaDias, -7, 7, true);

foreach ($mapaDias as $d) {
    $stats['semanal']['labels'][] = $d['label'];
    $stats['semanal']['pagadas'][] = $d['pagadas'];
    $stats['semanal']['apartadas'][] = $d['apartadas'];

    $stats['por_dias']['labels'][] = $d['label'];
    $stats['por_dias']['boletas'][] = $d['boletas'];
    $stats['por_dias']['transacciones'][] = $d['transacciones'];
}

echo json_encode(["status" => "success", "data" => $stats]);
$conn->close();
?>
