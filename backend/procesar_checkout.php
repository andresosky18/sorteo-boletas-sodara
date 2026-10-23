<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'conexion.php';
date_default_timezone_set('America/Bogota');
$conn->query("SET time_zone = '-05:00'");
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Datos inválidos"]);
    exit;
}

$nombre = $data['nombre'] ?? '';
$cc = $data['cc'] ?? ''; 
$telefono = $data['telefono'] ?? '';
$email = $data['email'] ?? '';
$sorteo_id = $data['sorteo_id'] ?? '';
$boletas = $data['boletas'] ?? [];
$total = $data['total'] ?? 0;

if (empty($nombre) || empty($telefono) || empty($boletas) || empty($sorteo_id)) {
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
    exit;
}

$fecha_bogota = date('Y-m-d H:i:s');

$conn->begin_transaction();

try {
    // 1. Verificar si existe el cliente
    $stmt = $conn->prepare("SELECT id FROM clientes WHERE telefono = ? LIMIT 1");
    $stmt->bind_param("s", $telefono);
    $stmt->execute();
    $res = $stmt->get_result();
    
    $cliente_id = null;
    if ($res->num_rows > 0) {
        $row = $res->fetch_assoc();
        $cliente_id = $row['id'];
    } else {
        $cliente_id = uniqid();
        $stmt_ins = $conn->prepare("INSERT INTO clientes (id, nombre_completo, telefono, email, ciudad, fecha_registro) VALUES (?, ?, ?, ?, 'Online', ?)");
        $stmt_ins->bind_param("sssss", $cliente_id, $nombre, $telefono, $email, $fecha_bogota);
        $stmt_ins->execute();
    }

    $referencia = "ORD-" . time() . "-" . rand(1000, 9999);

    // Generar firma de integridad requerida por Wompi (definida en conexion.php o variable de entorno)
    $wompi_integrity_secret = $wompi_integrity_secret ?? (getenv('WOMPI_INTEGRITY_SECRET') ?: 'TU_WOMPI_INTEGRITY_SECRET');
    $monto_centavos = (string)(round($total * 100));
    $cadena_firma = $referencia . $monto_centavos . 'COP' . $wompi_integrity_secret;
    $firma_hash = hash('sha256', $cadena_firma);

    // 2. Insertar en pagos_pasarela (estado: Pendiente) con hora exacta de Bogotá
    $stmt_pago = $conn->prepare("INSERT INTO pagos_pasarela (id_transaccion, cliente_id, sorteo_id, monto_total, metodo_pago, estado_pago, email, fecha_pago) VALUES (?, ?, ?, ?, 'wompi', 'Pendiente', ?, ?)");
    $stmt_pago->bind_param("sssdss", $referencia, $cliente_id, $sorteo_id, $total, $email, $fecha_bogota);
    $stmt_pago->execute();

    // 3. Insertar las boletas vendidas
    $stmt_bol = $conn->prepare("INSERT INTO boletas_vendidas (sorteo_id, pago_id, numero_boleta) VALUES (?, ?, ?)");
    foreach ($boletas as $num) {
        $stmt_bol->bind_param("sss", $sorteo_id, $referencia, $num);
        $stmt_bol->execute();
    }

    $conn->commit();
    echo json_encode([
        "status" => "success", 
        "message" => "Orden creada", 
        "referencia" => $referencia,
        "pago_id" => $referencia,
        "signature" => $firma_hash
    ]);

} catch (Exception $e) {
    $conn->rollback();
    
    $msg = $e->getMessage();
    if (strpos($msg, 'Duplicate entry') !== false && strpos($msg, 'unica_boleta_sorteo') !== false) {
        echo json_encode(["status" => "error", "message" => "Algunas de las boletas seleccionadas ya fueron apartadas. Por favor, recarga la página y selecciona otras."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error interno: " . $msg]);
    }

}

$conn->close();
?>
