```markdown
# Prototipo de Reconocimiento de Imágenes y Posicionamiento con Red de Hopfield

Este proyecto implementa una **Red Neuronal de Hopfield** autoasociativa en **JavaScript (Node.js)** sobre una cuadrícula de $10 \times 10$ píxeles ($100$ neuronas)[cite: 75, 77, 85]. 

El objetivo es resolver la problemática industrial de posicionamiento en una línea de montaje de motores: la red elimina el ruido e imperfecciones de una imagen capturada para identificar la ubicación del aro **C** y determinar las coordenadas del centro **A** $(X, Y)$ necesarias para que el brazo robotizado realice el montaje[cite: 108, 109].

---

## 📌 Características Principales

* **Modelo Recurrente:** Memoria autoasociativa direccionable por contenido[cite: 76, 77].
* **Entrenamiento por Pseudoinversa:** Utiliza la pseudoinversa de Moore-Penrose ($W = U \cdot U^\dagger$) para mayor capacidad de almacenamiento ($q \le 0.5n$) y superación de la restricción de ortogonalidad del método Hebbiano[cite: 83, 84].
* **Diagonal Nula:** Se garantiza que $W_{ii} = 0$ para evitar la auto-retroalimentación y asegurar la estabilidad de la red[cite: 75, 79].
* **Referencia Inalterable:** Incluye una escuadra fija en la esquina inferior izquierda (filas 8-9, columnas 0-1) que actúa como origen físico de referencia para las mediciones en la cinta[cite: 109].
* **Monitoreo de Energía:** Monitorea la disminución de la función de energía ($E = -\frac{1}{2} s^T W s$) en cada ciclo iterativo hasta la convergencia[cite: 86].
* **Extracción de Coordenadas:** Filtra los píxeles de la escuadra fija para calcular el centroide promediado $(X, Y)$ del aro recuperado[cite: 108].

---

## 🛠️ Requisitos Previos

* **Node.js** (versión 14 o superior recomendada).
* **Git** (para clonar el repositorio).

---

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/rolandoandres22/TP3_IA_Hopfield.git](https://github.com/rolandoandres22/TP3_IA_Hopfield.git)
   cd TP3_IA_Hopfield
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el script:**
   ```bash
   node hopfield_tp3.js
   ```

---

## 💻 Funcionamiento del Código

1. **`crearPatronAro(centroX, centroY)`**: Construye la matriz $10 \times 10$ (vector de $100$ elementos con valores $\{-1, +1\}$) dibujando la escuadra fija de referencia y el borde de $3 \times 3$ del aro alrededor del centro indicado[cite: 77, 109].
2. **Entrenamiento**: Construye la matriz $U$ ($100 \times 3$) con tres posiciones del aro, calcula $W = U \cdot U^\dagger$ mediante `math.pinv()` y asigna $0$ a la diagonal principal[cite: 83, 84].
3. **Simulación de Ruido**: Toma el primer patrón y altera un 20% de sus píxeles de forma aleatoria (invirtiendo su signo)[cite: 77, 95].
4. **Recuperación**: Multiplica la matriz de pesos $W$ por el estado actual de la red y aplica la función de activación `signo()` hasta estabilizar el estado y alcanzar un mínimo de energía[cite: 76, 86].
5. **Cálculo de Coordenadas**: Filtra los píxeles pertenecientes a la escuadra de referencia y calcula el centroide $A = (X, Y)$ del aro reconstruido[cite: 108].

---

## 📊 Ejemplo de Salida en Consola

```text
============================================================
MODELO DE HOPFIELD (10x10) EN JAVASCRIPT - PSEUDOINVERSA
============================================================

[ENTRADA CON RUIDO (20% de píxeles alterados)]:
X . . . X . . . . .
X . X . . . . . X .
. . . X X . . . . .
X X X X X . . . . X
. . X X . X . . . .
. . . X . . . . . .
. . . . . . . . . .
X . . X . . X X . .
. . . X . . . . . .
. X . . . . . . . .

[PROCESO DE CONVERGENCIA DE LA RED]:
Ciclo 1: Energía = -16.51
Ciclo 2: Energía = -48.50

--> Red estabilizada correctamente en el ciclo 2.

[IMAGEN LIMPIA / PATRÓN RECONSTRUIDO]:
. . . . . . . . . .
. . . . . . . . . .
. . X X X . . . . .
. . X . X . . . . .
. . X X X . . . . .
. . . . . . . . . .
. . . . . . . . . .
. . . . . . . . . .
X . . . . . . . . .
X X . . . . . . . .

[RESULTADO]: Centro 'A' del aro C identificado en -> Coordenadas: X = 3, Y = 3
```

---

## 📝 Licencia

Proyecto desarrollado con fines académicos para la materia de **Inteligencia Artificial** - Universidad Siglo 21.