<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'conexion.php';
header('Content-Type: application/json');

// Obtener datos del fetch (json)
$data = json_decode(file_get_contents("php://input"));
$correo = $data->correo ?? '';
$password = $data->password ?? '';

if (empty($correo) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Faltan datos"]);
    exit;
}

$sql = "SELECT id, password_hash, rol FROM usuarios_admin WHERE email = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die(json_encode(["status" => "error", "message" => "Error SQL: " . $conn->error]));
}

$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // Validar contraseña
    if (password_verify($password, $row['password_hash'])) {
        echo json_encode(["status" => "success", "message" => "Login exitoso"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Usuario no existe"]);
}

$stmt->close();
$conn->close();
?>
