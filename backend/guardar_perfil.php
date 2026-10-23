<?php
require 'conexion.php';

header('Content-Type: application/json');

$nombre = $_POST['nombre'] ?? '';
$correo = $_POST['correo'] ?? '';
$password = $_POST['password'] ?? '';
$resAdmin = $conn->query("SELECT id FROM usuarios_admin ORDER BY id ASC LIMIT 1");
$rowAdmin = $resAdmin ? $resAdmin->fetch_assoc() : null;
$admin_id = $rowAdmin ? (int)$rowAdmin['id'] : 1;

$fotoUrl = '';

if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $fileInfo = pathinfo($_FILES['foto']['name']);
    $extension = strtolower($fileInfo['extension']);
    $fileName = 'perfil_' . time() . '.' . $extension;
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['foto']['tmp_name'], $targetFile)) {
        $fotoUrl = '/uploads/' . $fileName;
    }
}

// Intentar hacer UPDATE
if ($fotoUrl != '') {
    $sql = "UPDATE usuarios_admin SET nombre=?, email=?, foto_perfil=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die(json_encode(["error" => "Error en la consulta SQL (ver columnas en la base de datos): " . $conn->error]));
    }
    $stmt->bind_param("sssi", $nombre, $correo, $fotoUrl, $admin_id);
} else {
    $sql = "UPDATE usuarios_admin SET nombre=?, email=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die(json_encode(["error" => "Error en la consulta SQL (ver columnas en la base de datos): " . $conn->error]));
    }
    $stmt->bind_param("ssi", $nombre, $correo, $admin_id);
}

if (!$stmt->execute()) {
    die(json_encode(["error" => "Error al ejecutar: " . $stmt->error]));
}

if (!empty($password)) {
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $sql = "UPDATE usuarios_admin SET password_hash=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("si", $hash, $admin_id);
        $stmt->execute();
    }
}

echo json_encode(["status" => "success", "message" => "Perfil actualizado", "foto" => $fotoUrl]);

$stmt->close();
$conn->close();
?>
