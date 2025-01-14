
// Asignaturas #2 Informática
const canvas1 = document.getElementById('Informatica_');
const ctx = canvas1.getContext('2d');

// Dimensiones de las imágenes en píxeles (3 cm ≈ 113 px)
const imageSize = 113;

const images_1 = [
    { src: './Imagen/Computadora.png', x: 90, y: 50 },
    { src: './Imagen/Cpu.png', x: 350, y: 50 },
    { src: './Imagen/Motherboard.png', x: 590, y: 50 }
];

const lines_1 = [
    { x1: 150, y1: 330, x2: 150, y2: 193 },
    { x1: 410, y1: 330, x2: 410, y2: 193 },
    { x1: 650, y1: 330, x2: 650, y2: 193 }
];

const names_1 = [
    { text: "Cpu", x: 150, y: 350 },
    { text: "Computadora", x: 415, y: 350 },
    { text: "MotherBoard", x: 650, y: 350 }
];

const correctPositions = [
    { x: 350, y: 50 },
    { x: 90, y: 50 },
    { x: 590, y: 50 }
];

const alignmentThreshold_1 = 50;

let isDragging_1 = false;
let draggedImage_1 = null;
let offsetX_1 = 0;
let offsetY_1 = 0;

images_1.forEach(imgObj => {
    const img = new Image();
    img.src = imgObj.src;
    img.onload = () => {
        imgObj.image = img;
        drawCanvas_1();
    };
});

function drawCanvas_1() {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);

    images_1.forEach(imgObj => {
        if (imgObj.image) {
            ctx.drawImage(imgObj.image, imgObj.x, imgObj.y, imageSize, imageSize);
        }
    });

    lines_1.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    names_1.forEach(name => {
        ctx.font = "16px italic serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText(name.text, name.x, name.y);
    });

    if (areAllImagesAligned_1()) {
        ctx.font = "30px bold sans-serif";
        ctx.textAlign = "center";

        // Cambiar el color de relleno del texto para contrastar con el fondo
        ctx.fillStyle = "rgb(75, 0, 130)"; // Un tono de púrpura profundo
        ctx.fillText("¡Felicitaciones!", canvas1.width / 2, canvas1.height - 50);
    }

}

function areAllImagesAligned_1() {
    return images_1.every((imgObj, index) => {
        const correctPosition = correctPositions[index];
        return Math.abs(imgObj.x - correctPosition.x) <= alignmentThreshold_1 &&
            Math.abs(imgObj.y - correctPosition.y) <= alignmentThreshold_1;
    });
}

function isMouseOnImage_1(mouseX, mouseY, imgObj) {
    return mouseX >= imgObj.x && mouseX <= imgObj.x + imageSize &&
        mouseY >= imgObj.y && mouseY <= imgObj.y + imageSize;
}

canvas1.addEventListener('mousedown', (e) => {
    const rect = canvas1.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    images_1.forEach(imgObj => {
        if (isMouseOnImage_1(mouseX, mouseY, imgObj)) {
            isDragging_1 = true;
            draggedImage_1 = imgObj;
            offsetX_1 = mouseX - imgObj.x;
            offsetY_1 = mouseY - imgObj.y;
        }
    });
});

canvas1.addEventListener('mousemove', (e) => {
    if (isDragging_1 && draggedImage_1) {
        const rect = canvas1.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        draggedImage_1.x = mouseX - offsetX_1;
        draggedImage_1.y = mouseY - offsetY_1;

        drawCanvas_1();
    }
});

canvas1.addEventListener('mouseup', () => {
    isDragging_1 = false;
    draggedImage_1 = null;
    drawCanvas_1();
});

canvas1.addEventListener('mouseout', () => {
    isDragging_1 = false;
    draggedImage_1 = null;
});
