# 📍 GeoGame: Hacettepe Campus Exploration
 
**Project :** MapHunter: Signal Ops
**Author:** Nur Sıla Özkan

---
![geogame](https://github.com/user-attachments/assets/877bedaf-3a8f-4df6-a753-33cde736bd76)


# 📡 MapHunter: Signal Ops

**MapHunter** is a location-based spatial game built with **Leaflet.js** and **Turf.js**. Players take on the role of a signal operator, navigating a digital map to locate and secure hidden targets using a proximity sensor system before time runs out.

🚀 **Live Demo:** [Play MapHunter](https://gmt-458-web-gis.github.io/geogame-nursla/)

---

## 🎮 Game Mechanics

### 1. The Mission
You have **90 seconds** to reach a target score of **400 points**. 
- Hidden creatures appear on the map based on difficulty levels.
- Use your **Sensor Panel** to detect how close you are to a target.

### 2. Proximity Sensor & Radar
- **Signal Bar:** Fills up as you get closer to a target.
- **Alert:** The panel glows <span style="color:red">RED</span> when you are within 200m.
- **Radar:** A visual ripple effect surrounds your player location.

### 3. Zoom-Based Visibility
Not all targets are visible at once!
- **Easy Targets:** Visible at lower zoom levels.
- **Hard Targets:** Only appear when you **zoom in deeply (Level 17+)**.

---

## 🕹️ Controls

| Key / Action | Function |
| :--- | :--- |
| **W / ▲** | Move North |
| **S / ▼** | Move South |
| **A / ◄** | Move West |
| **D / ►** | Move East |
| **Scroll / Pinch** | Zoom In/Out (Crucial for finding targets) |
| **Mouse Hover** | View coordinates |

---

## 🛠️ Technologies Used

* **[Leaflet.js](https://leafletjs.com/)**: For rendering the interactive map and layers.
* **[Turf.js](https://turfjs.org/)**: For geospatial analysis (calculating distance between player and targets).
* **HTML5 & CSS3**: For the HUD, animations, and responsive design.
* **Map Tiles**:
    * *OpenStreetMap* (Standard)
    * *Esri World Imagery* (Satellite)
    * *CartoDB* (Dark/Light Matter)

---

## 🎨 Features

- **Dark Mode Support:** The UI automatically switches to a dark theme when "Night Mode" map layer is selected.
- **Dynamic Difficulty:**
    - 🟢 **Easy:** Static targets.
    - 🟠 **Medium:** Targets disappear after 20 seconds.
    - 🔴 **Hard:** High score, but they flee quickly (10s lifespan)!
- **Responsive UI:** Works on desktop with a specialized HUD.


---


## 📦 Play 

1. **Clone the repository**
   ```bash
   git clone [https://gmt-458-web-gis.github.io/MapHunter_nursla/](https://gmt-458-web-gis.github.io/MapHunter_nursla/)







.
.
.
(Soon)
---
