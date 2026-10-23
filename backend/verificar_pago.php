<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'conexion.php';
require 'enviar_correo.php';

$id_transaccion = isset($_GET['id']) ? $_GET['id'] : '';

if (!$id_transaccion) {
    echo json_encode(['status' => 'error', 'message' => 'ID no proporcionado']);
    exit;
}

// Para Sandbox, consultar la API de Wompi (pública para GET transactions)

$url = "https://production.wompi.co/v1/transactions/" . $id_transaccion;
$ch_test = curl_init();
curl_setopt($ch_test, CURLOPT_URL, $url);
curl_setopt($ch_test, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch_test);
$httpcode = curl_getinfo($ch_test, CURLINFO_HTTP_CODE);
curl_close($ch_test);

if ($httpcode !== 200) {
    $url = "https://sandbox.wompi.co/v1/transactions/" . $id_transaccion;
}


$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$wompi_data = json_decode($response, true);

if (isset($wompi_data['data']['status'])) {
    $estado_wompi = $wompi_data['data']['status'];
    
    $estado_db = 'Pendiente';
    if ($estado_wompi === 'APPROVED') {
        $estado_db = 'Aprobado';
    } elseif (in_array($estado_wompi, ['DECLINED', 'VOIDED', 'ERROR'])) {
        $estado_db = 'Rechazado';
    }
    
    // Obtener la referencia
    $referencia = $wompi_data['data']['reference'];
    
    // Obtener estado actual para evitar doble correo
    $stmt_check = $conn->prepare("SELECT estado_pago FROM pagos_pasarela WHERE id_transaccion = ?");
    $stmt_check->bind_param("s", $referencia);
    $stmt_check->execute();
    $res_check = $stmt_check->get_result();
    $estado_actual = 'Pendiente';
    if ($res_check->num_rows > 0) {
        $estado_actual = $res_check->fetch_assoc()['estado_pago'];
    }

    // Actualizar DB
    $stmt = $conn->prepare("UPDATE pagos_pasarela SET estado_pago = ? WHERE id_transaccion = ?");
    if ($stmt) {
        $stmt->bind_param("ss", $estado_db, $referencia);
        $stmt->execute();
        
        if ($estado_db === 'Rechazado') {
            $stmt_del = $conn->prepare("DELETE FROM boletas_vendidas WHERE pago_id = ?");
            $stmt_del->bind_param("s", $referencia);
            $stmt_del->execute();
        }

        
        // Si fue aprobado, enviar correo (si no se ha enviado)
        if ($estado_db === 'Aprobado' && $estado_actual !== 'Aprobado') {
            $sql_email = "
                SELECT c.nombre_completo AS nombre, p.email, b.numero_boleta as numero, s.titulo, p.estado_pago
                FROM pagos_pasarela p
                JOIN boletas_vendidas b ON p.id_transaccion = b.pago_id
                JOIN clientes c ON p.cliente_id = c.id
                JOIN sorteos s ON b.sorteo_id = s.id
                WHERE p.id_transaccion = ?
            ";
            $stmt_mail = $conn->prepare($sql_email);
            $stmt_mail->bind_param("s", $referencia);
            $stmt_mail->execute();
            $res = $stmt_mail->get_result();
            
            if ($res->num_rows > 0) {
                $row_first = $res->fetch_assoc();
                
                // NOTA: Para evitar enviar 2 veces el correo (por webhook y por aquí), deberíamos marcar que se envió.
                // Como no tenemos columna, simplemente mandamos este para asegurar. Wompi sandbox aveces falla.
                $nombre_cliente = $row_first['nombre'];
                $email_cliente = $row_first['email'];
                $sorteo_titulo = $row_first['titulo'];
                $boletas = [$row_first['numero']];
                
                while($row = $res->fetch_assoc()) {
                    $boletas[] = $row['numero'];
                }
                
                $boletas_str = implode(', #', $boletas);
                
                enviarCorreoExito($email_cliente, $nombre_cliente, $sorteo_titulo, $boletas_str, $referencia);
            }
        }
        
        echo json_encode(['status' => 'success', 'estado' => $estado_db]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error BD']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Transaccion no encontrada']);
}

$conn->close();

function enviarCorreoExito($destinatario, $nombre, $sorteo, $boletas, $ref) {
    $asunto = "¡Tu compra fue exitosa! - SODARA";
    
    // Separar boletas para mostrarlas en lista
    $lista_boletas = '';
    $arr_boletas = explode(', #', $boletas);
    foreach ($arr_boletas as $b) {
        $clean_b = str_replace('#', '', $b);
        $lista_boletas .= '<div style="background:#f5f5f5; border-radius:10px; padding:10px; margin-bottom:5px; font-weight:bold; font-size:16px;">🎟️ #'.htmlspecialchars(trim($clean_b)).'</div>';
    }

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
        .logo-text { font-weight: 900; font-size: 20px; color: #111; text-align: left; margin-bottom: 20px; }
        .hero-image { width: 100%; max-width: 250px; height: auto; margin: 0 auto; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1)); }
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
           <p style="color:#111; font-weight:700; margin-top:20px; font-size:16px;">🤍 Tu participación está confirmada.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px 0;">
          <div class="card">
            <h2 class="card-title">Resumen de tu compra</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 15px;">
              <tr><td style="color: #888; font-size: 13px; padding-bottom: 15px;">Sorteo</td><td style="color: #111; font-weight: 700; font-size: 13px; text-align: right; padding-bottom: 15px;">'.htmlspecialchars($sorteo).'</td></tr>
              <tr><td style="color: #888; font-size: 13px; padding-bottom: 15px;">Referencia</td><td style="color: #111; font-weight: 700; font-size: 13px; text-align: right; padding-bottom: 15px;">'.htmlspecialchars($ref).'</td></tr>
              <tr><td style="color: #888; font-size: 13px;">Estado</td><td style="color: #111; font-weight: 700; font-size: 13px; text-align: right;">Pagado y Confirmado</td></tr>
            </table>
            
            <div style="margin-top:30px; font-size:15px; color:#555; line-height:1.6;">
                <p>Ahora viene esa parte emocionante…<br>imaginar que uno de tus números podría ser el ganador. ✨</p>
                <p>Cruza los dedos 🤞🏻, confía en tu suerte y prepárate para vivir la emoción de SODARA.</p>
                <p>🍀 Porque nunca sabes cuándo un número puede llevarte a un gran premio.</p>
                <p>Gracias por elegirnos y ser parte de esta experiencia. 🤍</p>
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

    $cabeceras = "MIME-Version: 1.0" . "
";
    $cabeceras .= "Content-type:text/html;charset=UTF-8" . "
";
    $cabeceras .= "From: SODARA <info@sodarasorteosyrifas.com>" . "
";

    
    
    $log_msg = "[" . date('Y-m-d H:i:s') . "] Intentando enviar correo a: " . $destinatario . " (Sorteo: " . $sorteo . ", Ref: " . $ref . ")\n";
    file_put_contents(__DIR__ . '/log_correos.txt', $log_msg, FILE_APPEND);
    
    // USAR SMTP
    enviar_correo_smtp($destinatario, $asunto, $mensaje);
    

}
?>