# 🏁 ToadKart: A Retro Two-Player Battle Game

ToadKart is a retro-style interactive game inspired by Mario Kart's balloon battle mode. Built as part of the Unitbase Founding Engineer take-home project, it demonstrates full-stack architecture, thoughtful gameplay mechanics, and a fun, intuitive UX.

---

## 🎮 Gameplay Overview

- **Two Game Modes:**
  - **Single Player**: Battle against a CPU that throws projectiles and collects items.
  - **Two Player**: Face off against another human using simultaneous keyboard controls.
- **Items & Combat:**
  - Collect item boxes to get shells or bananas.
  - Throw items at your opponent to reduce their hearts.
- **Victory Conditions:**
  - First player to deplete the other’s hearts wins.
  - "Play Again" and "Return to Menu" available post-match.
- **Character Selection:**
  - Choose your character at the start — unlock more by winning with full health!

---

## 🛠️ Tech Stack

- **Frontend:** React (Next.js)
- **Styling:** Tailwind CSS
- **Game Loop:** `requestAnimationFrame`, custom movement/collision handling
- **Optional Backend:** FastAPI (currently not required to run the game)
- **Hosting:** Local (can be deployed to Vercel/Railway/etc.)

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/jyush98/toadkart.git
cd toadkart
cd apps/web
npm install
npm run dev

Then open http://localhost:3004 in your browser.