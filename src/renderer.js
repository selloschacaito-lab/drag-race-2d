// Sprites limpios profesionales (Carrocería vacía + Rueda individual)
export const CarSprites = {
    civicBody: new Image(),
    civicWheel: new Image(),
    mustangBody: new Image(),
    mustangWheel: new Image(),
    loaded: 0
};

function onImgLoad() {
    CarSprites.loaded++;
}

CarSprites.civicBody.src = "assets/civic_clean_body.png";
CarSprites.civicBody.onload = onImgLoad;

CarSprites.civicWheel.src = "assets/civic_clean_wheel.png";
CarSprites.civicWheel.onload = onImgLoad;

CarSprites.mustangBody.src = "assets/mustang_clean_body.png";
CarSprites.mustangBody.onload = onImgLoad;

CarSprites.mustangWheel.src = "assets/mustang_clean_wheel.png";
CarSprites.mustangWheel.onload = onImgLoad;

export function drawPixelCar(ctx, car, screenX, screenY) {
    ctx.save();
    ctx.translate(Math.round(screenX), Math.round(screenY));

    const isMustang = car.config.id === "mustang";
    const bodyImg = isMustang ? CarSprites.mustangBody : CarSprites.civicBody;
    const wheelImg = isMustang ? CarSprites.mustangWheel : CarSprites.civicWheel;

    const drawWidth = isMustang ? 165 : 155;
    const drawHeight = (drawWidth * 341) / 1024;

    // Orientar hacia la DERECHA
    ctx.scale(-1, 1);

    const drawX = -drawWidth / 2;
    const drawY = -drawHeight + 14;

    ctx.imageSmoothingEnabled = false;

    // Factor de escala entre el sprite de 1024x341 y la pantalla
    const scale = drawWidth / 1024;

    // Coordenadas exactas de los centros de los pasos de rueda
    // En la imagen original: X_front = delantero, X_rear = trasero
    const fX = isMustang ? 210 : 223;
    const fY = isMustang ? 242 : 237;
    const rX = isMustang ? 750 : 796;
    const rY = isMustang ? 238 : 240;
    const wheelRadius = isMustang ? 82 : 66;
    const wheelDiameter = (wheelRadius * 2) * scale;

    // Ángulo de giro: car.x / radio_en_metros. 
    // Como el contexto está invertido con scale(-1, 1), el ángulo positivo gira hacia adelante (horario)
    const tireRadiusMeters = 0.32;
    const wheelAngle = car.x / tireRadiusMeters;

    // 1. DIBUJAR LAS RUEDAS PRIMERO (en su hueco)
    drawStandaloneWheel(ctx, drawX + fX * scale, drawY + fY * scale, wheelDiameter, wheelImg, wheelAngle);
    drawStandaloneWheel(ctx, drawX + rX * scale, drawY + rY * scale, wheelDiameter, wheelImg, wheelAngle);

    // 2. DIBUJAR LA CARROCERÍA LIMPIA ENCIMA
    // Al dibujarse encima, la carrocería enmarca perfectamente las ruedas sin deformaciones ni encimados
    ctx.drawImage(bodyImg, drawX, drawY, drawWidth, drawHeight);

    // 3. Escape y llamaradas de fuego (backfire)
    const exhaustX = isMustang ? drawWidth * 0.48 : drawWidth * 0.46;
    const exhaustY = 4;

    if (car.backfireTimer > 0) {
        drawExhaustFlame(ctx, exhaustX, exhaustY);
    }

    ctx.restore();
}

function drawStandaloneWheel(ctx, cx, cy, diameter, wheelImg, angle) {
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
