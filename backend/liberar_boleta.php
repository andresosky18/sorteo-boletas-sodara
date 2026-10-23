<?php
require 'conexion.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$boleta_id = $data['id'] ?? '';
$sorteo_id = $data['sorteo_id'] ?? '';
$numero = $data['numero'] ?? '';

if (empty($boleta_id) && (empty($sorteo_id) || $numero === '')) {
    echo json_encode(["status" => "error", "message" => "Faltan datos para liberar la boleta"]);
    exit;
}

if (!empty($boleta_id)) {
    $stmt = $conn->prepare("DELETE FROM boletas_vendidas WHERE id = ?");
    $stmt->bind_param("i", $boleta_id);
} else {
    $numInt = (int)$numero;
    $numStr = (string)$numInt;
    $stmt = $conn->prepare("DELETE FROM boletas_vendidas WHERE sorteo_id = ? AND (numero_boleta = ? OR numero_boleta = ?)");
    $stmt->bind_param("sss", $sorteo_id, $numero, $numStr);
}

if ($stmt && $stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Boleta liberada correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al liberar: " . ($stmt ? $stmt->error : $conn->error)]);
}

if ($stmt) $stmt->close();
$conn->close();
?>
