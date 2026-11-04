<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

require 'conexion.php';
require 'enviar_correo.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email'] ?? '');
$nombre = trim($data['nombre'] ?? 'Participante');
$sorteo = trim($data['sorteo'] ?? 'Gran Sorteo Sodara');
$numero = trim($data['numero'] ?? '');
$referencia = trim($data['referencia'] ?? 'SODARA-CONFIRMADO');

if (empty($email)) {
    echo json_encode(["status" => "error", "message" => "Este cliente no tiene un correo electrónico registrado"]);
    exit;
}

$asunto = "¡Que empiece la emoción! Tus números están listos 🍀";

$numero_fmt = str_pad(trim(str_replace('#', '', $numero)), 4, '0', STR_PAD_LEFT);

$lista_boletas = '
<div style="background-color: #f8f9fa; border: 1px solid #eee; border-radius: 12px; padding: 15px 20px; margin-bottom: 10px;">
  <span style="font-size: 18px; font-weight: 800; color: #111;">🎟️ #' . htmlspecialchars($numero_fmt) . '</span>
</div>';

$mensaje = '
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap");
    body { margin: 0; padding: 20px; background-color: #f5f5f5; font-family: "Inter", sans-serif; }
    .email-wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; }
    .header-section { background-color: #eab308; border-radius: 30px 30px 0 0; padding: 30px 20px; text-align: center; position: relative; }
    .greeting-section { background-color: #ffffff; padding: 30px 30px 10px 30px; text-align: left; }
    .greeting-title { font-size: 28px; font-weight: 800; color: #111; margin: 0 0 10px 0; }
    .greeting-subtitle { font-size: 15px; color: #666; margin: 0; line-height: 1.5; }
    .card { background-color: #ffffff; border-radius: 20px; padding: 30px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .card-title { font-size: 18px; font-weight: 800; color: #111; margin: 0 0 25px 0; }
    .footer { text-align: center; padding: 20px; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header-section">
      <img src="https://sodarasorteosyrifas.com/logo_Negroo_Final.png" style="max-height: 90px; border-radius: 12px; margin: 0 auto 20px auto; display: block;">
    </div>
    <div class="greeting-section">
      <h1 class="greeting-title">✨ ¡QUE EMPIECE LA EMOCIÓN! 🍀</h1>
      <p class="greeting-subtitle">Hola <strong>'.htmlspecialchars($nombre).'</strong>, tus números ya están listos para entrar en juego:</p>
    </div>
    <div style="background-color: #ffffff; padding: 0 30px;">
       '.$lista_boletas.'
       <p style="color:#111; font-weight:700; margin-top:20px; font-size:16px;">🎯 Tu participación está confirmada.</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 20px 0;">
      <div class="card">
        <h2 class="card-title">Resumen de tu compra</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
          <tr><td style="color: #888; font-size: 13px; padding-bottom: 15px;">Sorteo</td><td style="color: #111; font-weight: 700; font-size: 13px; text-align: right; padding-bottom: 15px;">'.htmlspecialchars($sorteo).'</td></tr>
          <tr><td style="color: #888; font-size: 13px; padding-bottom: 15px;">Referencia</td><td style="color: #111; font-weight: 700; font-size: 13px; text-align: right; padding-bottom: 15px;">'.htmlspecialchars($referencia).'</td></tr>
          <tr><td style="color: #888; font-size: 13px;">Estado</td><td style="color: #111; font-weight: 700; font-size: 13px; text-align: right;">Pagado y Confirmado</td></tr>
        </table>
        
        <div style="margin-top:30px; font-size:15px; color:#555; line-height:1.6;">
            <p>Ahora viene esa parte emocionante...<br>imaginar que uno de tus números podría ser el ganador. ✨</p>
            <p>Cruza los dedos 🤞🏼, confía en tu suerte y prepárate para vivir la emoción de SODARA.</p>
            <p>🍀 Porque nunca sabes cuándo un número puede llevarte a un gran premio.</p>
            <p>Gracias por elegirnos y ser parte de esta experiencia. 🎉</p>
            <p style="font-weight:800; color:#111; font-size:18px; text-align:center; margin-top:30px;">✨ ¡MUCHÍSIMA SUERTE! ✨</p>
        </div>

        <a href="https://sodarasorteosyrifas.com" style="display: block; width: 100%; background-color: #eab308; color: #111; text-align: center; padding: 16px 0; border-radius: 30px; font-weight: 800; text-decoration: none; font-size: 15px; margin-top: 25px;">Ir a la tienda</a>
      </div>
      
      <div class="footer">
        <p style="color: #999; font-size: 12px; margin-bottom: 20px;">Para dudas o soporte, contáctanos a info@sodarasorteosyrifas.com</p>
        <h3 style="color: #111; font-size: 18px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">SODARA — La emoción de ganar.</h3>
      </div>
    </div>
  </div>
</body>
</html>';

$enviado = enviar_correo_smtp($email, $asunto, $mensaje);
if ($enviado) {
    echo json_encode(["status" => "success", "message" => "Correo enviado correctamente a " . $email]);
} else {
    echo json_encode(["status" => "error", "message" => "No se pudo enviar el correo a " . $email]);
}
$conn->close();
?>
