# Plan de Implementación: Prototipo Jugable Web (HTML5 Canvas) — Pixel Drag Simulator

Crearemos un prototipo interactivo 100% jugable en el navegador, que sirva como banco de pruebas de la física, la transmisión manual y la diferencia real de potencia entre autos, antes de llevar la arquitectura a Godot.

---

## Características del Prototipo

1. **Simulación Física y Dinámica de Motores:**
   - **Honda Civic 1.6L (4 Cilindros - FWD):** 125 HP @ 6,600 RPM, 144 Nm @ 5,200 RPM, peso ligero (~1050 kg). Buena tracción inicial, pero menor potencia a altas velocidades.
   - **Ford Mustang 5.0L (V8 - RWD):** 435 HP @ 6,500 RPM, 542 Nm @ 4,250 RPM, peso pesado (~1680 kg). Enorme torque que patina en 1ª/2ª marcha si no se calientan los neumáticos o no se modula el acelerador.

2. **Caja de Cambios y Mecánica:**
   - Modo Manual con Clutch/Embrague (Espacio o Shift).
   - Palanca secuencial: Teclas `W` / `S` o flechas `Arriba` / `Abajo` para subir y bajar marchas (1 a 6 + Neutro + Reversa).
   - Tacómetro analógico interactivo con aguja fluida, zona roja y luz de cambio (*Shift Light*).
   - Limitador de revoluciones con sonido visual/partículas de fuego por el escape (*Backfire*).

3. **Pista y Carrera de 1/4 de Milla (400 metros):**
   - Semáforo de salida tipo "Christmas Tree" (Árbol de arrancones con luces amarillas y verde).
   - Detección de reacción, tiempo en 60 pies, tiempo total del 1/4 de milla y velocidad terminal (km/h).
   - Calentamiento de neumáticos (*Burnout zone*) con medidor de agarre y humo de llantas.

4. **Gráficos 2D Pixel Art Modulares Procedurales:**
   - Dibujo en Canvas con estética pixel art para el Civic y el Mustang (chasis, rines giratorios, humo, fuego, luces y asfalto en paralaje).

---

## Archivos a Crear

- `index.html`: Estructura de la aplicación, pantalla de juego y selector de auto (Civic vs Mustang).
- `styles.css`: Estética retro arcade oscura con tipografía pixel y cuadro de mandos nítido.
- `physics.js`: Motor matemático con curvas de torque, cálculo de fricción, masa y aceleración $F = m \cdot a$.
- `car.js`: Clase del vehículo con su transmisión, revoluciones, caja de cambios y renderizado modular por capas.
- `game.js`: Bucle de juego, semáforo, cámara lateral en paralaje y cronometraje de 1/4 de milla.

---

## Verificación
- Abrir directamente en el navegador web local.
- Probar la diferencia de salida: Mustang patinando gomas si se acelera a fondo sin clutch progresivo vs Civic con aceleración lineal.
- Validar tiempos del 1/4 de milla realistas (~15.5s para el Civic de serie vs ~12.2s para el Mustang V8).
