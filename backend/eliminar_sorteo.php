<?php
require 'conexion.php';
header('Content-Type: application/json');

// Hostinger blocks DELETE requests sometimes, so we use POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(["status" => "error", "message" => "Método no permitido"]);
    exit;
}

// Receive JSON data
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? ($_POST['id'] ?? null);

// Allow GET fallback for simple deletion if POST JSON fails
if (!$id && isset($_GET['id'])) {
    $id = $_GET['id'];
}

if (!$id) {
    echo json_encode(["status" => "error", "message" => "Falta el ID del sorteo"]);
    exit;
}

$conn->begin_transaction();

try {
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");

    // 1. Eliminar boletas vendidas o apartadas asociadas a este sorteo
    $stmtBol = $conn->prepare("DELETE FROM boletas_vendidas WHERE sorteo_id = ?");
    if ($stmtBol) {
        $stmtBol->bind_param("s", $id);
        $stmtBol->execute();
        $stmtBol->close();
    }

    // 2. Eliminar pagos asociados a este sorteo
    $stmtPag = $conn->prepare("DELETE FROM pagos_pasarela WHERE sorteo_id = ?");
    if ($stmtPag) {
        $stmtPag->bind_param("s", $id);
        $stmtPag->execute();
        $stmtPag->close();
    }

    // 3. Eliminar el sorteo
    $stmt = $conn->prepare("DELETE FROM sorteos WHERE id = ?");
    $stmt->bind_param("s", $id);
    $ok = $stmt->execute();
    $stmt->close();

    $conn->query("SET FOREIGN_KEY_CHECKS = 1");

    if ($ok) {
        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Sorteo y sus registros asociados eliminados correctamente"]);
    } else {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => "No se pudo eliminar el sorteo: " . $conn->error]);
    }
} catch (Exception $e) {
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => "Error al eliminar el sorteo: " . $e->getMessage()]);
}

$conn->close();
?>
