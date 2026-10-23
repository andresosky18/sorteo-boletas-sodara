<?php
require 'conexion.php';
date_default_timezone_set('America/Bogota');
$conn->query("SET time_zone = '-05:00'");
header('Content-Type: application/json');

// Auto-Liberar boletas pendientes que llevan más de 15 minutos sin pagarse
$sql_limpiar = "
    DELETE b, p 
    FROM boletas_vendidas b
    JOIN pagos_pasarela p ON b.pago_id = p.id_transaccion
    WHERE p.estado_pago = 'pendiente' 
    AND p.fecha_pago < (NOW() - INTERVAL 9 MINUTE)
";
$conn->query($sql_limpiar);

$sql = "
SELECT 
    b.id as boleta_id,
    b.numero_boleta,
    b.sorteo_id,
    s.titulo as sorteo_nombre,
    c.nombre_completo as cliente_nombre,
    c.telefono as cliente_telefono,
    COALESCE(NULLIF(p.email, ''), c.email) as cliente_email,
    p.id_transaccion as referencia,
    p.estado_pago as estado_pago,
    p.fecha_pago
FROM boletas_vendidas b
LEFT JOIN sorteos s ON b.sorteo_id = s.id
LEFT JOIN pagos_pasarela p ON b.pago_id = p.id_transaccion
LEFT JOIN clientes c ON p.cliente_id = c.id
ORDER BY b.id DESC
";

$result = $conn->query($sql);
$boletas = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        $boletas[] = [
            "id" => $row['boleta_id'],
            "numero" => $row['numero_boleta'],
            "sorteo_id" => $row['sorteo_id'],
            "sorteo" => $row['sorteo_nombre'],
            "cliente" => $row['cliente_nombre'],
            "telefono" => $row['cliente_telefono'],
            "email" => $row['cliente_email'],
            "referencia" => $row['referencia'],
            "estado" => $row['estado_pago'],
            "fecha" => $row['fecha_pago']
        ];
    }
    echo json_encode(["status" => "success", "data" => $boletas]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
$conn->close();
?>
