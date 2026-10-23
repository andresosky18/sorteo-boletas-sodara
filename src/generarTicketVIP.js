// Generador de Ticket VIP Oficial en Imagen PNG (HTML5 Canvas)

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function descargarTicketVIP({
  sorteo = 'GRAN SORTEO SODARA',
  numeros = [],
  cliente = 'Participante Oficial',
  referencia = 'SODARA-VIP',
  fecha = '',
  estado = 'Aprobado'
}) {
  const listaNumeros = Array.isArray(numeros) ? numeros : [numeros];
  const fechaFormateada = fecha || new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calcular filas de números para ajustar el alto si compró muchas boletas
  const cols = listaNumeros.length === 1 ? 1 : listaNumeros.length === 2 ? 2 : 3;
  const rows = Math.max(1, Math.ceil(listaNumeros.length / cols));
  const extraHeight = Math.max(0, (rows - 2) * 85);

  const width = 900;
  const height = 1420 + extraHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Fondo general oscuro de lujo
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#09090b');
  bgGrad.addColorStop(0.5, '#121216');
  bgGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Resplandor dorado sutil de fondo
  const glowGrad = ctx.createRadialGradient(width / 2, 220, 20, width / 2, 220, 480);
  glowGrad.addColorStop(0, 'rgba(234, 179, 8, 0.22)');
  glowGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, 650);

  // 2. Cuerpo del Ticket VIP
  const cardX = 65;
  const cardY = 65;
  const cardW = width - 130;
  const cardH = height - 130;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 42);
  const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  cardGrad.addColorStop(0, '#18181b');
  cardGrad.addColorStop(1, '#0f0f12');
  ctx.fillStyle = cardGrad;
  ctx.fill();

  // Borde dorado del ticket
  const borderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  borderGrad.addColorStop(0, '#fde047');
  borderGrad.addColorStop(0.5, '#eab308');
  borderGrad.addColorStop(1, '#a16207');
  ctx.lineWidth = 4;
  ctx.strokeStyle = borderGrad;
  ctx.stroke();
  ctx.restore();

  // 3. Franja superior dorada dentro del ticket
  ctx.save();
  drawRoundedRect(ctx, cardX + 2, cardY + 2, cardW - 4, 210, 40);
  const headerGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + 210);
  headerGrad.addColorStop(0, '#facc15');
  headerGrad.addColorStop(0.5, '#eab308');
  headerGrad.addColorStop(1, '#ca8a04');
  ctx.fillStyle = headerGrad;
  ctx.fill();
  ctx.restore();

  // 4. Cargar y dibujar el logo de Sodara centrado en el encabezado
  let logoImg = await loadImage('/logo_Negroo_Final.png');
  if (!logoImg) {
    logoImg = await loadImage('https://sodarasorteosyrifas.com/logo_Negroo_Final.png');
  }
  if (logoImg) {
    const maxLogoH = 135;
    const maxLogoW = 390;
    const ratio = Math.min(maxLogoW / logoImg.width, maxLogoH / logoImg.height);
    const lw = logoImg.width * ratio;
    const lh = logoImg.height * ratio;
    const lx = (width - lw) / 2;
    const ly = cardY + 22 + (maxLogoH - lh) / 2;
    ctx.save();
    drawRoundedRect(ctx, lx, ly, lw, lh, 18);
    ctx.clip();
    ctx.drawImage(logoImg, lx, ly, lw, lh);
    ctx.restore();
  } else {
    ctx.fillStyle = '#09090b';
    ctx.font = '900 54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SODARA', width / 2, cardY + 110);
  }

  // Etiqueta negra flotante "BOLETA OFICIAL VIP"
  const badgeW = 360;
  const badgeH = 50;
  const badgeX = (width - badgeW) / 2;
  const badgeY = cardY + 185;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 25);
  ctx.fillStyle = '#09090b';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#fde047';
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 21px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★  BOLETA OFICIAL VIP  ★', width / 2, badgeY + 32);

  // 5. Título del Sorteo
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SORTEO ACTIVO', width / 2, cardY + 295);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 40px sans-serif';
  const tituloUpper = String(sorteo || 'GRAN SORTEO SODARA').toUpperCase();
  ctx.fillText(tituloUpper.length > 28 ? tituloUpper.substring(0, 28) + '...' : tituloUpper, width / 2, cardY + 348);

  // 6. Caja de Números Jugados
  const boxX = cardX + 50;
  const boxY = cardY + 390;
  const boxW = cardW - 100;
  const boxH = 120 + rows * 85;

  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 28);
  ctx.fillStyle = 'rgba(234, 179, 8, 0.08)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)';
  ctx.stroke();

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    listaNumeros.length > 1 ? 'TUS NÚMEROS DE LA SUERTE' : 'TU NÚMERO DE LA SUERTE',
    width / 2,
    boxY + 48
  );

  // Dibujar cada número en su cápsula dorada
  const padX = 28;
  const gap = 18;
  const availW = boxW - padX * 2;
  const pillW = (availW - gap * (cols - 1)) / cols;
  const pillH = 68;

  listaNumeros.forEach((num, idx) => {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    // Centrar última fila si tiene menos elementos
    const itemsInRow = r === rows - 1 ? listaNumeros.length - r * cols : cols;
    const rowWidth = itemsInRow * pillW + (itemsInRow - 1) * gap;
    const startX = boxX + (boxW - rowWidth) / 2;

    const px = startX + c * (pillW + gap);
    const py = boxY + 75 + r * (pillH + 17);

    drawRoundedRect(ctx, px, py, pillW, pillH, 18);
    const pillGrad = ctx.createLinearGradient(px, py, px + pillW, py + pillH);
    pillGrad.addColorStop(0, '#eab308');
    pillGrad.addColorStop(1, '#ca8a04');
    ctx.fillStyle = pillGrad;
    ctx.fill();

    ctx.fillStyle = '#09090b';
    ctx.font = '900 34px monospace';
    ctx.textAlign = 'center';
    const numStr = '#' + String(num).padStart(2, '0');
    ctx.fillText(numStr, px + pillW / 2, py + 46);
  });

  // 7. Datos del titular y estado
  const infoStartY = boxY + boxH + 60;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('TITULAR DE LA BOLETA', boxX + 10, infoStartY);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  const nombreLimpio = String(cliente || 'Cliente Oficial').toUpperCase();
  ctx.fillText(nombreLimpio.length > 26 ? nombreLimpio.substring(0, 26) + '...' : nombreLimpio, boxX + 10, infoStartY + 40);

  // Estado
  const esPagada = String(estado).toLowerCase() === 'aprobado' || String(estado).toLowerCase() === 'pagado';
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('ESTADO OFICIAL', boxX + 10, infoStartY + 100);

  // Sello de estado
  const statusX = boxX + 10;
  const statusY = infoStartY + 118;
  const statusW = 360;
  const statusH = 48;
  drawRoundedRect(ctx, statusX, statusY, statusW, statusH, 14);
  ctx.fillStyle = esPagada ? 'rgba(16, 185, 129, 0.16)' : 'rgba(245, 158, 11, 0.16)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = esPagada ? '#10b981' : '#f59e0b';
  ctx.stroke();

  ctx.fillStyle = esPagada ? '#34d399' : '#fbbf24';
  ctx.font = 'bold 21px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    esPagada ? '✓  PAGADA Y VERIFICADA' : '⏳  PENDIENTE DE VERIFICACIÓN',
    statusX + statusW / 2,
    statusY + 31
  );

  // 8. Línea punteada de corte de boleto + Muescas laterales
  const tearY = infoStartY + 210;

  // Muesca izquierda
  ctx.beginPath();
  ctx.arc(cardX, tearY, 28, -Math.PI / 2, Math.PI / 2);
  ctx.fillStyle = '#09090b';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#eab308';
  ctx.stroke();

  // Muesca derecha
  ctx.beginPath();
  ctx.arc(cardX + cardW, tearY, 28, Math.PI / 2, -Math.PI / 2);
  ctx.fillStyle = '#09090b';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#eab308';
  ctx.stroke();

  // Línea punteada central
  ctx.save();
  ctx.setLineDash([14, 12]);
  ctx.beginPath();
  ctx.moveTo(cardX + 45, tearY);
  ctx.lineTo(cardX + cardW - 45, tearY);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
  ctx.stroke();
  ctx.restore();

  // 9. Talón inferior (Fecha, Referencia y Código de Barras)
  const stubY = tearY + 55;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('FECHA DE COMPRA', boxX + 10, stubY);
  ctx.fillStyle = '#f4f4f5';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(String(fechaFormateada), boxX + 10, stubY + 32);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('REFERENCIA / COMPROBANTE', boxX + boxW - 10, stubY);
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 22px monospace';
  const refCorta = String(referencia || 'SODARA-VIP').substring(0, 22);
  ctx.fillText(refCorta, boxX + boxW - 10, stubY + 32);

  // Código de barras decorativo
  const barY = stubY + 65;
  const barH = 56;
  const barStartX = width / 2 - 220;
  let curX = barStartX;
  const pattern = [4, 2, 6, 3, 2, 5, 2, 2, 6, 4, 2, 3, 5, 2, 4, 2, 6, 2, 3, 4, 2, 5, 3, 2, 6, 2, 4, 3, 2, 5, 4, 2, 6, 3, 2, 4];
  ctx.fillStyle = '#e4e4e7';
  pattern.forEach((w, i) => {
    if (i % 2 === 0) {
      ctx.fillRect(curX, barY, w * 2.2, barH);
    }
    curX += w * 2.2 + 2;
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('www.sodarasorteosyrifas.com  •  Comprobante Oficial', width / 2, barY + barH + 34);

  // 10. Descargar archivo PNG
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const sufijo = listaNumeros.join('-');
  link.download = `Boleta_VIP_Sodara_${sufijo}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
