

// Asignaturas #3 Sociales
const canvas2 = document.getElementById('Sociales_');
const ctx5 = canvas2.getContext('2d');


const images_ = [
    { src: "./Imagen/Region_Caribe(1).png", x: 620, y: 50 },
    { src: "./Imagen/Region_Andina(1).png", x: 150, y: 50 },
    { src: "./Imagen/Region_Pacifica(1).png", x: 300, y: 50 },
    { src: './Imagen/Region_Orinoquia(1).png', x: 450, y: 50 },
    { src: './Imagen/Region_Amazonica(1).png', x: 10, y: 50 }
];

const lines_ = [
    { x1: 45, y1: 330, x2: 45, y2: 193 },
    { x1: 200, y1: 330, x2: 200, y2: 193 },
    { x1: 350, y1: 330, x2: 350, y2: 193 },
    { x1: 500, y1: 330, x2: 500, y2: 193 },
    { x1: 650, y1: 330, x2: 650, y2: 193 },
];

const names_ = [
    { text: "Region Caribe", x: 50, y: 350 },
    { text: "Region Andina", x: 200, y: 350 },
    { text: "Region Pacifica", x: 350, y: 350 },
    { text: "Region Orinoquia", x: 500, y: 350 },
    { text: "Region Amazonica", x: 650, y: 350 },
];

let isDragging_ = false;
let draggedImage_ = null;
let offsetX_ = 0;
let offsetY_ = 0;

const imageSize_ = 100;
const alignmentThreshold = 50;

images_.forEach(imgObj => {
    const img = new Image();
    img.src = imgObj.src;
    img.onload = () => {
        imgObj.image = img;
        drawCanvas_();
    };
});

function drawCanvas_() {
    ctx5.clearRect(0, 0, canvas2.width, canvas2.height);

    images_.forEach(imgObj => {
        if (imgObj.image) {
            ctx5.drawImage(imgObj.image, imgObj.x, imgObj.y, imageSize_, imageSize_);
        }
    });

    lines_.forEach(line => {
        ctx5.beginPath();
        ctx5.moveTo(line.x1, line.y1);
        ctx5.lineTo(line.x2, line.y2);
        ctx5.strokeStyle = "black";
        ctx5.lineWidth = 2;
        ctx5.stroke();
    });

    names_.forEach(name => {
        ctx5.font = "16px italic serif";
        ctx5.textAlign = "center";
        ctx5.fillStyle = "black";
        ctx5.fillText(name.text, name.x, name.y);
    });

    if (areAllImagesAligned()) {
        ctx5.font = "30px bold sans-serif";
        ctx5.textAlign = "center";
        ctx5.fillStyle = "rgb(75, 0, 130)"; // Un tono de púrpura profundo
        ctx5.fillText("¡Felicitaciones! Todas las imágenes están correctamente alineadas.", canvas2.width / 2, canvas2.height - 150);
    }
}

function areAllImagesAligned() {
    const correctPositions = [
        { x: 20, y: 50 },
        { x: 150, y: 50 },
        { x: 300, y: 50 },
        { x: 450, y: 50 },
        { x: 620, y: 50 }
    ];

    return images_.every((imgObj, index) => {
        const correctPosition = correctPositions[index];
        return Math.abs(imgObj.x - correctPosition.x) <= alignmentThreshold &&
            Math.abs(imgObj.y - correctPosition.y) <= alignmentThreshold;
    });
}

function isMouseOnImage(mouseX, mouseY, imgObj) {
    return mouseX >= imgObj.x && mouseX <= imgObj.x + imageSize_ &&
        mouseY >= imgObj.y && mouseY <= imgObj.y + imageSize_;
}

canvas2.addEventListener('mousedown', (e) => {
    const rect = canvas2.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    images_.forEach(imgObj => {
        if (isMouseOnImage(mouseX, mouseY, imgObj)) {
            isDragging_ = true;
            draggedImage_ = imgObj;
            offsetX_ = mouseX - imgObj.x;
            offsetY_ = mouseY - imgObj.y;
        }
    });
});

canvas2.addEventListener('mousemove', (e) => {
    if (isDragging_ && draggedImage_) {
        const rect = canvas2.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        draggedImage_.x = mouseX - offsetX_;
        draggedImage_.y = mouseY - offsetY_;

        drawCanvas_();
    }
});

canvas2.addEventListener('mouseup', () => {
    isDragging_ = false;
    draggedImage_ = null;
    drawCanvas_();
});

canvas2.addEventListener('mouseout', () => {
    isDragging_ = false;
    draggedImage_ = null;
});


