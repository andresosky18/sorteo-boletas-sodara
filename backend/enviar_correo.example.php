<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

// Copiar este archivo como 'enviar_correo.php' y configurar tus credenciales SMTP
function enviar_correo_smtp($destinatario, $asunto, $mensaje_html) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.tu-dominio.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@tu-dominio.com';
        $mail->Password   = 'TU_PASSWORD_SMTP';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom('info@tu-dominio.com', 'SODARA Sorteos y Rifas');
        $mail->addAddress($destinatario);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = $asunto;
        $mail->Body    = $mensaje_html;

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}
?>
