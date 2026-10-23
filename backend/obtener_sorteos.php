<?php
require 'conexion.php';
header('Content-Type: application/json');

$checkCol = $conn->query("SHOW COLUMNS FROM sorteos LIKE 'combos_json'");
if ($checkCol && $checkCol->num_rows === 0) {
    $conn->query("ALTER TABLE sorteos ADD COLUMN combos_json TEXT NULL");
}

$sql = "SELECT * FROM sorteos ORDER BY id DESC";
$result = $conn->query($sql);
$sorteos = [];

while($row = $result->fetch_assoc()) {
    $estadoRaw = isset($row['estado']) ? trim($row['estado']) : '';
    if ($estadoRaw === '') {
        $estadoRaw = (isset($row['publico_web']) && (int)$row['publico_web'] === 0) ? 'inactivo' : 'activo';
    }
    $fechaOficial = $row['fecha_oficial'] ?? '';
    $ts = (!empty($fechaOficial) && $fechaOficial !== '0000-00-00') ? strtotime($fechaOficial) : false;
    $endDate = ($ts && $ts > 0) ? date('Y-m-d', $ts) : date('Y-m-d');

    $precioUnit = (float)($row['precio_boleta'] ?? 1000);
    $combos = null;
    if (!empty($row['combos_json'])) {
        $decoded = json_decode($row['combos_json'], true);
        if (is_array($decoded)) {
            $combos = $decoded;
        }
    }
    if ($combos === null) {
        $combos = [
            ["cantidad" => 5, "precio" => 5 * $precioUnit, "subtitulo" => "Boletas al azar", "destacado" => false],
            ["cantidad" => 15, "precio" => 15 * $precioUnit, "subtitulo" => "Máxima suerte", "destacado" => true],
            ["cantidad" => 30, "precio" => 30 * $precioUnit, "subtitulo" => "Gran inversión", "destacado" => false]
        ];
    }

    $sorteos[] = [
        "id" => $row['id'],
        "title" => $row['titulo'],
        "author" => "Sodara Admin",
        "price" => $row['precio_boleta'],
        "cantidad" => $row['emision_total'],
        "image" => !empty($row['banner_url']) ? 'https://sodarasorteosyrifas.com' . $row['banner_url'] : '',
        "estado" => strtolower($estadoRaw),
        "startDate" => date('Y-m-d'),
        "endDate" => $endDate,
        "combos" => $combos
    ];
}

echo json_encode(["status" => "success", "data" => $sorteos]);
$conn->close();
?>
