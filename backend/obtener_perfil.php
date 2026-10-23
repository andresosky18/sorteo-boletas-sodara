<?php
require 'conexion.php';

header('Content-Type: application/json');

$sql = "SELECT id, nombre, email, foto_perfil FROM usuarios_admin ORDER BY id ASC LIMIT 1";
$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    echo json_encode(["status" => "success", "data" => $row]);
} else {
    echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
}

$conn->close();
?>
