<?php
require 'conexion.php';
header('Content-Type: application/json');

$busqueda = $_GET['q'] ?? '';

if (empty($busqueda)) {
    echo json_encode(["status" => "error", "message" => "Ingrese un término de búsqueda"]);
    exit;
}

// Buscar boletas que coincidan con telefono o nombre en la tabla clientes
$sql = "
SELECT 
    b.id as boleta_id,
    b.numero_boleta,
    s.titulo as sorteo_nombre,
    c.nombre_completo as cliente_nombre,
    c.telefono as cliente_telefono,
    p.id_transaccion as referencia,
    p.estado_pago as estado_pago,
    p.fecha_pago
FROM boletas_vendidas b
LEFT JOIN pagos_pasarela p ON b.pago_id = p.id_transaccion
LEFT JOIN clientes c ON p.cliente_id = c.id
LEFT JOIN sorteos s ON b.sorteo_id = s.id
WHERE c.telefono LIKE ? OR c.nombre_completo LIKE ? OR c.email LIKE ? OR p.email LIKE ?
ORDER BY b.id DESC
";

$stmt = $conn->prepare($sql);
$param = "%" . $busqueda . "%";
$stmt->bind_param("ssss", $param, $param, $param, $param);
$stmt->execute();
$result = $stmt->get_result();

$boletas = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $boletas[] = [
            "id" => $row['boleta_id'],
            "referencia" => $row['referencia'],
            "numero" => $row['numero_boleta'],
            "sorteo" => $row['sorteo_nombre'],
            "cliente" => $row['cliente_nombre'],
            "telefono" => $row['cliente_telefono'],
            "estado" => $row['estado_pago'],
            "fecha" => $row['fecha_pago']
        ];
    }
}

echo json_encode(["status" => "success", "data" => $boletas]);

$stmt->close();
$conn->close();
?>
