-- Estructura de Base de Datos - SODARA Sorteos y Rifas (Sin datos sensibles)

CREATE TABLE IF NOT EXISTS `clientes` (
  `id` varchar(50) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `telefono` varchar(30) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT 'Online',
  `fecha_registro` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `sorteos` (
  `id` varchar(50) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `precio_boleta` decimal(12,2) NOT NULL DEFAULT 1000.00,
  `emision_total` int(11) NOT NULL DEFAULT 1000,
  `banner_url` varchar(255) DEFAULT NULL,
  `fecha_oficial` date DEFAULT NULL,
  `estado` varchar(50) DEFAULT 'activo',
  `loteria_oficial` varchar(100) DEFAULT 'Por definir',
  `publico_web` tinyint(1) DEFAULT 1,
  `combos_json` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pagos_pasarela` (
  `id_transaccion` varchar(100) NOT NULL,
  `cliente_id` varchar(50) DEFAULT NULL,
  `sorteo_id` varchar(50) DEFAULT NULL,
  `monto_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `metodo_pago` varchar(50) DEFAULT 'wompi',
  `estado_pago` varchar(50) DEFAULT 'Pendiente',
  `referencia_wompi` varchar(100) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT current_timestamp(),
  `email` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_transaccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `boletas_vendidas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sorteo_id` varchar(50) NOT NULL,
  `pago_id` varchar(100) NOT NULL,
  `numero_boleta` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unica_boleta_sorteo` (`sorteo_id`,`numero_boleta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `usuarios_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` varchar(50) DEFAULT 'admin',
  `foto_perfil` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tareas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `completada` tinyint(1) DEFAULT 0,
  `progreso` varchar(20) DEFAULT '0%',
  `cantidad` int(11) DEFAULT 1,
  `fecha` date DEFAULT curdate(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
