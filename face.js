let referenceFaceDescriptor = null;

// Загружаем модели face-api.js
async function loadFaceModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
}

// Загружаем эталонное фото твоего лица
async function loadReferenceFace() {
    const img = await faceapi.fetchImage('Images/mavver/my_face.jpg'); // твое фото
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (detection) referenceFaceDescriptor = detection.descriptor;
}

// Проверка и подсветка твоего лица на картинке
async function highlightMyFace(imgElement) {
    if (!referenceFaceDescriptor) return;

    const detections = await faceapi.detectAllFaces(imgElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

    const canvas = faceapi.createCanvasFromMedia(imgElement);
    imgElement.parentNode.appendChild(canvas);
    faceapi.matchDimensions(canvas, { width: imgElement.width, height: imgElement.height });

    detections.forEach(detection => {
        const distance = faceapi.euclideanDistance(detection.descriptor, referenceFaceDescriptor);
        // Чем меньше distance, тем больше совпадение (0 идеально)
        if (distance < 0.5) {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: 'Это я', boxColor: 'green' });
            drawBox.draw(canvas);
        }
    });
}

// После создания колонок
async function highlightFacesInGrid() {
    const imgs = document.querySelectorAll('.item img');
    for (let img of imgs) {
        // ждём, пока изображение загрузится
        if (!img.complete) await new Promise(res => img.onload = res);
        highlightMyFace(img);
    }
}

// Инициализация
(async () => {
    await loadFaceModels();
    await loadReferenceFace();
    await highlightFacesInGrid();
})();