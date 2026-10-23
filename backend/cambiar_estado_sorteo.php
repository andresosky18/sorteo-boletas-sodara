<?php
require 'conexion.php';
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$estado = $_POST['estado'] ?? '';

if (empty($id) || empty($estado)) {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
    exit;
}

// Asegurar que la columna estado permita guardar 'activo' e 'inactivo' sin truncarse por ENUM
$conn->query("ALTER TABLE sorteos MODIFY COLUMN estado VARCHAR(50) NOT NULL DEFAULT 'activo'");

$publico = ($estado === 'activo') ? 1 : 0;
$sql = "UPDATE sorteos SET estado = ?, publico_web = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sis", $estado, $publico, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Estado actualizado", "estado" => $estado]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
