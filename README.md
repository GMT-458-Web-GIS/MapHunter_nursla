# 📍 GeoGame: Hacettepe Campus Exploration
 
**Project :** GeoGame (Gamified Spatial Exploration on Beytepe Campus)  
**Author:** Nur Sıla Özkan

---
![geogame](https://github.com/user-attachments/assets/877bedaf-3a8f-4df6-a753-33cde736bd76)


### 1️⃣ Project Overview

**GeoGame** is a browser-based geospatial game where players navigate the Hacettepe Beytepe Campus map and collect virtual items placed at random locations. The game uses **MapLibre GL JS** for map rendering, and players collect items by clicking on them—all within a time limit.

Key mechanics:
- 5 items with different difficulty levels
- Time-limited: 5 minutes total
- Hard items disappear if not collected within 60 seconds
- Score increases with each collected item

---

### 2️⃣ Game Design Requirements

This design meets the required deliverables, including:

- Game flow description  
- UI layout (wireframe)  
- Number of missions / items  
- Lives system (if any)  
- Technology stack  
- Project folder structure  
- Git workflow proposal  

---

### 3️⃣ UI Layout — Wireframe Sketch

The game's interface will consist of a control panel on the left and a map on the right:

-------------------------------------------------------------
 GeoGame - Hacettepe (Start / Reset buttons) 
-------------------------------------------------------------

| Left Panel (Stats & Controls)                                   | Map             |
| --------------------------------------------------------------- | --------------- |
| Score: 0                                                        |                 |
| Time: 5:00                                                      | [Map Container] |
| Remaining: 5                                                    |                 |
| Current Zoom: 15                                                |                 |
| [Start] [Pause]                                                 |                 | 




---

### 4️⃣ How the Game Will Progress

1️⃣ Game starts when **Start** is clicked.

2️⃣ Items are randomly placed across the map using non-repeating coordinates.

3️⃣ Each item has a point value and difficulty:
   - 📝 Easy: 100 pts  
   - 🔑 Medium: 150–180 pts  
   - 🏆 Hard: 250 pts (expires after 60s)
     
4️⃣ Player collects an item by clicking it.

5️⃣ The game ends when:
   - All items are collected 🏆 → Victory  
   - Time runs out ⏰ → Game Over

---

### 5️⃣ Game Details

| Feature          | Specification |
|------------------|---------------|
| Number of items  | 5             |
| Time limit       | 5 minutes     |
| Lives            | None          |
| Game engine      | MapLibre GL JS |

---

### 6️⃣ Technology Stack

- MapLibre GL JS
- HTML, CSS3, JavaScript 
- Optional: Deck.gl, Chart.js, D3 for further visualization

---

### 7️⃣ Suggested Project Structure

/ (repo root)

│
├─ index.html

├─ css/
│   └─ style.css

├─ js/
│   └─ game.js

├─ assets/
│   └─ icons/

└─ README.md




---

### 8️⃣ How to Run the Project Locally

1. Clone the repository:
git clone <my-repo-url>

2. Serve locally using:

.
.
.
(Soon)
---
