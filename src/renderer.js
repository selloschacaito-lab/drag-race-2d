// Cargador de Sprites Pixel Art Oficiales
export const CarSprites = {
    civic: new Image(),
    civicWheelF: new Image(),
    civicWheelR: new Image(),
    mustang: new Image(),
    mustangWheelF: new Image(),
    mustangWheelR: new Image(),
    loaded: 0
};

function onImgLoad() {
    CarSprites.loaded++;
}

CarSprites.civic.src = "assets/civic_ek9.png";
CarSprites.civic.onload = onImgLoad;

CarSprites.civicWheelF.src = "assets/civic_wheel_front.png";
CarSprites.civicWheelF.onload = onImgLoad;

CarSprites.civicWheelR.src = "assets/civic_wheel_rear.png";
CarSprites.civicWheelR.onload = onImgLoad;

CarSprites.mustang.src = "assets/mustang_fastback.png";
CarSprites.mustang.onload = onImgLoad;

CarSprites.mustangWheelF.src = "assets/mustang_wheel_front.png";
CarSprites.mustangWheelF.onload = onImgLoad;

CarSprites.mustangWheelR.src = "assets/mustang_wheel_rear.png";
CarSprites.mustangWheelR.onload = onImgLoad;

export function drawPixelCar(ctx, car, screenX, screenY) {
    ctx.save();
    ctx.translate(Math.round(screenX), Math.round(screenY));

    const isMustang = car.config.id === "mustang";
    const carImg = isMustang ? CarSprites.mustang : CarSprites.civic;
    const wheelFImg = isMustang ? CarSprites.mustangWheelF : CarSprites.civicWheelF;
    const wheelRImg = isMustang ? CarSprites.mustangWheelR : CarSprites.civicWheelR;

    const drawWidth = isMustang ? 165 : 155;
    const drawHeight = (drawWidth * 341) / 1024;

    // Voltear hacia la DERECHA
    ctx.scale(-1, 1);

    const drawX = -drawWidth / 2;
    const drawY = -drawHeight + 14;

    ctx.imageSmoothingEnabled = false;

    // 1. Dibujar el auto original completo
    ctx.drawImage(carImg, drawX, drawY, drawWidth, drawHeight);

    // 2. Coordenadas y tamaños exactos de las ruedas recortadas
    const scale = drawWidth / 1024;
    
    // Civic: Delantera X=224, Y=238. Trasera X=796, Y=240. Radio=68px
    // Mustang: Delantera X=210, Y=242. Trasera X=750, Y=238. Radio=85px
    const fX = isMustang ? 210 : 224;
    const fY = isMustang ? 242 : 238;
    const rX = isMustang ? 750 : 796;
    const rY = isMustang ? 238 : 240;
    const rRadius = isMustang ? 85 : 68;

    const wheelDiameter = (rRadius * 2) * scale;
    const rotationAngle = -(car.x / 0.32); // Rotación según avance

    // Dibujar la propia rueda original recortada rotando sobre su centro exacto
    drawRotatingRealWheel(ctx, drawX + fX * scale, drawY + fY * scale, wheelDiameter, wheelFImg, rotationAngle);
    drawRotatingRealWheel(ctx, drawX + rX * scale, drawY + rY * scale, wheelDiameter, wheelRImg, rotationAngle);

    // Escape y Llamaradas de backfire en la cola
    const exhaustX = isMustang ? drawWidth * 0.48 : drawWidth * 0.46;
    const exhaustY = 4;

    if (car.backfireTimer > 0) {
        drawExhaustFlame(ctx, exhaustX, exhaustY);
    }

    ctx.restore();
}

function drawRotatingRealWheel(ctx, cx, cy, diameter, wheelImg, angle) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.drawImage(wheelImg, -diameter / 2, -diameter / 2, diameter, diameter);
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
