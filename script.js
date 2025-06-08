// Konfiguracja odnowienia PA
const paMax = 2000;
let currentPA = 500;
const paRegenRate = 200; // Punkty przywracane co 60 sekund
let regenCountdown = 60; // Czas do odnowienia w sekundach

// Funkcja do aktualizacji dynamicznego dymka dla PA
function updateDynamicTooltip() {
    const tooltip = document.getElementById('pa-tooltip');
    if (currentPA < paMax) {
        tooltip.textContent = `Odnowienie za: ${regenCountdown}s (+${paRegenRate} PA)`;
    } else {
        tooltip.textContent = "Punkty Akcji są pełne!";
    }
}

// Funkcja do regeneracji PA
function regeneratePA() {
    if (currentPA < paMax) {
        if (regenCountdown > 0) {
            regenCountdown--;
        } else {
            regenCountdown = 60; // Resetuj licznik
            currentPA = Math.min(currentPA + paRegenRate, paMax); // Regeneruj PA
            document.getElementById('action-bar').textContent = `${currentPA}/${paMax}`;
        }
    }
    updateDynamicTooltip();
}

// Funkcja do aktualizacji dynamicznych dymków dla statystyk
function updateStatTooltips() {
    const stats = [
        { id: 'strength', value: 10, description: 'Siła odpowiada za obrażenia zadawane przeciwnikom.' },
        { id: 'speed', value: 8, description: 'Szybkość określa szansę na trafienie przeciwnika.' },
        { id: 'endurance', value: 15, description: 'Wytrzymałość wpływa na liczbę punktów życia.' },
        { id: 'energy', value: 12, description: 'Energia zwiększa siłę mocy specjalnych.' },
        { id: 'power', value: 45, description: 'Moc to suma wszystkich statystyk postaci.' }
    ];

    stats.forEach(stat => {
        const tooltip = document.getElementById(`${stat.id}-tooltip`);
        tooltip.textContent = `${stat.description} Obecna wartość: ${stat.value}`;
    });
}

// Inicjalizacja dynamicznych dymków
document.addEventListener('DOMContentLoaded', () => {
    updateDynamicTooltip();
    updateStatTooltips();
    setInterval(regeneratePA, 1000); // Aktualizuj co sekundę
});
// Inicjalizacja pozycji gracza
let playerPosition = { x: 300, y: 300 }; // Środek mapy
const mapSize = { width: 600, height: 600 }; // Wymiary mapy
const playerSpeed = 20; // Piksele na ruch

// Funkcja do aktualizacji pozycji gracza
function updatePlayerPosition() {
    const player = document.getElementById('player');
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
}

// Obsługa klawiszy ruchu
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            if (playerPosition.y > 0) playerPosition.y -= playerSpeed;
            break;
        case 'ArrowDown':
        case 's':
            if (playerPosition.y < mapSize.height - 20) playerPosition.y += playerSpeed;
            break;
        case 'ArrowLeft':
        case 'a':
            if (playerPosition.x > 0) playerPosition.x -= playerSpeed;
            break;
        case 'ArrowRight':
        case 'd':
            if (playerPosition.x < mapSize.width - 20) playerPosition.x += playerSpeed;
            break;
    }
    updatePlayerPosition();
    savePlayerPosition();
});

// Zapis pozycji gracza w lokalnej pamięci przeglądarki
function savePlayerPosition() {
    localStorage.setItem('playerPosition', JSON.stringify(playerPosition));
}

// Odczyt pozycji gracza z lokalnej pamięci
function loadPlayerPosition() {
    const savedPosition = localStorage.getItem('playerPosition');
    if (savedPosition) {
        playerPosition = JSON.parse(savedPosition);
    }
    updatePlayerPosition();
}

// Wczytanie pozycji gracza po załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerPosition();
    loadMap('castle'); // Wczytaj początkową mapę
});

// Wczytanie mapy z pliku JSON
async function loadMap(mapName) {
    const response = await fetch(`maps/${mapName}.json`);
    const mapData = await response.json();
    renderMap(mapData);
}

// Renderowanie mapy
function renderMap(mapData) {
    const map = document.getElementById('map');
    map.style.width = `${mapData.width}px`;
    map.style.height = `${mapData.height}px`;
    map.innerHTML = ''; // Usuń poprzednie obiekty
    mapData.objects.forEach(obj => {
        const element = document.createElement('div');
        element.classList.add('map-object');
        element.style.left = `${obj.x}px`;
        element.style.top = `${obj.y}px`;
        element.style.width = `${obj.width}px`;
        element.style.height = `${obj.height}px`;
        element.style.backgroundColor = obj.type === 'wall' ? '#000' : '#f00';
        map.appendChild(element);
    });
}
