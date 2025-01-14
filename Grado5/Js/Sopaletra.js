const canvas = document.getElementById('Dibujo');
const ctx1 = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const messageDiv = document.getElementById('message');

const filas = 10; // Número de filas en la sopa de letras
const columnas = 11; // Número de columnas en la sopa de letras
const cellSize = 40; // Tamaño de cada celda (en píxeles)
let letras = [];
const palabras = ['CASTELLANO', 'LITERATURA', 'PERSEVERAR', 'ALEGRIA', 'RESPETO', 'AMOR', 'UNIDAD'];
let palabrasEncontradas = [];
let seleccionActual = [];
const coloresPrimarios = ['rgba(234, 70, 48, 0.45)', 'rgba(25, 25, 186, 0.49)', 'rgba(0, 255, 55, 0.85)'];
let mousePresionado = false;

// Generar una letra aleatoria
function generarLetraAleatoria() {
    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alfabeto[Math.floor(Math.random() * alfabeto.length)];
}

// Inicializar la sopa de letras
function inicializarSopa() {
    letras = Array.from({ length: filas }, () =>
        Array.from({ length: columnas }, () => generarLetraAleatoria())
    );

    // Colocar palabras en la sopa
    colocarPalabra('CASTELLANO', 0, 0, 'vertical');
    colocarPalabra('LITERATURA', 0, 10, 'vertical');
    colocarPalabra('PERSEVERAR', 0, 1, 'vertical');
    colocarPalabra('ALEGRIA', 0, 4, 'vertical');
    colocarPalabra('RESPETO', 9, 2, 'horizontal');
    colocarPalabra('AMOR', 0, 9, 'vertical');
    colocarPalabra('UNIDAD', 4, 9, 'vertical');
}

// Colocar una palabra en la sopa
function colocarPalabra(palabra, fila, columna, direccion) {
    for (let i = 0; i < palabra.length; i++) {
        if (direccion === 'horizontal') {
            letras[fila][columna + i] = palabra[i];
        } else if (direccion === 'vertical') {
            letras[fila + i][columna] = palabra[i];
        }
    }
}

// Dibujar la sopa de letras
function dibujarSopa() {
    ctx1.font = '20px Arial';
    ctx1.textAlign = 'center';
    ctx1.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.textBaseline = 'middle';

    for (let fila = 0; fila < letras.length; fila++) {
        for (let col = 0; col < letras[fila].length; col++) {
            const x = col * cellSize;
            const y = fila * cellSize;

            // Dibujar bordes de las celdas
            ctx1.strokeStyle = 'black';
            ctx1.strokeRect(x, y, cellSize, cellSize);

            // Dibujar letras
            ctx1.fillStyle = 'black';
            ctx1.fillText(letras[fila][col], x + cellSize / 2, y + cellSize / 2);
        }
    }

    // Colorear palabras encontradas
    palabrasEncontradas.forEach(({ celdas, color }) => {
        celdas.forEach(({ fila, col }) => {
            ctx1.fillStyle = color;
            ctx1.fillRect(col * cellSize, fila * cellSize, cellSize, cellSize);
        });
    });

    // Colorear selección actual
    if (seleccionActual.length > 0) {
        seleccionActual.forEach(({ celdas, color }) => {
            celdas.forEach(({ fila, col }) => {
                ctx1.fillStyle = color;
                ctx1.fillRect(col * cellSize, fila * cellSize, cellSize, cellSize);
            });
        });
    }
}

// Verificar si la palabra seleccionada es válida
function verificarPalabras() {
    const palabraSeleccionada = obtenerPalabra(seleccionActual);
    const palabraSeleccionadaInvertida = palabraSeleccionada.split('').reverse().join('');

    let palabraReconocida = null;

    if (palabras.includes(palabraSeleccionada)) {
        palabraReconocida = palabraSeleccionada;
    } else if (palabras.includes(palabraSeleccionadaInvertida)) {
        palabraReconocida = palabraSeleccionadaInvertida;
    }

    if (palabraReconocida && !palabrasEncontradas.some(p => p.palabra === palabraReconocida)) {
        const color = obtenerColor();
        const celdas = seleccionActual[0].celdas;
        palabrasEncontradas.push({ palabra: palabraReconocida, celdas, color });
        messageDiv.textContent = `¡Encontraste: ${palabraReconocida}!`;
        seleccionActual = [];
    }

    if (palabrasEncontradas.length === palabras.length) {
        mensajeFelicidades();
    }

    dibujarSopa();
}

// Mostrar mensaje de felicitaciones
function mensajeFelicidades() {
    messageDiv.textContent = '¡Felicidades! Has encontrado todas las palabras.';
}

// Eventos para manejar la selección de celdas
canvas.addEventListener('mousedown', (event) => {
    mousePresionado = true;
    seleccionActual = [];
    const { row, col } = obtenerCelda(event);
    if (row >= 0 && row < filas && col >= 0 && col < columnas) {
        seleccionActual.push({ celdas: [{ fila: row, col: col }], color: obtenerColor() });
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (mousePresionado) {
        const { row, col } = obtenerCelda(event);
        if (row >= 0 && row < filas && col >= 0 && col < columnas) {
            const ultimoSeleccion = seleccionActual[seleccionActual.length - 1];
            const celdas = [...ultimoSeleccion.celdas];
            if (!celdas.some((c) => c.fila === row && c.col === col)) {
                celdas.push({ fila: row, col: col });
                seleccionActual[seleccionActual.length - 1] = { celdas, color: ultimoSeleccion.color };
                dibujarSopa();
            }
        }
    }
});

canvas.addEventListener('mouseup', () => {
    mousePresionado = false;
    verificarPalabras();
});

// Obtener la celda seleccionada
function obtenerCelda(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor(mouseX / cellSize);
    const row = Math.floor(mouseY / cellSize);

    return { row, col };
}

// Obtener un color para la selección
function obtenerColor() {
    return coloresPrimarios[Math.floor(Math.random() * coloresPrimarios.length)];
}

// Obtener la palabra seleccionada
function obtenerPalabra(seleccion) {
    const celdas = seleccion[0].celdas;
    let palabra = '';
    celdas.forEach(({ fila, col }) => {
        palabra += letras[fila][col];
    });
    return palabra;
}

// Botón de reinicio
resetButton.addEventListener('click', () => {
    inicializarSopa();
    palabrasEncontradas = [];
    seleccionActual = [];
    messageDiv.textContent = '';
    dibujarSopa();
});

// Inicializar la sopa de letras
inicializarSopa();
dibujarSopa();
