# Walkthrough: Prototipo Jugable Pixel Drag Simulator

Se ha creado y ejecutado el prototipo jugable interactivo en el navegador para validar la física, la entrega de potencia y la transmisión manual antes de la migración a Godot.

---

## Archivos Creados en el Proyecto

* [index.html](file:///c:/Users/User/Documents/JUEGO%20CARRO/index.html): Interfaz del juego con canvas, tacómetro, selector de autos y cuadro de instrumentos.
* [styles.css](file:///c:/Users/User/Documents/JUEGO%20CARRO/styles.css): Estilo retro oscuro inspirado en Pixel Car Racer.
* [src/physics.js](file:///c:/Users/User/Documents/JUEGO%20CARRO/src/physics.js): Motor de física automotriz ($F = m \cdot a$, curvas de torque/RPM, tracción FWD vs RWD y transferencia de pesos).
* [src/car.js](file:///c:/Users/User/Documents/JUEGO%20CARRO/src/car.js): Lógica del auto, embrague/clutch, marchas, corte de inyección y calentamiento de gomas.
* [src/renderer.js](file:///c:/Users/User/Documents/JUEGO%20CARRO/src/renderer.js): Renderizado procedural en pixel art de las carrocerías, rines, llamaradas de escape (*backfire*) y humo.
* [src/game.js](file:///c:/Users/User/Documents/JUEGO%20CARRO/src/game.js): Bucle de juego, semáforo de salida (Christmas tree), telemetría y cronometraje de 1/4 de milla (402 metros).

---

## Controles en el Juego

* **Acelerador:** Tecla `Espacio` o `Flecha Derecha` o `D`.
* **Embrague (Clutch):** `Shift Izquierdo` o `C`.
* **Subir Marcha (+):** `W` o `Flecha Arriba`.
* **Bajar Marcha (-):** `S` o `Flecha Abajo`.
* **Reiniciar Pista:** `R`.

---

## Diferencias Clave que Puedes Probar Ya

1. **Honda Civic 1.6L (4 Cilindros - Tracción Delantera FWD):**
   * Motor elástico que entrega su potencia arriba (6,600 RPM).
   * Menor torque inicial $\rightarrow$ No patina en la salida, pero tarda más en completar el cuarto de milla (~15.5s).
2. **Ford Mustang 5.0L (V8 - Tracción Trasera RWD):**
   * Torque masivo (542 Nm) desde bajas revoluciones.
   * Si arrancas en 1ª marcha a fondo sin modular embrague $\rightarrow$ Verás el aviso **¡PATINANDO!** y una nube de humo en las ruedas traseras mientras pierde tiempo hasta que agarra tracción y acelera con furia (~12.5s).
