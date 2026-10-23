<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'conexion.php';
header('Content-Type: application/json');

// Asegurar que exista la columna combos_json en la tabla sorteos
$checkCol = $conn->query("SHOW COLUMNS FROM sorteos LIKE 'combos_json'");
if ($checkCol && $checkCol->num_rows === 0) {
    $conn->query("ALTER TABLE sorteos ADD COLUMN combos_json TEXT NULL");
}

$titulo = $_POST['nombre'] ?? '';
$precio = $_POST['precio'] ?? 0;
$emision = $_POST['cantidad'] ?? 0;
$fecha = $_POST['fecha'] ?? date('Y-m-d');
$combosJson = $_POST['combos'] ?? null;

if (empty($titulo) || empty($precio) || empty($emision)) {
    echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios"]);
    exit;
}

$bannerUrl = '';
if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $fileInfo = pathinfo($_FILES['foto']['name']);
    $extension = strtolower($fileInfo['extension']);
    $fileName = 'sorteo_' . time() . '.' . $extension;
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['foto']['tmp_name'], $targetFile)) {
        $bannerUrl = '/uploads/' . $fileName;
    }
}

$id = uniqid();

$sql = "INSERT INTO sorteos (id, titulo, precio_boleta, emision_total, banner_url, fecha_oficial, estado, loteria_oficial, publico_web, combos_json) VALUES (?, ?, ?, ?, ?, ?, 'activo', 'Por definir', 1, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die(json_encode(["status" => "error", "message" => "Error de SQL: " . $conn->error]));
}

$stmt->bind_param("ssddsss", $id, $titulo, $precio, $emision, $bannerUrl, $fecha, $combosJson);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Sorteo creado exitosamente", "id" => $id]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
