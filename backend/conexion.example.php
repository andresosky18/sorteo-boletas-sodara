<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Copiar este archivo como 'conexion.php' y colocar tus credenciales reales
$host = '127.0.0.1';
$user = 'TU_USUARIO_BD';
$pass = 'TU_PASSWORD_BD';
$dbname = 'TU_NOMBRE_BD';
$wompi_integrity_secret = 'TU_WOMPI_INTEGRITY_SECRET';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Error de conexión a BD"]));
}
$conn->set_charset("utf8");
date_default_timezone_set('America/Bogota');
$conn->query("SET time_zone = '-05:00'");
?>
