<?php
require 'conexion.php';
date_default_timezone_set('America/Bogota');
$conn->query("SET time_zone = '-05:00'");
header('Content-Type: application/json');

$sql = "SELECT 
    c.id, 
    c.nombre_completo, 
    c.telefono, 
    c.email, 
    c.ciudad, 
    c.fecha_registro,
    (SELECT COUNT(*) FROM boletas_vendidas b JOIN pagos_pasarela p2 ON b.pago_id = p2.id_transaccion WHERE p2.cliente_id = c.id AND p2.estado_pago = 'Aprobado') as boletas,
    (SELECT COALESCE(SUM(monto_total), 0) FROM pagos_pasarela p3 WHERE p3.cliente_id = c.id AND p3.estado_pago = 'Aprobado') as invertido
FROM clientes c
ORDER BY c.id DESC";

$result = $conn->query($sql);
$clientes = [];

if ($result) {
    while($row = $result->fetch_assoc()) {
        $clientes[] = [
            "id" => $row['id'],
            "name" => $row['nombre_completo'],
            "phone" => $row['telefono'],
            "email" => $row['email'],
            "location" => $row['ciudad'],
            "date" => $row['fecha_registro'],
            "boletas" => $row['boletas'],
            "invertido" => $row['invertido']
        ];
    }
}

echo json_encode(["status" => "success", "data" => $clientes]);
$conn->close();
?>
