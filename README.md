# Prototipo de Reconocimiento de Imágenes y Posicionamiento con Red de Hopfield

Este proyecto implementa una **Red Neuronal de Hopfield** autoasociativa en **JavaScript (Node.js)** sobre una cuadrícula de $10 \times 10$ píxeles ($100$ neuronas)[cite: 75, 77, 85]. 

El objetivo es resolver la problemática industrial de posicionamiento en una línea de montaje de motores: la red elimina el ruido e imperfecciones de una imagen capturada para identificar la ubicación del aro **C** y determinar las coordenadas del centro **A** $(X, Y)$ necesarias para que el brazo robotizado realice el montaje[cite: 108, 109].

---

## 📌 Características Principales

* **Modelo Recurrente:** Memoria autoasociativa direccionable por contenido[cite: 76, 77].
* **Entrenamiento por Pseudoinversa:** Utiliza la pseudoinversa de Moore-Penrose ($W = U \cdot U^\dagger$) para mayor capacidad de almacenamiento ($q \le 0.5n$) y superación de la restricción de ortogonalidad del método Hebbiano.
* **Diagonal Nula:** Se garantiza que $W_{ii} = 0$ para evitar la auto-retroalimentación y asegurar la estabilidad de la red[cite: 75, 79].
* **Referencia Inalterable:** Incluye una escuadra fija en la esquina inferior izquierda (filas 8-9, columnas 0-1) que actúa como origen físico de referencia para las mediciones en la cinta[cite: 109].
* **Monitoreo de Energía:** Monitorea la disminución de la función de energía ($E = -\frac{1}{2} s^T W s$) en cada ciclo iterativo hasta la convergencia[cite: 86].
* **Extracción de Coordenadas:** Filtra los píxeles de la escuadra fija para calcular el centroide promediado $(X, Y)$ del aro recuperado.

---

## 🛠️ Requisitos Previos

* **Node.js** (versión 14 o superior recomendada).
* **npm** (gestor de paquetes de Node).

---

## 🚀 Instalación y Ejecución

1. **Clonar o descargar el repositorio:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd <NOMBRE_DE_LA_CARPETA>