const math = require('mathjs');

function signo(matriz) {//Función de activación discreta/escalón:
    return matriz.map(val => (val >= 0 ? 1 : -1));//Devuelve +1 si el valor es >= 0, y -1 en caso contrario.
}
//Crea un patrón en una cuadrícula de 10x10 (100 elementos) con valores {-1, +1}:
//Marca una escuadra fija e inalterable en la esquina inferior izquierda.
//Dibuja el borde de un cuadrado de 3x3 representando el aro alrededor de (centro_x, centro_y).
function crearPatronAro(centroX, centroY) {
    // inicializar matriz 10x10 llena de -1 
    let img = Array.from({ length: 10 }, () => Array(10).fill(-1));

    // Escuadra fija de referencia en la esquina inferior izquierda (filas 8-9, columnas 0-1)
    img[8][0] = 1;
    img[9][0] = 1;
    img[9][1] = 1;

    //Aro (borde de 3x3 alrededor del centro especificado)
    for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
            if (Math.abs(dx) === 1 || Math.abs(dy) === 1) {
                let px = centroX + dx;
                let py = centroY + dy;
                if (px >= 0 && px < 10 && py >= 0 && py < 10) {
                    img[py][px] = 1;
                }
            }
        }
    }
    return img.flat();// Aplanar a un vector unidimensional de 100 elementos
}


function imprimirMatriz(vector100) {//Imprime en consola la matriz 10x10 reemplazando +1 por 'X' y -1 por '.'
    for (let i = 0; i < 10; i++) {
        let fila = vector100.slice(i * 10, (i + 1) * 10);
        console.log(fila.map(p => (p === 1 ? 'X' : '.')).join(' '));
    }
}

function main() {
    console.log("=" .repeat(60));
    console.log("MODELO DE HOPFIELD (10x10) EN JAVASCRIPT - PSEUDOINVERSA");
    console.log("=" .repeat(60));

    const n = 100; // 10x10 píxeles = 100 neuronas

    //Definir patrones base (Aro en distintas posiciones + escuadra de referencia)
    const p1 = crearPatronAro(3, 3);
    const p2 = crearPatronAro(6, 3);
    const p3 = crearPatronAro(5, 6);

    let U = math.matrix([p1, p2, p3]);//construir matriz U de tamaño 100 x 3
    U = math.transpose(U); //transponer para tener 100 filas x 3 columnas

    //Entrenamiento mediante Pseudoinversa de Moore-Penrose: W = U * U^dagger
    const U_pinv = math.pinv(U);
    let W = math.multiply(U, U_pinv);

    // Fijar la diagonal principal en 0 (sin auto-retroalimentación)
    W = W.map((val, idx) => (idx[0] === idx[1] ? 0 : val));

    let entradaRuido = [...p1];//Simulación de entrada distorsionada con RUIDO (basada en el patrón 1)
    // Alterar 20 píxeles aleatorios
    let indicesUsados = new Set();
    while (indicesUsados.size < 20) {
        let idx = Math.floor(Math.random() * n);
        if (!indicesUsados.has(idx)) {
            indicesUsados.add(idx);
            entradaRuido[idx] *= -1;
        }
    }

    console.log("\n[ENTRADA CON RUIDO (20% de píxeles alterados)]:");
    imprimirMatriz(entradaRuido);

    console.log("\n[PROCESO DE CONVERGENCIA DE LA RED]:");//Proceso de recuperación e iteración de la Red de Hopfield
    let estado = math.matrix(entradaRuido);

    for (let ciclo = 1; ciclo <= 10; ciclo++) {
        let prod = math.multiply(W, estado);//Multiplicar matriz W por el vector de estado actual
        let nuevoEstado = signo(prod);

        //Calcular función de energía: E = -0.5 * s^T * W * s
        let sT = math.transpose(estado);
        let Ws = math.multiply(W, estado);
        let energia = -0.5 * math.multiply(sT, Ws);

        console.log(`Ciclo ${ciclo}: Energía = ${energia.toFixed(2)}`);

        
        if (math.deepEqual(nuevoEstado, estado)) {//Verificar estabilidad de la red
            console.log(`\n--> Red estabilizada correctamente en el ciclo ${ciclo}.`);
            estado = nuevoEstado;
            break;
        }
        estado = nuevoEstado;
    }

    const estadoArray = estado.toArray();//Visualización de la imagen limpia y cálculo de coordenadas (X, Y)
    console.log("\n[IMAGEN LIMPIA / PATRÓN RECONSTRUIDO]:");
    imprimirMatriz(estadoArray);

    //obtener los puntos activos (+1) excluyendo la escuadra fija (filas >= 8 y columnas <= 1)
    let puntosAroX = [];
    let puntosAroY = [];

    for (let i = 0; i < n; i++) {
        if (estadoArray[i] === 1) {
            let fila = Math.floor(i / 10);
            let col = i % 10;

            if (!(fila >= 8 && col <= 1)) {//Excluir escuadra de referencia (esquina inferior izquierda)
                puntosAroX.push(col);
                puntosAroY.push(fila);
            }
        }
    }

    if (puntosAroX.length > 0) {
        let centroX = Math.round(puntosAroX.reduce((a, b) => a + b, 0) / puntosAroX.length);
        let centroY = Math.round(puntosAroY.reduce((a, b) => a + b, 0) / puntosAroY.length);
        console.log(`\n[RESULTADO]: Centro 'A' del aro C identificado en -> Coordenadas: X = ${centroX}, Y = ${centroY}`);
    }
}

main();