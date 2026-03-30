const grid = document.getElementById('grid');
const sizes = ["small-vert","medium-vert","large-vert","small-horiz","medium-horiz","large-horiz","square"];
let images = [];

let usedImages = new Set();

let items = [];
let speed = 0.3; // базовая скорость


/* ЗАГРУЗКА JSON */
async function loadImages() {
    try {
        const res = await fetch("images.json");
        const data = await res.json();
        images = data.map(name => `Images/mavver/${name}`);
    } catch(e){ console.error("Ошибка загрузки images.json", e); }
}

/* ПЕРЕМЕШИВАНИЕ */
function shuffleArray(array) {
    const arr = [...array];
    for(let i=arr.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
}

function createColumns() {
    const columnCount = getColumnCount();

/* СОЗДАНИЕ ЭЛЕМЕНТОВ */
function createItems() {

    grid.innerHTML = "";
    items = [];

    const shuffled = shuffleArray([...images]);
    const cols = Math.floor(grid.clientWidth / 200); // примерная ширина фоток
    let colHeights = Array(cols).fill(grid.clientHeight); // стартовые позиции снизу

        const usedInColumn = new Set(); // только для текущей колонки
        const fullList = shuffleArray([...images, ...images]);

        fullList.forEach(src => {
            if (usedInColumn.has(src)) return; // внутри колонки не повторяем
            usedInColumn.add(src);

            const item = document.createElement("div");
            item.className = "item " + sizes[Math.floor(Math.random() * sizes.length)];
    shuffled.forEach((src) => {
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const div = document.createElement("div");
        div.className = "item " + size;

        const img = document.createElement("img");
        img.src = src;
        img.loading = "lazy";
        div.appendChild(img);
        grid.appendChild(div);

        const rect = div.getBoundingClientRect();
        const width = rect.width;

        // найти колонку с минимальной высотой
        let colIndex = colHeights.indexOf(Math.min(...colHeights));
        const x = colIndex * (grid.clientWidth / cols);
        const y = colHeights[colIndex];

        div.style.left = x + "px";
        div.style.top = y + "px";

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

        colHeights[colIndex] = y - rect.height - 10; // сдвигаем колонку вверх
        items.push({el: div, x, y, width, height: rect.height, colIndex});

    });
}

/* АНИМАЦИЯ СНИЗУ ВВЕРХ */
function animate() {
    items.forEach(item => {
        item.y += speed;
        if(item.y > grid.clientHeight){
            item.y = -item.height; // зацикливаем снизу
        }
        item.el.style.top = item.y + "px";
    });
    requestAnimationFrame(animate);
}

/* INIT */
(async()=>{
    await loadImages();
    if(images.length===0){ console.warn("images.json пустой"); return; }
    createItems();
    animate();
})();

window.addEventListener("resize", ()=>{
    createItems();
});