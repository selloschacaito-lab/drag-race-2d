// Cargador de Sprites Pixel Art Oficiales
export const CarSprites = {
    civic: new Image(),
    mustang: new Image(),
    loaded: { civic: false, mustang: false }
};

CarSprites.civic.src = "assets/civic_ek9.png";
CarSprites.civic.onload = () => { CarSprites.loaded.civic = true; };

CarSprites.mustang.src = "assets/mustang_fastback.png";
CarSprites.mustang.onload = () => { CarSprites.loaded.mustang = true; };

export function drawPixelCar(ctx, car, screenX, screenY) {
    ctx.save();
    ctx.translate(Math.round(screenX), Math.round(screenY));

    const isMustang = car.config.id === "mustang";
    const img = isMustang ? CarSprites.mustang : CarSprites.civic;
    const isLoaded = isMustang ? CarSprites.loaded.mustang : CarSprites.loaded.civic;

    const drawWidth = isMustang ? 165 : 155;
    const drawHeight = (drawWidth * 341) / 1024;

    // Invertir horizontalmente para que miren hacia la DERECHA
    ctx.scale(-1, 1);

    const drawX = -drawWidth / 2;
    const drawY = -drawHeight + 14;

    if (isLoaded) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else {
        ctx.fillStyle = isMustang ? "#e11d48" : "#fcd34d";
        ctx.fillRect(drawX, drawY + 15, drawWidth, drawHeight - 15);
    }

    // Efecto de rotación / giro en las ruedas
    // Las posiciones relativas de las ruedas en la imagen:
    // Civic: rueda trasera ~21%, delantera ~79%
    // Mustang: rueda trasera ~18%, delantera ~76%
    const rearWheelPercent = isMustang ? 0.19 : 0.22;
    const frontWheelPercent = isMustang ? 0.75 : 0.77;
    const wheelCenterY = drawY + drawHeight * 0.73;
    const wheelRadius = isMustang ? drawHeight * 0.24 : drawHeight * 0.23;

    drawSpinningWheelRim(ctx, drawX + drawWidth * rearWheelPercent, wheelCenterY, wheelRadius, car.x, isMustang);
    drawSpinningWheelRim(ctx, drawX + drawWidth * frontWheelPercent, wheelCenterY, wheelRadius, car.x, isMustang);

    // Escape y Llamaradas de backfire (en la parte trasera del auto invertido)
    // Al estar invertido con scale(-1, 1), la parte trasera está en +drawWidth * 0.46
    const exhaustX = isMustang ? drawWidth * 0.48 : drawWidth * 0.46;
    const exhaustY = 4;

    if (car.backfireTimer > 0) {
        drawExhaustFlame(ctx, exhaustX, exhaustY);
    }

    ctx.restore();
}

// Dibuja los rayos del rin girando según la distancia recorrida
function drawSpinningWheelRim(ctx, cx, cy, radius, distanceMeters, isMustang) {
    ctx.save();
    ctx.translate(cx, cy);

    // Ángulo de rotación según la distancia recorrida (giro hacia adelante)
    const tireRadiusMeters = 0.32;
    const rotationAngle = -(distanceMeters / tireRadiusMeters);
    ctx.rotate(rotationAngle);

    // Dibujar radios giratorios estilizados
    const spokes = isMustang ? 5 : 7; // 5 radios Mustang, 7 radios Civic Enkei
    const spokeColor = isMustang ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.85)";
    const hubColor = isMustang ? "#475569" : "#dc2626"; // Centro rojo Honda

    ctx.strokeStyle = spokeColor;
    ctx.lineWidth = 2;

    for (let i = 0; i < spokes; i++) {
        const rad = (i * Math.PI * 2) / spokes;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rad) * (radius * 0.65), Math.sin(rad) * (radius * 0.65));
        ctx.stroke();
    }

    // Tuerca / centro de rueda
    ctx.fillStyle = hubColor;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawExhaustFlame(ctx, x, y) {
    const flameLen = 14 + Math.random() * 20;
    // Al estar invertido el contexto, el fuego sale hacia atrás
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(x, y - 2, flameLen * 0.3, 4);

    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x + flameLen, y);
    ctx.lineTo(x, y + 4);
    ctx.fill();

    ctx.fillStyle = "#fef08a";
    ctx.fillRect(x + flameLen - 2, y - 2 + (Math.random() * 4 - 2), 4, 3);
}
