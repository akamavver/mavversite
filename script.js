const grid = document.getElementById('grid');
const sizes = ["small", "medium", "large"];
let images = [];
let usedImages = new Set();

/* === ЗАГРУЗКА JSON === */
async function loadImages() {
    try {
        const res = await fetch("images.json");
        const data = await res.json();
        images = data.map(name => `Images/mavver/${name}`);
    } catch (e) {
        console.error("Ошибка загрузки images.json", e);
    }
}

/* === ПЕРЕМЕШИВАНИЕ МАССИВА === */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/* === СОЗДАНИЕ СЕТКИ === */
function createColumns() {
    const columnCount = getColumnCount();
    grid.innerHTML = "";
    usedImages.clear();

    for (let i = 0; i < columnCount; i++) {
        const col = document.createElement("div");
        col.className = "column";

        const fullList = shuffleArray([...images, ...images]);

        fullList.forEach(src => {
            if (usedImages.has(src)) return; // пропускаем уже вставленные
            usedImages.add(src);

            const item = document.createElement("div");
            item.className = "item " + sizes[Math.floor(Math.random() * sizes.length)];

            const img = document.createElement("img");
            img.src = src;
            img.loading = "lazy";

            item.appendChild(img);
            col.appendChild(item);
        });

        grid.appendChild(col);
    }
}

/* === КОЛОНКИ === */
function getColumnCount() {
    const w = window.innerWidth;
    if (w < 500) return 3; // мобила = 3 колонки
    if (w < 800) return 3;
    if (w < 1200) return 4;
    return 5;
}

/* === АНИМАЦИЯ === */
let columns = [];
let speeds = [];
let offset = [];

function initAnimation() {
    columns = document.querySelectorAll(".column");
    speeds = [];
    offset = [];
    const isMobile = window.innerWidth < 800;

    columns.forEach(() => {
        speeds.push((isMobile ? 0.6 : 0.2) + Math.random() * (isMobile ? 0.4 : 0.4));
        offset.push(0);
    });
}

function animate() {
    columns.forEach((col, i) => {
        offset[i] += speeds[i];
        if (offset[i] > col.scrollHeight / 2) offset[i] = 0;
        col.style.transform = `translateY(-${offset[i]}px)`;
    });
    requestAnimationFrame(animate);
}

/* === INIT === */
(async () => {
    await loadImages();
    if (images.length === 0) {
        console.warn("images.json пустой");
        return;
    }
    createColumns();
    initAnimation();
    animate();
})();

/* === RESIZE === */
window.addEventListener("resize", () => {
    createColumns();
    initAnimation();
});