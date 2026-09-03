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

    // Invertir horizontalmente para que miren a la DERECHA
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

    // Centros matemáticos exactos medidos por análisis de píxeles:
    // Civic: Original Front (X=223, Y=237), Original Rear (X=741.5, Y=233)
    // Mustang: Original Front (X=210, Y=242), Original Rear (X=750, Y=238)
    const frontRatioX = isMustang ? (210 / 1024) : (223 / 1024);
    const rearRatioX  = isMustang ? (750 / 1024) : (741.5 / 1024);

    const frontRatioY = isMustang ? (242 / 341) : (237 / 341);
    const rearRatioY  = isMustang ? (238 / 341) : (233 / 341);

    const wheelRadius = isMustang ? drawHeight * 0.17 : drawHeight * 0.16;

    // Dibujar los radios giratorios en la posición exacta
    drawSpinningWheelRim(ctx, drawX + drawWidth * frontRatioX, drawY + drawHeight * frontRatioY, wheelRadius, car.x, isMustang);
    drawSpinningWheelRim(ctx, drawX + drawWidth * rearRatioX,  drawY + drawHeight * rearRatioY,  wheelRadius, car.x, isMustang);

    // Escape y Llamaradas de backfire en la cola
    const exhaustX = isMustang ? drawWidth * 0.48 : drawWidth * 0.46;
    const exhaustY = 4;

    if (car.backfireTimer > 0) {
        drawExhaustFlame(ctx, exhaustX, exhaustY);
    }

    ctx.restore();
}

function drawSpinningWheelRim(ctx, cx, cy, radius, distanceMeters, isMustang) {
    ctx.save();
    ctx.translate(cx, cy);

    // Giro hacia adelante sincronizado con la distancia
    const tireRadiusMeters = 0.32;
    const rotationAngle = -(distanceMeters / tireRadiusMeters);
    ctx.rotate(rotationAngle);

    // Fondo del centro del rin para fusionarse de forma limpia
    ctx.fillStyle = isMustang ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.45)";
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // Radios giratorios
    const spokes = isMustang ? 5 : 7;
    const spokeColor = isMustang ? "rgba(203, 213, 225, 0.9)" : "rgba(255, 255, 255, 0.95)";
    const hubColor = isMustang ? "#1e293b" : "#dc2626"; // Punto rojo Honda Type R

    ctx.strokeStyle = spokeColor;
    ctx.lineWidth = 1.6;

    for (let i = 0; i < spokes; i++) {
        const rad = (i * Math.PI * 2) / spokes;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rad) * (radius * 0.72), Math.sin(rad) * (radius * 0.72));
        ctx.stroke();
    }

    // Tuerca central
    ctx.fillStyle = hubColor;
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawExhaustFlame(ctx, x, y) {
    const flameLen = 14 + Math.random() * 20;
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
