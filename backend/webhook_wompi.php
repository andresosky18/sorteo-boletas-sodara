<?php
// webhook_wompi.php
ini_set('display_errors', 0); // No mostrar errores
error_reporting(E_ALL);

require 'conexion.php';
require 'enviar_correo.php';

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

file_put_contents('wompi_logs.txt', date('[Y-m-d H:i:s] ') . $inputJSON . PHP_EOL, FILE_APPEND);

if (!$data || !isset($data['event'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Payload invalido']);
    exit;
}


// Verificar firma de Eventos Wompi para seguridad
$wompi_events_secret = $wompi_events_secret ?? (getenv('WOMPI_EVENTS_SECRET') ?: 'TU_WOMPI_EVENTS_SECRET');
$signature = $data['signature'] ?? null;
if ($signature && isset($signature['properties'], $signature['checksum'])) {
    $props = $signature['properties'];
    $timestamp = $data['timestamp'] ?? '';
    
    // Concatenar valores segun documentacion de Wompi
    $cadena = '';
    foreach ($props as $prop) {
        $keys = explode('.', $prop);
        $val = $data['data'];
        foreach ($keys as $k) {
            $val = $val[$k] ?? '';
        }
        $cadena .= $val;
    }
    $cadena .= $timestamp . $wompi_events_secret;
    $hash_calculado = hash('sha256', $cadena);
    
    if ($hash_calculado !== $signature['checksum']) {
        http_response_code(401);
        echo json_encode(['error' => 'Firma invalida']);
        exit;
    }
}

if ($data['event'] === 'transaction.updated') {
    $transaction = $data['data']['transaction'];
    $referencia = $transaction['reference']; // Esta es la referencia, la usamos como id_transaccion en DB
    $estado_wompi = $transaction['status'];

    $estado_db = 'Pendiente';
    if ($estado_wompi === 'APPROVED') {
        $estado_db = 'Aprobado';
    } elseif (in_array($estado_wompi, ['DECLINED', 'VOIDED', 'ERROR'])) {
        $estado_db = 'Rechazado';
    }

    // Actualizar la base de datos (Nota: en procesar_checkout insertamos en id_transaccion)
    $stmt = $conn->prepare("UPDATE pagos_pasarela SET estado_pago = ? WHERE id_transaccion = ?");
    if ($stmt) {
        $stmt->bind_param("ss", $estado_db, $referencia);
        $stmt->execute();
        
        if ($estado_db === 'Rechazado') {
            $stmt_del = $conn->prepare("DELETE FROM boletas_vendidas WHERE pago_id = ?");
            $stmt_del->bind_param("s", $referencia);
            $stmt_del->execute();
        }

        
        // Si fue aprobado, enviar el correo
        if ($estado_db === 'Aprobado' && $estado_actual !== 'Aprobado') {
            // Obtener el email del cliente y su nombre
            $sql_email = "
                SELECT c.nombre_completo AS nombre, p.email, b.numero_boleta as numero, s.titulo
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
                // Hay boletas. Agrupar numeros de boleta
                $row_first = $res->fetch_assoc();
                $nombre_cliente = $row_first['nombre'];
                $email_cliente = $row_first['email'];
                $sorteo_titulo = $row_first['titulo'];
                $boletas = [$row_first['numero']];
                
                while($row = $res->fetch_assoc()) {
                    $boletas[] = $row['numero'];
                }
                
                $boletas_str = implode(', #', $boletas);
                
                // Enviar correo
                enviarCorreoExito($email_cliente, $nombre_cliente, $sorteo_titulo, $boletas_str, $referencia);
            }
        }
        
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Estado actualizado a ' . $estado_db]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error en la consulta']);
    }
} else {
    http_response_code(200);
    echo json_encode(['status' => 'ignored']);
}

$conn->close();

function enviarCorreoExito($destinatario, $nombre, $sorteo, $boletas, $ref) {
    $asunto = "¡Tu compra fue exitosa! - SODARA";
    
    // Separar boletas para mostrarlas en lista
    $lista_boletas = '';
    $arr_boletas = explode(', #', $boletas);
    foreach ($arr_boletas as $b) {
        $clean_b = str_pad(trim(str_replace('#', '', $b)), 4, '0', STR_PAD_LEFT);
        $lista_boletas .= '<div style="background:#f5f5f5; border-radius:10px; padding:10px; margin-bottom:5px; font-weight:bold; font-size:16px;">🎟️ #'.htmlspecialchars($clean_b).'</div>';
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