<?php
require 'conexion.php';
date_default_timezone_set('America/Bogota');
$conn->query("SET time_zone = '-05:00'");
$conn->query("SET SESSION group_concat_max_len = 100000");
header('Content-Type: application/json');

$sql = "
SELECT 
    MAX(c.nombre_completo) as nombre, 
    MAX(c.telefono) as telefono, 
    GROUP_CONCAT(b.numero_boleta ORDER BY CAST(b.numero_boleta AS UNSIGNED) ASC SEPARATOR ', ') as boleta,
    COUNT(b.id) as cantidad,
    MAX(p.estado_pago) as estado,
    MAX(p.fecha_pago) as fecha
FROM boletas_vendidas b
LEFT JOIN pagos_pasarela p ON b.pago_id = p.id_transaccion
LEFT JOIN clientes c ON p.cliente_id = c.id
GROUP BY 
    LOWER(TRIM(COALESCE(c.nombre_completo, ''))),
    TRIM(COALESCE(c.telefono, '')),
    COALESCE(b.sorteo_id, ''),
    LOWER(TRIM(COALESCE(p.estado_pago, '')))
ORDER BY MAX(p.fecha_pago) DESC, MAX(b.id) DESC
";

$result = $conn->query($sql);

$movimientos = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $boletasArr = array_values(array_filter(array_map('trim', explode(',', $row['boleta'] ?? '')), function($v) { return $v !== ''; }));
        $movimientos[] = [
            "nombre" => $row['nombre'],
            "telefono" => $row['telefono'],
            "boleta" => $row['boleta'],
            "boletas" => $boletasArr,
            "cantidad" => (int)$row['cantidad'],
            "estado" => $row['estado'],
            "fecha" => $row['fecha']
        ];
    }
    echo json_encode(["status" => "success", "data" => $movimientos]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
$conn->close();
?>
