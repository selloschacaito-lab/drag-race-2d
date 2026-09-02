# 📱 Cómo probar el juego directamente en tu Teléfono Móvil

He preparado el entorno para que puedas **probar y jugar en tu teléfono Android al instante**, sin instalaciones complicadas ni cables.

---

## 1. Conexión Instantánea en tu Teléfono

1. Asegúrate de que tu **teléfono** esté conectado a la **misma red Wi-Fi** que esta computadora.
2. Abre el navegador de tu teléfono (Chrome, Brave, etc.).
3. Escribe la siguiente dirección en la barra de búsqueda:

```text
http://192.168.1.102:3000
```

*(Si lo abres en esta misma computadora, puedes entrar en [http://localhost:3000](http://localhost:3000)).*

---

## 2. Controles Táctiles Integrados en Pantalla

Al abrirlo en el celular, verás una interfaz táctil adaptada para jugar con dos pulgares:

* **Mano Izquierda:**
  * 🟡 **CLUTCH (Embrague):** Mantenlo presionado para desacoplar el motor.
  * ⚪ **- MARCHA:** Reduce un cambio.
* **Mano Derecha:**
  * 🔵 **+ MARCHA:** Sube de marcha cuando la luz roja (**Shift Light**) se encienda.
  * 🟢 **GAS (Acelerador):** Mantenlo presionado para acelerar a fondo.

---

## 3. Hoja de Ruta para Android (APK Nativo)

Para convertir esto en una aplicación `.apk` instalable en cualquier momento:

1. **Fase 1 (Actual - Validación Rápida):** Ajustar la física, los sprites de los carros, las mejoras de taller y los modos de juego directamente probando en la URL del teléfono en tiempo real.
2. **Fase 2 (Empaquetado Móvil):**
   * Opción A: **Capacitor / Cordova**: Convierte directamente este código en un APK nativo de Android en minutos.
   * Opción B: **Godot Engine 4 (Export Android)**: Importar la lógica a GDScript cuando la base visual y física esté perfectamente calibrada.
