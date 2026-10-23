<?php
require 'conexion.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "SELECT * FROM tareas ORDER BY id DESC";
    $res = $conn->query($sql);
    $tareas = [];
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $tareas[] = [
                "id" => $row['id'],
                "nombre" => $row['nombre'],
                "progreso" => $row['progreso'],
                "cantidad" => $row['cantidad'],
                "fecha" => $row['fecha'],
                "completada" => (bool)$row['completada']
            ];
        }
    }
    echo json_encode(["status" => "success", "data" => $tareas]);
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? 'add';

    if ($action === 'add') {
        $nombre = $data['nombre'] ?? 'Nueva Tarea';
        $progreso = $data['progreso'] ?? '0%';
        $cantidad = $data['cantidad'] ?? 0;
        $fecha = date('d M Y');
        $sql = "INSERT INTO tareas (nombre, progreso, cantidad, fecha, completada) VALUES (?, ?, ?, ?, 0)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssds", $nombre, $progreso, $cantidad, $fecha);
        $stmt->execute();
        echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
    }
    elseif ($action === 'toggle') {
        $id = $data['id'] ?? 0;
        $completada = $data['completada'] ? 1 : 0;
        $sql = "UPDATE tareas SET completada = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $completada, $id);
        $stmt->execute();
        echo json_encode(["status" => "success"]);
    }
    elseif ($action === 'delete') {
        $id = $data['id'] ?? 0;
        $sql = "DELETE FROM tareas WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(["status" => "success"]);
    }
}
$conn->close();
?>
