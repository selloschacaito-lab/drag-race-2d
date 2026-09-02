import { Car } from "./car.js";
import { drawPixelCar } from "./renderer.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado de la carrera
let playerCar = new Car("CIVIC", true, 260);
let opponentCar = new Car("MUSTANG", false, 180);

let gameState = "STAGE";
let countdownTimer = 0;
let lightState = 0;
let raceDistanceMeters = 402.336;

// Controles
const keys = {};
let touchThrottle = false;
let touchClutch = false;

// Teclado
window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
    if (e.code === "KeyW" || e.code === "ArrowUp") {
        playerCar.shiftUp();
        updateGearUI();
    }
    if (e.code === "KeyS" || e.code === "ArrowDown") {
        playerCar.shiftDown();
        updateGearUI();
    }
    if (e.code === "KeyR") {
        restartRace();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

// Controles Táctiles para Teléfono Móvil
function bindTouchButton(btnId, onPress, onRelease) {
    const el = document.getElementById(btnId);
    if (!el) return;
    
    // Touch
    el.addEventListener("touchstart", (e) => {
        e.preventDefault();
        onPress();
    }, { passive: false });
    
    el.addEventListener("touchend", (e) => {
        e.preventDefault();
        onRelease();
    }, { passive: false });

    // Mouse click compatible
    el.addEventListener("mousedown", onPress);
    el.addEventListener("mouseup", onRelease);
    el.addEventListener("mouseleave", onRelease);
}

bindTouchButton("btnTouchGas", () => { touchThrottle = true; }, () => { touchThrottle = false; });
bindTouchButton("btnTouchClutch", () => { touchClutch = true; }, () => { touchClutch = false; });

document.getElementById("btnTouchShiftUp")?.addEventListener("click", () => {
    playerCar.shiftUp();
    updateGearUI();
});

document.getElementById("btnTouchShiftDown")?.addEventListener("click", () => {
    playerCar.shiftDown();
    updateGearUI();
});

// Selector de auto
document.getElementById("btnSelectCivic").addEventListener("click", () => {
    selectCar("CIVIC", "MUSTANG");
});
document.getElementById("btnSelectMustang").addEventListener("click", () => {
    selectCar("MUSTANG", "CIVIC");
});
document.getElementById("btnRestart").addEventListener("click", restartRace);

function selectCar(playerPreset, opponentPreset) {
    playerCar = new Car(playerPreset, true, 260);
    opponentCar = new Car(opponentPreset, false, 180);
    document.getElementById("carNameDisplay").innerText = playerCar.config.name;
    restartRace();
}

function restartRace() {
    playerCar.x = 0;
    playerCar.velocity = 0;
    playerCar.currentGear = 0;
    playerCar.rpm = playerCar.engine.idleRpm;
    playerCar.raceStarted = false;
    playerCar.raceFinished = false;
    playerCar.totalTimer = 0;
    playerCar.time60ft = 0;
    playerCar.timeQuarterMile = 0;

    opponentCar.x = 0;
    opponentCar.velocity = 0;
    opponentCar.currentGear = 0;
    opponentCar.rpm = opponentCar.engine.idleRpm;
    opponentCar.raceStarted = false;
    opponentCar.raceFinished = false;
    opponentCar.totalTimer = 0;
    opponentCar.time60ft = 0;
    opponentCar.timeQuarterMile = 0;

    gameState = "STAGE";
    lightState = 0;
    countdownTimer = 2.0;
    document.getElementById("raceBanner").innerText = "¡PREPÁRATE EN LA LÍNEA!";
    updateGearUI();
}

function updateGearUI() {
    const gearEl = document.getElementById("gearDisplay");
    if (playerCar.currentGear === 0) {
        gearEl.innerText = "N";
        gearEl.style.color = "#94a3b8";
    } else {
        gearEl.innerText = playerCar.currentGear;
        gearEl.style.color = "#38bdf8";
    }
}

// Bucle principal
let lastTime = performance.now();

function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    // Unir entradas de teclado y táctiles
    const throttlePressed = keys["ArrowRight"] || keys["KeyD"] || keys["Space"] || touchThrottle;
    const clutchPressed = keys["ShiftLeft"] || keys["KeyC"] || touchClutch;

    playerCar.throttle = throttlePressed ? 1.0 : 0.0;
    playerCar.clutch = clutchPressed ? 1.0 : 0.0;

    // Semáforo
    if (gameState === "STAGE") {
        countdownTimer -= dt;
        if (countdownTimer <= 0) {
            gameState = "COUNTDOWN";
            countdownTimer = 0.5;
            lightState = 1;
        }
    } else if (gameState === "COUNTDOWN") {
        countdownTimer -= dt;
        if (countdownTimer <= 0) {
            lightState++;
            countdownTimer = 0.5;
            if (lightState >= 4) {
                gameState = "RACING";
                playerCar.raceStarted = true;
                opponentCar.raceStarted = true;
                document.getElementById("raceBanner").innerText = "¡¡¡VERDE GO GO GO!!!";
            }
        }
    }

    // IA oponente
    if (gameState === "RACING") {
        opponentCar.throttle = 1.0;
        opponentCar.clutch = 0.0;
        if (opponentCar.currentGear === 0) {
            opponentCar.setGear(1);
        } else if (opponentCar.rpm >= opponentCar.engine.maxHpRpm * 0.98) {
            opponentCar.shiftUp();
        }
    }

    playerCar.update(dt);
    opponentCar.update(dt);

    // Humo
    [playerCar, opponentCar].forEach(car => {
        for (let i = car.tireSmoke.length - 1; i >= 0; i--) {
            const p = car.tireSmoke[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.radius += dt * 12;
            p.alpha -= dt * 1.2;
            if (p.alpha <= 0) {
                car.tireSmoke.splice(i, 1);
            }
        }
    });

    if (playerCar.raceFinished && opponentCar.raceFinished && gameState !== "FINISHED") {
        gameState = "FINISHED";
        const winner = playerCar.timeQuarterMile < opponentCar.timeQuarterMile ? "¡GANASTE!" : "GANÓ EL OPONENTE";
        document.getElementById("raceBanner").innerText = `${winner} - 1/4 Milla: ${playerCar.timeQuarterMile.toFixed(3)}s @ ${playerCar.trapSpeedKmh.toFixed(1)} km/h`;
    }

    updateDashboard();
}

function updateDashboard() {
    const speedKmh = playerCar.velocity * 3.6;

    document.getElementById("speedDisplay").innerText = Math.round(speedKmh);
    document.getElementById("rpmDisplay").innerText = Math.round(playerCar.rpm);

    const shiftLight = document.getElementById("shiftLight");
    if (playerCar.rpm >= playerCar.engine.maxHpRpm) {
        shiftLight.classList.add("active");
    } else {
        shiftLight.classList.remove("active");
    }

    document.getElementById("distDisplay").innerText = `${playerCar.x.toFixed(1)} m / 402 m`;
    document.getElementById("timerDisplay").innerText = `${playerCar.totalTimer.toFixed(3)} s`;
    document.getElementById("tempDisplay").innerText = `${Math.round(playerCar.tireTemp)} °C`;
    
    const gripEl = document.getElementById("gripDisplay");
    if (playerCar.wheelSpin > 0.1) {
        gripEl.innerText = "¡PATINANDO!";
        gripEl.style.color = "#f97316";
    } else {
        gripEl.innerText = "TRACCIÓN OK";
        gripEl.style.color = "#4ade80";
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, 150);
    skyGrad.addColorStop(0, "#090d16");
    skyGrad.addColorStop(1, "#182035");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, 150);

    const camX = playerCar.x * 20;
    drawSkyline(camX * 0.1);

    ctx.fillStyle = "#1e2430";
    ctx.fillRect(0, 150, canvas.width, 150);

    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 215, canvas.width, 4);

    const startScreenX = 120 - camX;
    const finishScreenX = 120 + (raceDistanceMeters * 20) - camX;

    if (startScreenX > -20 && startScreenX < canvas.width + 20) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(startScreenX, 150, 6, 150);
    }

    if (finishScreenX > -50 && finishScreenX < canvas.width + 50) {
        drawCheckeredFinish(finishScreenX);
    }

    [playerCar, opponentCar].forEach(car => {
        car.tireSmoke.forEach(p => {
            const screenSmokeX = 120 + (p.x - camX);
            ctx.fillStyle = `rgba(226, 232, 240, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(screenSmokeX, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    });

    const playerScreenX = 120;
    const opponentScreenX = 120 + ((opponentCar.x - playerCar.x) * 20);

    drawPixelCar(ctx, opponentCar, opponentScreenX, opponentCar.laneY);
    drawPixelCar(ctx, playerCar, playerScreenX, playerCar.laneY);

    if (startScreenX > -60 && startScreenX < canvas.width + 60) {
        drawChristmasTree(startScreenX - 30, 100);
    }
}

function drawSkyline(offset) {
    ctx.fillStyle = "#0f172a";
    for (let i = -1; i < 20; i++) {
        const x = ((i * 70 - offset) % (canvas.width + 100)) - 50;
        const h = 40 + ((i * 29) % 55);
        ctx.fillRect(x, 150 - h, 50, h);
    }
}

function drawCheckeredFinish(x) {
    const size = 8;
    for (let row = 0; row < 150 / size; row++) {
        for (let col = 0; col < 3; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? "#ffffff" : "#0f172a";
            ctx.fillRect(x + col * size, 150 + row * size, size, size);
        }
    }
}

function drawChristmasTree(x, y) {
    ctx.fillStyle = "#334155";
    ctx.fillRect(x + 10, y, 6, 80);

    const lights = [
        { c: lightState >= 1 ? "#eab308" : "#422006", y: y + 10 },
        { c: lightState >= 2 ? "#eab308" : "#422006", y: y + 25 },
        { c: lightState >= 3 ? "#eab308" : "#422006", y: y + 40 },
        { c: lightState === 4 ? "#22c55e" : "#052e16", y: y + 55 }
    ];

    lights.forEach(l => {
        ctx.fillStyle = l.c;
        ctx.beginPath();
        ctx.arc(x + 13, l.y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

restartRace();
requestAnimationFrame(gameLoop);
