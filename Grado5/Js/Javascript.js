// Botones del menú
document.getElementById('miBoton2').addEventListener("click", function () {
    // Asignaturas #1 Castellano
    document.getElementById("Información").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("miBoton3").addEventListener('click', function () {
    document.getElementById("Asignaturas").scrollIntoView({ behavior: "smooth" });
});



// Selección de elementos y configuración inicial
const canvas3 = document.getElementById('JuegoMatematicas');
const ctx3 = canvas3.getContext('2d');
const startButton = document.getElementById('startButton_'); // Cambié el nombre aquí
const submitAnswerButton = document.getElementById('submitAnswerButton');

// Cargar la imagen de fondo
const backgroundImage = new Image();
backgroundImage.src = './Imagen/PIZARRAS.jpg';

backgroundImage.onload = () => {
    drawCanvas(); // Dibujar pantalla inicial
};

// Variables del juego
let currentQuestion = null;
let userAnswer = "";
let score = 0;
let totalQuestions = 5;
let questionsAsked = 0;
let answers = [];
let gameStarted = false; // Bandera para controlar el estado del juego

// Dibujar pantalla inicial
function drawCanvas() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx3.drawImage(backgroundImage, 0, 0, canvas3.width, canvas3.height);

    ctx3.font = '36px Arial';
    ctx3.fillStyle = 'black';
    ctx3.textAlign = 'center';
    ctx3.fillText('Juego de Matemáticas', canvas3.width / 2, canvas3.height / 4);

    ctx3.font = '24px Arial';
    ctx3.fillText('¡Haz clic en "Iniciar Juego" para comenzar!', canvas3.width / 2, canvas3.height / 2); // Modificado el texto aquí
}

// Generar una nueva pregunta matemática
function generateQuestion() {
    let num1, num2, operator, correctAnswer;
    const operators = ["+", "-", "*", "/"];

    while (true) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = operators[Math.floor(Math.random() * operators.length)];

        if (operator === "+") {
            correctAnswer = num1 + num2;
            break;
        } else if (operator === "-") {
            if (num1 >= num2) {
                correctAnswer = num1 - num2;
                break;
            }
        } else if (operator === "*") {
            correctAnswer = num1 * num2;
            break;
        } else if (operator === "/") {
            if (num1 % num2 === 0 && num2 !== 1) {
                correctAnswer = num1 / num2;
                break;
            }
        }
    }

    return { question: `${num1} ${operator} ${num2}`, answer: correctAnswer };
}

// Dibujar preguntas y progreso del juego
function drawGameCanvas() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx3.drawImage(backgroundImage, 0, 0, canvas3.width, canvas3.height);

    // Mostrar progreso y puntuación
    ctx3.font = '18px bold sans-serif';
    ctx3.fillStyle = 'black';
    ctx3.textAlign = 'left';
    ctx3.fillText(`Puntuación: ${score}`, 10, 30);
    ctx3.fillText(`Pregunta ${questionsAsked + 1} de ${totalQuestions}`, 10, 60);

    // Mostrar pregunta actual
    if (currentQuestion) {
        ctx3.textAlign = 'center';
        ctx3.font = '24px italic serif';
        ctx3.fillText(`¿Cuánto es ${currentQuestion.question}?`, canvas3.width / 2, canvas3.height / 2 - 20);
    }

    // Mostrar respuesta del usuario
    ctx3.font = '20px sans-serif';
    ctx3.fillText(`Respuesta: ${userAnswer}`, canvas3.width / 2, canvas3.height / 2 + 20);
}

// Manejar eventos del teclado (para responder las preguntas)
window.addEventListener('keydown', (e) => {
    if (gameStarted) {
        if (e.key >= "0" && e.key <= "9") {
            userAnswer += e.key;
            drawGameCanvas();
        } else if (e.key === "Backspace") {
            userAnswer = userAnswer.slice(0, -1);
            drawGameCanvas();
        }
    }
});

// Función para manejar el clic en el botón "Enviar Respuesta"
submitAnswerButton.addEventListener('click', () => {
    if (userAnswer.trim() !== "") {
        if (parseInt(userAnswer) === currentQuestion.answer) {
            score++;
        }
        answers.push({ question: currentQuestion.question, correctAnswer: currentQuestion.answer, userAnswer: userAnswer });
    }

    questionsAsked++;
    userAnswer = "";

    if (questionsAsked < totalQuestions) {
        currentQuestion = generateQuestion();
        drawGameCanvas();
    } else {
        endGame();
    }
});

// Mostrar resultados al finalizar el juego
function endGame() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

    ctx3.fillStyle = 'rgba(0, 128, 0, 0.1)';
    ctx3.fillRect(0, 0, canvas3.width, canvas3.height);

    ctx3.font = '36px bold sans-serif';
    ctx3.fillStyle = 'black';
    ctx3.textAlign = 'center';
    ctx3.fillText('¡Juego Terminado!', canvas3.width / 2, canvas3.height / 4);
    ctx3.fillText(`Tu puntuación final: ${score} / ${totalQuestions}`, canvas3.width / 2, canvas3.height / 2);

    // Mostrar las respuestas correctas
    answers.forEach((answer, index) => {
        ctx3.font = '18px sans-serif';
        ctx3.fillText(
            `Pregunta ${index + 1}: ${answer.question} = ${answer.correctAnswer} (Tu respuesta: ${answer.userAnswer})`,
            canvas3.width / 2,
            canvas3.height / 2 + 40 + index * 30
        );
    });

    gameStarted = false; // Reiniciar estado del juego
}

// Iniciar el juego
function startGame() {
    score = 0;
    questionsAsked = 0;
    answers = [];
    userAnswer = ""; // Limpiar cualquier respuesta previa
    currentQuestion = generateQuestion();
    gameStarted = true; // Marcar el juego como iniciado
    drawGameCanvas();
    window.focus(); // Asegurarse de que el foco está en la ventana
}

// Iniciar el juego al hacer clic en el botón
startButton.addEventListener('click', () => {
    startGame(); // Inicia el juego al hacer clic en el botón
});
