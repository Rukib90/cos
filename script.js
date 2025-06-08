// Simple RPG game logic

// Player stats tooltips
const stats = [
  { id: 'strength', value: 10, desc: 'Siła odpowiada za obrażenia.' },
  { id: 'speed', value: 8, desc: 'Szybkość określa szansę trafienia.' },
  { id: 'endurance', value: 15, desc: 'Wytrzymałość wpływa na liczbę punktów życia.' },
  { id: 'energy', value: 12, desc: 'Energia zwiększa siłę mocy specjalnych.' },
  { id: 'power', value: 45, desc: 'Moc to suma wszystkich statystyk.' }
];

// Action Points regeneration
const paMax = 2000;
let currentPA = 500;
const paRegenRate = 200;
let regenCountdown = 60;

function updatePATooltip() {
  const tooltip = document.getElementById('pa-tooltip');
  tooltip.textContent = currentPA < paMax
    ? `Odnowienie za: ${regenCountdown}s (+${paRegenRate} PA)`
    : 'Punkty Akcji są pełne!';
}

function regeneratePA() {
  if (currentPA < paMax) {
    if (regenCountdown > 0) {
      regenCountdown--;
    } else {
      regenCountdown = 60;
      currentPA = Math.min(currentPA + paRegenRate, paMax);
      document.getElementById('action-bar').textContent = `${currentPA}/${paMax}`;
    }
  }
  updatePATooltip();
}

function updateStatTooltips() {
  stats.forEach(({ id, value, desc }) => {
    const tooltip = document.getElementById(`${id}-tooltip`);
    if (tooltip) tooltip.textContent = `${desc} Obecna wartość: ${value}`;
  });
}

function openAvatarDialog() {
  alert('Tutaj można zmienić wygląd postaci.');
}

// Navigation between pages
function initNavigation() {
  const buttons = document.querySelectorAll('#links button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
      const id = btn.textContent.toLowerCase();
      const page = document.getElementById(`${id}-page`);
      if (page) page.classList.remove('hidden');
    });
  });
}

// Player movement and map rendering
let playerPos = { x: 300, y: 300 };
const mapSize = { width: 600, height: 600 };
const playerSpeed = 20;

function updatePlayer() {
  const player = document.getElementById('player');
  player.style.left = `${playerPos.x}px`;
  player.style.top = `${playerPos.y}px`;
}

function handleMovement(event) {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      if (playerPos.y > 0) playerPos.y -= playerSpeed;
      break;
    case 'ArrowDown':
    case 's':
      if (playerPos.y < mapSize.height - 20) playerPos.y += playerSpeed;
      break;
    case 'ArrowLeft':
    case 'a':
      if (playerPos.x > 0) playerPos.x -= playerSpeed;
      break;
    case 'ArrowRight':
    case 'd':
      if (playerPos.x < mapSize.width - 20) playerPos.x += playerSpeed;
      break;
  }
  updatePlayer();
  savePlayerPos();
}

document.addEventListener('keydown', handleMovement);

function savePlayerPos() {
  localStorage.setItem('playerPos', JSON.stringify(playerPos));
}

function loadPlayerPos() {
  const saved = localStorage.getItem('playerPos');
  if (saved) playerPos = JSON.parse(saved);
  updatePlayer();
}

async function loadMap(name) {
  const response = await fetch(`maps/${name}.json`);
  const data = await response.json();
  renderMap(data);
}

function renderMap(data) {
  const map = document.getElementById('map');
  map.style.width = `${data.width}px`;
  map.style.height = `${data.height}px`;
  map.innerHTML = '';
  data.objects.forEach(obj => {
    const el = document.createElement('div');
    el.classList.add('map-object');
    el.style.left = `${obj.x}px`;
    el.style.top = `${obj.y}px`;
    el.style.width = `${obj.width}px`;
    el.style.height = `${obj.height}px`;
    el.style.backgroundColor = obj.type === 'wall' ? '#000' : '#f00';
    map.appendChild(el);
  });
}

// Initial setup
window.addEventListener('DOMContentLoaded', () => {
  updateStatTooltips();
  updatePATooltip();
  setInterval(regeneratePA, 1000);
  initNavigation();
  loadPlayerPos();
  loadMap('castle');
});
