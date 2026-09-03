// Renderizado detallado en Pixel Art fiel a la referencia real
export function drawPixelCar(ctx, car, screenX, screenY) {
    ctx.save();
    ctx.translate(Math.round(screenX), Math.round(screenY));

    const isMustang = car.config.id === "mustang";

    // 1. Sombra bajo el auto con degradado suave
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 64, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isMustang) {
        drawMustangGT(ctx, car);
    } else {
        // Honda Civic EK9 Type R amarillo Phoenix Yellow fiel a la foto
        drawCivicEK9TypeR(ctx, car);
    }

    // Escape y Llamaradas de backfire
    const exhaustX = isMustang ? -56 : -52;
    const exhaustY = 9;
    ctx.fillStyle = "#64748b";
    ctx.fillRect(exhaustX - 2, exhaustY, 4, 4);

    if (car.backfireTimer > 0) {
        drawExhaustFlame(ctx, exhaustX - 3, exhaustY + 2);
    }

    ctx.restore();
}

function drawCivicEK9TypeR(ctx, car) {
    // Paleta oficial Phoenix Yellow (Honda Civic Type R EK9)
    const bodyColor = "#fcd34d"; // Amarillo principal brillante
    const shadowColor = "#eab308"; // Sombra de carrocería
    const highlightColor = "#fef08a"; // Reflejos de luz en los bordes superiores
    const trimColor = "#1e293b"; // Molduras de plástico negro
    const glassColor = "#0f172a"; // Lunas oscurecidas
    const glassReflection = "#334155";

    // --- CARROCERÍA PRINCIPAL (CHASIS EK9 HATCHBACK) ---
    // Línea base y faldones laterales
    ctx.fillStyle = shadowColor;
    ctx.fillRect(-50, 6, 100, 7);

    // Lateral central y puertas
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-48, -4, 98, 11);

    // Reflejo superior del guardabarros delantero y capó caído característico
    ctx.fillStyle = highlightColor;
    ctx.fillRect(15, -4, 30, 2);
    ctx.fillRect(-45, -4, 40, 2);

    // Morro delantero inclinado aerodinámico
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(15, -4);
    ctx.lineTo(46, -1);
    ctx.lineTo(52, 5);
    ctx.lineTo(52, 13);
    ctx.lineTo(38, 13);
    ctx.closePath();
    ctx.fill();

    // Labio delantero / Lip spoiler bajo la defensa
    ctx.fillStyle = shadowColor;
    ctx.fillRect(44, 11, 9, 3);
    ctx.fillStyle = trimColor;
    ctx.fillRect(46, 7, 6, 3); // Toma de aire frontal intercooler

    // --- TECHO, PILARES Y CRISTALES ---
    // Cabina / Techo
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-35, -17, 52, 4);
    ctx.fillStyle = highlightColor;
    ctx.fillRect(-34, -17, 50, 1);

    // Pilar C trasero grueso (icónico del Civic Hatchback)
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(-35, -17);
    ctx.lineTo(-24, -17);
    ctx.lineTo(-12, -4);
    ctx.lineTo(-46, -4);
    ctx.closePath();
    ctx.fill();

    // Ventana trasera inclinada
    ctx.fillStyle = glassColor;
    ctx.beginPath();
    ctx.moveTo(-35, -14);
    ctx.lineTo(-18, -14);
    ctx.lineTo(-16, -4);
    ctx.lineTo(-42, -4);
    ctx.closePath();
    ctx.fill();

    // Ventana lateral delantera con pilar A inclinado
    ctx.fillStyle = glassColor;
    ctx.beginPath();
    ctx.moveTo(-14, -14);
    ctx.lineTo(14, -14);
    ctx.lineTo(24, -4);
    ctx.lineTo(-14, -4);
    ctx.closePath();
    ctx.fill();

    // Reflejo de luz en los cristales
    ctx.fillStyle = glassReflection;
    ctx.fillRect(-10, -12, 18, 2);

    // Espejo retrovisor ovalado amarillo (como en la foto)
    ctx.fillStyle = bodyColor;
    ctx.fillRect(18, -6, 6, 4);
    ctx.fillStyle = shadowColor;
    ctx.fillRect(16, -4, 3, 2);

    // Manilla de la puerta color carrocería
    ctx.fillStyle = shadowColor;
    ctx.fillRect(-2, 0, 7, 2);

    // Moldura lateral de protección negra que cruza la puerta
    ctx.fillStyle = trimColor;
    ctx.fillRect(-45, 3, 90, 2);

    // Tapa de combustible circular en la aleta trasera
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(-36, -1, 6, 6);

    // Emblema "Type R" en rojo icónico en el lateral
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(-12, 6, 6, 2);

    // --- ALERÓN TRASERO ELEVADO (SPOILER TYPE R) ---
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(-38, -17);
    ctx.lineTo(-50, -21);
    ctx.lineTo(-44, -21);
    ctx.lineTo(-34, -17);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = highlightColor;
    ctx.fillRect(-50, -21, 12, 1);

    // --- FAROS DELANTEROS Y TRASEROS ---
    // Faro delantero alargado transparente con fondo cromado
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(42, -2);
    ctx.lineTo(51, 4);
    ctx.lineTo(44, 5);
    ctx.closePath();
    ctx.fill();
    // Proyector interno
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(45, 1, 3, 3);

    // Luz trasera vertical roja Type R
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(-48, -4, 3, 8);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-48, 0, 3, 2); // Luz de reversa blanca central

    // --- RUEDAS: RINES BLANCOS MULTIRADIO TYPE R (ENKEI RACING) ---
    const wheelY = 12;
    const frontWheelX = 32;
    const rearWheelX = -32;
    const tireRadius = 10;

    drawTypeRWhiteWheel(ctx, frontWheelX, wheelY, tireRadius, car.velocity);
    drawTypeRWhiteWheel(ctx, rearWheelX, wheelY, tireRadius, car.velocity);
}

function drawMustangGT(ctx, car) {
    const bodyColor = "#e11d48";
    const shadowColor = "#9f1239";
    const highlightColor = "#fda4af";

    // Chasis Muscle Car largo y ancho
    ctx.fillStyle = shadowColor;
    ctx.fillRect(-55, 6, 114, 7);

    ctx.fillStyle = bodyColor;
    ctx.fillRect(-53, -4, 110, 11);

    // Capó largo y plano
    ctx.fillStyle = highlightColor;
    ctx.fillRect(5, -4, 48, 2);
    ctx.fillRect(20, -7, 24, 3); // Toma de aire de capó V8

    // Morro delantero recto y agresivo
    ctx.fillStyle = bodyColor;
    ctx.fillRect(40, -3, 17, 15);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(54, 4, 4, 6); // Rejilla frontal

    // Cabina fastback retrasada
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(-20, -18);
    ctx.lineTo(18, -18);
    ctx.lineTo(34, -4);
    ctx.lineTo(-44, -4);
    ctx.closePath();
    ctx.fill();

    // Cristales
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(-16, -15);
    ctx.lineTo(15, -15);
    ctx.lineTo(28, -4);
    ctx.lineTo(-24, -4);
    ctx.closePath();
    ctx.fill();

    // Faros LED afilados
    ctx.fillStyle = "#fef08a";
    ctx.fillRect(53, -1, 4, 4);

    // Luces traseras de 3 barras
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(-54, -2, 2, 7);

    // Ruedas Mustang (Rines oscuros de gran diámetro)
    const wheelY = 12;
    drawSportDarkWheel(ctx, 36, wheelY, 11, car.velocity);
    drawSportDarkWheel(ctx, -36, wheelY, 11, car.velocity);
}

// Rueda blanca Type R con caliper de freno rojo y tuercas
function drawTypeRWhiteWheel(ctx, x, y, radius, velocity) {
    // 1. Goma del neumático (Slick de perfil bajo)
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Disco de freno perforado detrás del rin
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.arc(x, y, radius - 2, 0, Math.PI * 2);
    ctx.fill();

    // Caliper de freno rojo Brembo
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x + 2, y - 6, 3, 5);

    // 3. Rin blanco estilo Championship White multirradio
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.arc(x, y, radius - 3, 0, Math.PI * 2);
    ctx.fill();

    // Huecos entre radios (fondo oscuro)
    ctx.fillStyle = "#334155";
    const angle = (velocity * 0.1) % (Math.PI * 2);
    for (let i = 0; i < 6; i++) {
        const rad = angle + (i * Math.PI / 3);
        const hx = x + Math.cos(rad) * 4;
        const hy = y + Math.sin(rad) * 4;
        ctx.beginPath();
        ctx.arc(hx, hy, 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Tuerca central roja H
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
}

function drawSportDarkWheel(ctx, x, y, radius, velocity) {
    ctx.fillStyle = "#09090b";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#475569";
    ctx.beginPath();
    ctx.arc(x, y, radius - 3, 0, Math.PI * 2);
    ctx.fill();

    // Caliper amarillo de gran potencia
    ctx.fillStyle = "#eab308";
    ctx.fillRect(x - 6, y - 5, 3, 6);

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawExhaustFlame(ctx, x, y) {
    const flameLen = 10 + Math.random() * 16;
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(x - flameLen * 0.3, y - 1, flameLen * 0.3, 3);

    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x - flameLen, y);
    ctx.lineTo(x, y + 3);
    ctx.fill();

    ctx.fillStyle = "#fef08a";
    ctx.fillRect(x - flameLen - 3, y - 1 + (Math.random() * 2 - 1), 3, 2);
}
