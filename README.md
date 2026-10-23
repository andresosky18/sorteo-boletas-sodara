# Plataforma Web de Sorteos y Rifas (SODARA)

Sistema completo para la gestión, venta en línea y administración de sorteos y boletas digitales, desarrollado con **React + Vite + Tailwind CSS** en el Frontend y **PHP + MySQL + PHPMailer** en el Backend, integrado con la pasarela de pagos **Wompi**.

---

##  Características Principales

- **Catálogo y Tienda de Boletas:** Selección manual en grilla interactiva o mediante **Combos Rápidos personalizables** (`x5`, `x15`, `x30`, etc.).
- **Pasarela de Pagos Wompi:** Integración con firma criptográfica de integridad (`SHA-256`) y confirmación vía Webhook / verificación en tiempo real.
- **Boleta VIP Descargable (PNG HD):** Generación dinámica en HTML5 Canvas para descarga inmediata del participante.
- **Notificaciones por Correo (SMTP):** Envío automático y reenvío manual de comprobantes oficiales con diseño personalizado.
- **Panel Administrativo (`/sodara-admin`):**
  - **Dashboard en Tiempo Real:** Recaudación, boletas pagadas/apartadas, gráficos mensuales, semanales y de movimientos por día (Zona horaria `America/Bogota`).
  - **Gestión de Sorteos:** Creación, edición, ocultamiento, eliminación en cascada y editor dinámico de combos rápidos.
  - **Gestión de Boletas y Clientes:** Liberación manual y automática de boletas no pagadas, buscador de boletas y reenvío de comprobantes.
  - **Agrupación Inteligente de Movimientos:** Consolidación automática de múltiples boletas compradas por un mismo cliente.

---

##  Instalación y Configuración

### 1. Frontend (React + Vite)
```bash
npm install
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción en /dist
```

### 2. Base de Datos (MySQL / MariaDB)
Importar el esquema limpio ubicado en:
- `database_schema.example.sql`

### 3. Backend (PHP + Composer)
1. Copiar `backend/conexion.example.php` a `backend/conexion.php` y colocar las credenciales reales de MySQL y el secreto de integridad de Wompi.
2. Copiar `backend/enviar_correo.example.php` a `backend/enviar_correo.php` y configurar las credenciales SMTP.
3. Instalar dependencias de `PHPMailer` dentro de `backend/`:
   ```bash
   cd backend
   composer install
   ```

---

## 🔒 Seguridad del Repositorio
Todos los archivos con credenciales reales (`backend/conexion.php`, `backend/enviar_correo.php`), volcados de base de datos con registros de clientes (`*.sql`) y paquetes de despliegue (`*.zip`) están excluidos mediante `.gitignore`.
