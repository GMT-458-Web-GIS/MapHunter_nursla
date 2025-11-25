const CENTER_LAT = 39.866580;
const CENTER_LON = 32.733756;

const GAME_BOUNDS = {
   minLon: CENTER_LON - 0.015, 
    minLat: CENTER_LAT - 0.020, 
    maxLon: CENTER_LON + 0.015, 
    maxLat: CENTER_LAT + 0.020
};

const START_LAT = CENTER_LAT;
const START_LON = CENTER_LON;

const TARGET_SCORE = 400; 
const MIN_DISTANCE_METERS = 200; 

let player = {lat: START_LAT, lon: START_LON};
let score = 0;
let timeLeft = 90;
let gameActive = false; 
let playerMarker;
let activeCreatures = new Map(); 
let timerInterval; 
let proximityInterval;

// map and layers

//OSM
const osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '© OpenStreetMap'
});

//sattelite
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, attribution: '© Esri'
});

//CartoDB Light Matter
const cleanLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, attribution: '© CartoDB'
});

//CartoDB Dark Matter
const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, attribution: '© CartoDB'
});

const map = L.map('map', {
    zoomControl: false, 
    layers: [cleanLayer] 
}).setView([player.lat, player.lon], 14);

// layer controls
const baseMaps = {
    "☀️ Day Mode (Plain)": cleanLayer, 
    "🗺️ Standart": osmLayer,
    "🛰️ Satellite": satelliteLayer,
    "🌙 Night Mode": darkLayer 
};

L.control.layers(baseMaps, null, {position: 'topright'}).addTo(map);

map.on('baselayerchange', function(e) {
    if (e.name === "🌙 Night Mode") {

        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
});

//other controls
L.control.scale({position: 'bottomleft', imperial: false, metric: true}).addTo(map);

const boundsRect = L.rectangle([
    [GAME_BOUNDS.minLat, GAME_BOUNDS.minLon],
    [GAME_BOUNDS.maxLat, GAME_BOUNDS.maxLon]
], {color: "#e74c3c", weight: 3, fill: false, dashArray: '10, 10'}).addTo(map);

const radarCircle = document.createElement("div");
radarCircle.classList.add("radar-circle");
map.getPanes().overlayPane.appendChild(radarCircle);

const playerIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/188/188987.png",
    iconSize: [60, 60]
});
playerMarker = L.marker([player.lat, player.lon], {icon: playerIcon}).addTo(map);


map.on('zoomend', () => {
    const z = map.getZoom();
    document.getElementById('zoom-level').innerText = z;
    updateVisibility(z);
});
map.on('mousemove', (e) => {
    document.getElementById('mouse-coords').innerText = 
        `Lat: ${e.latlng.lat.toFixed(5)}, Lon: ${e.latlng.lng.toFixed(5)}`;
});

// START GAME
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    gameActive = true;
    initGame();
    
    timerInterval = setInterval(() => {
        if (!gameActive) return;
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if (timeLeft <= 0) endGame(false); 
    }, 1000);

    proximityInterval = setInterval(() => {
        if (!gameActive) return;

        activeCreatures.forEach(creature => {
            if (!map.hasLayer(creature.marker) || creature.caught) return;
            const c = creature.marker.getLatLng();
            const dist = turf.distance(
                turf.point([player.lon, player.lat]),
                turf.point([c.lng, c.lat]), {units: 'meters'}
            );
            if (dist <= 45) catchCreature(creature.id);
        });
        
        updateSensor();
    }, 200);
}

// SENSOR SYSTEM 
function updateSensor() {
    if (activeCreatures.size === 0) {
        document.getElementById("nearest-distance").innerText = "Area Clear";
        document.getElementById("signal-level").style.width = "0%";
        return;
    }

    let minDistance = Infinity;

    activeCreatures.forEach(creature => {
        if (creature.caught) return;
        const cLoc = creature.marker.getLatLng();
        const dist = turf.distance(
            turf.point([player.lon, player.lat]), 
            turf.point([cLoc.lng, cLoc.lat]), {units: 'meters'}
        );
        if (dist < minDistance) minDistance = dist;
    });

    const distPanel = document.getElementById("nearest-distance");
    const panelBox = document.getElementById("sensor-panel");
    const bar = document.getElementById("signal-level");

    if (minDistance === Infinity) {
        distPanel.innerText = "No Signal";
        bar.style.width = "0%";
    } else {
        if (minDistance > 1000) {
            distPanel.innerText = (minDistance / 1000).toFixed(1) + " km";
        } else {
            distPanel.innerText = Math.round(minDistance) + " m";
        }
        // Signal strength logic 
        let signalStrength = Math.max(0, 100 - (minDistance / 50)); 
        bar.style.width = signalStrength + "%";
        // Alert logic 
        if (minDistance < 200) {
            panelBox.classList.add("sensor-alert");
            distPanel.style.color = "#e74c3c";
        } else {
            panelBox.classList.remove("sensor-alert");
            distPanel.style.color = "#fff";
        }
    }
}

// DIFFICULTY SETTINGS
const DIFFICULTY_TYPES = {
    EASY: { 
        id: 'easy', 
        name: "Bulbasaur", 
        score: 25, 
        icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", 
        minZ: 13, 
        maxZ: 18, 
        lifespan: null, 
        color: "spawn-glow" 
    },
    MEDIUM: { 
        id: 'medium', 
        name: "Charmander", 
        score: 50, 
        icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png", 
        minZ: 15, 
        maxZ: 18, 
        lifespan: 20000, 
        color: "glow-orange" 
    },
    HARD: { 
        id: 'hard', 
        name: "Gengar", 
        score: 100, 
        icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", 
        minZ: 17, 
        maxZ: 18, 
        lifespan: 10000, 
        color: "glow-red" 
    }
};

function getSafeLocation() {
    let attempts = 0;
    while(attempts < 50) {
        attempts++;
        const rLat = GAME_BOUNDS.minLat + Math.random() * (GAME_BOUNDS.maxLat - GAME_BOUNDS.minLat);
        const rLon = GAME_BOUNDS.minLon + Math.random() * (GAME_BOUNDS.maxLon - GAME_BOUNDS.minLon);
        
        const distToPlayer = turf.distance(turf.point([player.lon, player.lat]), turf.point([rLon, rLat]), {units: 'meters'});
        if (distToPlayer < 50) continue;

        let tooClose = false;
        activeCreatures.forEach(creature => {
            const cLoc = creature.marker.getLatLng();
            const dist = turf.distance(turf.point([cLoc.lng, cLoc.lat]), turf.point([rLon, rLat]), {units: 'meters'});
            if (dist < MIN_DISTANCE_METERS) tooClose = true;
        });

        if (!tooClose) return {lat: rLat, lon: rLon};
    }
    return {
        lat: GAME_BOUNDS.minLat + Math.random() * (GAME_BOUNDS.maxLat - GAME_BOUNDS.minLat),
        lon: GAME_BOUNDS.minLon + Math.random() * (GAME_BOUNDS.maxLon - GAME_BOUNDS.minLon)
    };
}

function updateVisibility(zoom) {
    activeCreatures.forEach(creature => {
        if (creature.caught) return;
        const type = creature.type;
        if (zoom >= type.minZ && zoom <= type.maxZ) {
            if (!map.hasLayer(creature.marker)) {
                creature.marker.addTo(map);
                creature.marker._icon.classList.add(type.color);
            }
        } else {
            if (map.hasLayer(creature.marker)) map.removeLayer(creature.marker);
        }
    });
}

function catchCreature(creatureId) {
    const creature = activeCreatures.get(creatureId);
    if (!creature || !gameActive || creature.caught) return;

    creature.caught = true; 
    if (creature.marker._icon) creature.marker._icon.style.pointerEvents = "none";

    score += creature.type.score;
    document.getElementById("score").innerText = "Score: " + score;

    if (creature.marker._icon) creature.marker._icon.classList.add("catch-anim");

    setTimeout(() => {
        removeCreature(creatureId);
        if (activeCreatures.size === 0) endGame(true);
    }, 300);
}

function removeCreature(id) {
    const creature = activeCreatures.get(id);
    if (creature) {
        if (creature.timer) clearTimeout(creature.timer);
        if (map.hasLayer(creature.marker)) map.removeLayer(creature.marker);
        activeCreatures.delete(id);
    }
}

function spawnCreature(type) {
    const loc = getSafeLocation();
    const icon = L.icon({ iconUrl: type.icon, iconSize: [60, 60] });
    const marker = L.marker([loc.lat, loc.lon], {icon});
    const uniqueId = Date.now() + Math.random().toString();

    const newCreature = { id: uniqueId, marker: marker, type: type, caught: false, timer: null };

    marker.on('click', () => catchCreature(uniqueId));
    activeCreatures.set(uniqueId, newCreature);

    const z = map.getZoom();
    if (z >= type.minZ && z <= type.maxZ) {
        marker.addTo(map);
        setTimeout(() => {
            if (marker._icon) {
                marker._icon.style.pointerEvents = "auto";
                marker._icon.style.zIndex = "999999";
                marker._icon.classList.add(type.color);
            }
        }, 50);
    }

    if (type.lifespan) {
        newCreature.timer = setTimeout(() => {
            if (newCreature.caught || !gameActive) return;
            if (marker._icon) marker.setOpacity(0.5);
            setTimeout(() => {
                removeCreature(uniqueId);
                spawnCreature(type); 
            }, 500);
        }, type.lifespan);
    }
}

function initGame() {
    activeCreatures.clear();
    for(let i=0; i<4; i++) spawnCreature(DIFFICULTY_TYPES.EASY);
    for(let i=0; i<2; i++) spawnCreature(DIFFICULTY_TYPES.MEDIUM);
    for(let i=0; i<2; i++) spawnCreature(DIFFICULTY_TYPES.HARD);
}

// MOVEMENT (SPEED BOOSTED)
const step = 0.001; 

document.addEventListener("keydown", e => {
    if(!gameActive) return; 
    let newLat = player.lat;
    let newLon = player.lon;
    let moved = false;

    if (e.key === "w" || e.key === "ArrowUp") { newLat += step; moved = true; }
    if (e.key === "s" || e.key === "ArrowDown") { newLat -= step; moved = true; }
    if (e.key === "a" || e.key === "ArrowLeft") { newLon -= step; moved = true; }
    if (e.key === "d" || e.key === "ArrowRight") { newLon += step; moved = true; }

    if (moved) {
        if (newLat >= GAME_BOUNDS.minLat && newLat <= GAME_BOUNDS.maxLat &&
            newLon >= GAME_BOUNDS.minLon && newLon <= GAME_BOUNDS.maxLon) {
            
            player.lat = newLat;
            player.lon = newLon;
            playerMarker.setLatLng([player.lat, player.lon]);
            
            if(playerMarker._icon) {
                playerMarker._icon.classList.add("player-walk");
                setTimeout(() => playerMarker._icon.classList.remove("player-walk"), 200);
            }
            updateSensor();
        }
    }
});

function endGame(isClear) {
    gameActive = false;
    clearInterval(timerInterval);
    clearInterval(proximityInterval);
    
    const gameOverScreen = document.getElementById("game-over");
    const msg = document.getElementById("finalScore");
    const title = document.querySelector("#game-over h1");
    
    if (score >= TARGET_SCORE || isClear) {
        gameOverScreen.style.background = "rgba(46, 204, 113, 0.95)";
        title.innerText = "🏆 MISSION COMPLETE!";
        msg.innerText = `Area Secured!\nScore: ${score}`;
    } else {
        gameOverScreen.style.background = "rgba(231, 76, 60, 0.95)";
        title.innerText = "💀 TIME'S UP";
        msg.innerText = `Mission Failed!\nTarget: ${TARGET_SCORE} - Score: ${score}`;
    }
    gameOverScreen.style.display = "block";
}