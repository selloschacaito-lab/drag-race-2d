import { PRESET_ENGINES, PRESET_CARS } from "./physics.js";

export class Car {
    constructor(presetKey, isPlayer = true, laneY = 0) {
        this.config = JSON.parse(JSON.stringify(PRESET_CARS[presetKey]));
        this.engine = PRESET_ENGINES[this.config.engineKey];
        this.isPlayer = isPlayer;
        this.laneY = laneY;

        // Estado dinamico
        this.x = 0;
        this.velocity = 0;
        this.rpm = this.engine.idleRpm;
        this.currentGear = 0;
        this.clutch = 0;
        this.throttle = 0;
        this.wheelSpin = 0;
        this.tireTemp = 40;
        this.backfireTimer = 0;

        // Telemetria
        this.raceStarted = false;
        this.raceFinished = false;
        this.reactionTime = 0;
        this.time60ft = 0;
        this.timeQuarterMile = 0;
        this.trapSpeedKmh = 0;
        this.totalTimer = 0;

        this.tireSmoke = [];
        this.exhaustFlames = [];
    }

    setGear(gear) {
        if (gear < 0) gear = 0;
        const maxGear = this.config.gearRatios.length;
        if (gear > maxGear) gear = maxGear;
        this.currentGear = gear;
    }

    shiftUp() {
        this.setGear(this.currentGear + 1);
        this.triggerShiftPop();
    }

    shiftDown() {
        this.setGear(this.currentGear - 1);
    }

    triggerShiftPop() {
        if (this.rpm > this.engine.redlineRpm * 0.75) {
            this.backfireTimer = 0.15;
        }
    }

    update(dt) {
        if (dt <= 0) return;

        if (this.backfireTimer > 0) {
            this.backfireTimer -= dt;
        }

        if (this.raceStarted && !this.raceFinished) {
            this.totalTimer += dt;
            if (this.x >= 18.288 && this.time60ft === 0) {
                this.time60ft = this.totalTimer;
            }
            if (this.x >= 402.336) {
                this.timeQuarterMile = this.totalTimer;
                this.trapSpeedKmh = this.velocity * 3.6;
                this.raceFinished = true;
            }
        }

        let totalGearRatio = 0;
        if (this.currentGear > 0) {
            totalGearRatio = this.config.gearRatios[this.currentGear - 1] * this.config.finalDriveRatio;
        }

        const clutchEngaged = 1 - this.clutch;
        const wheelRpm = (this.velocity / (2 * Math.PI * this.config.tireRadiusM)) * 60;
        const drivetrainRpm = wheelRpm * totalGearRatio;

        if (this.currentGear === 0 || clutchEngaged < 0.1) {
            if (this.throttle > 0.05) {
                this.rpm += (this.throttle * 8500 - (this.rpm - this.engine.idleRpm) * 0.5) * dt * 4;
            } else {
                this.rpm += (this.engine.idleRpm - this.rpm) * dt * 6;
            }
        } else {
            const targetRpm = Math.max(this.engine.idleRpm, drivetrainRpm);
            this.rpm = this.rpm + (targetRpm - this.rpm) * (clutchEngaged * 12) * dt;
        }

        if (this.rpm >= this.engine.redlineRpm) {
            this.rpm = this.engine.redlineRpm - (Math.random() * 250);
            this.backfireTimer = 0.08;
        }
        this.rpm = Math.max(this.engine.idleRpm * 0.8, this.rpm);

        let tractionForce = 0;
        let engineTorque = this.engine.getTorqueAtRpm(this.rpm) * this.throttle;

        if (this.currentGear > 0 && clutchEngaged > 0.1) {
            const wheelTorque = engineTorque * totalGearRatio * clutchEngaged * 0.88;
            const driveForce = wheelTorque / this.config.tireRadiusM;

            const g = 9.81;
            let driveAxleWeightRatio = 0.5;
            if (this.config.drivetrain === "FWD") {
                driveAxleWeightRatio = 0.60;
                const weightTransfer = (driveForce / (this.config.massKg * g)) * 0.15;
                driveAxleWeightRatio = Math.max(0.35, driveAxleWeightRatio - weightTransfer);
            } else if (this.config.drivetrain === "RWD") {
                driveAxleWeightRatio = 0.50;
                const weightTransfer = (driveForce / (this.config.massKg * g)) * 0.20;
                driveAxleWeightRatio = Math.min(0.75, driveAxleWeightRatio + weightTransfer);
            }

            let tempGripMultiplier = 1.0;
            if (this.tireTemp >= 80 && this.tireTemp <= 110) {
                tempGripMultiplier = 1.25;
            } else if (this.tireTemp > 130) {
                tempGripMultiplier = 0.85;
            }

            const maxTireGrip = (this.config.massKg * driveAxleWeightRatio * g) * (this.config.tireGripCoeff * tempGripMultiplier);

            if (driveForce > maxTireGrip) {
                this.wheelSpin = (driveForce - maxTireGrip) / maxTireGrip;
                tractionForce = maxTireGrip * 0.85;
                this.tireTemp += dt * 40 * this.wheelSpin;
            } else {
                this.wheelSpin = 0;
                tractionForce = driveForce;
                this.tireTemp = Math.max(40, this.tireTemp - dt * 2);
            }
        } else {
            this.wheelSpin = 0;
        }

        const airDensity = 1.225;
        const dragForce = 0.5 * airDensity * this.config.dragCoefficient * this.config.frontalAreaM2 * Math.pow(this.velocity, 2);
        const rollingResistance = this.config.massKg * 9.81 * 0.015;

        const netForce = Math.max(0, tractionForce - dragForce - (this.velocity > 0.1 ? rollingResistance : 0));
        const acceleration = netForce / this.config.massKg;

        this.velocity += acceleration * dt;
        this.x += this.velocity * dt;

        if (this.wheelSpin > 0.15) {
            this.emitTireSmoke();
        }
    }

    emitTireSmoke() {
        if (Math.random() < 0.6) {
            const wheelOffsetX = this.config.drivetrain === "FWD" ? 32 : -36;
            this.tireSmoke.push({
                x: this.x * 20 + wheelOffsetX,
                y: this.laneY + 12,
                radius: 4 + Math.random() * 8,
                alpha: 0.8,
                vx: -15 - Math.random() * 20,
                vy: -5 - Math.random() * 10
            });
        }
    }
}
