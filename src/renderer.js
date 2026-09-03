// Cargador de Sprites Oficiales
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

    // Voltear para que miren a la DERECHA
    ctx.scale(-1, 1);

    const drawX = -drawWidth / 2;
    const drawY = -drawHeight + 14;

    ctx.imageSmoothingEnabled = false;

    // 1. Dibujar el auto original intacto con sus ruedas originales perfectas
    if (isLoaded) {
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    } else {
        ctx.fillStyle = isMustang ? "#e11d48" : "#fcd34d";
        ctx.fillRect(drawX, drawY + 15, drawWidth, drawHeight - 15);
    }

    // 2. Escape y llamaradas de backfire
    const exhaustX = isMustang ? drawWidth * 0.48 : drawWidth * 0.46;
    const exhaustY = 4;

    if (car.backfireTimer > 0) {
        drawExhaustFlame(ctx, exhaustX, exhaustY);
    }

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
