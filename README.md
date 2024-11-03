# GoBang Project

## 📝 Project Overview
GoBang is a **JavaScript-based Gomoku (Five in a Row) game** with support for:
- **Single-player mode** against an AI opponent.
- **Local two-player mode**.
- **Online mode** (planned).

The project features modern frontend techniques with a Node.js backend to handle AI computations.

---

## 🚀 Features
- **Single-Player Mode**: Play against an intelligent AI using the `minmax` algorithm.
- **Local Multiplayer**: Enjoy a game with friends locally.
- **Optimized AI**:
  - Uses `minmax` search algorithm.
  - Includes a scoring function and cache for enhanced performance.
- **Responsive Design**: The game adapts to various screen sizes.
- **Undo and Restart**: Easily undo your last move or restart the game at any time.

---

## 🛠️ Tech Stack
### Frontend
- **HTML5** and **CSS3**
- **JavaScript (ES6+)**
- **Canvas API** for board rendering

### Backend
- **Node.js** with **Express.js**
- Custom AI module utilizing:
  - `minmax` algorithm.
  - Board evaluation functions.

### Development Tools
- **Visual Studio Code**
- **Git** for version control

---

## 📂 Project Structure
---plaintext
/public
  ├── index.html        # Main game interface
  ├── styles.css        # Game styles
  ├── index.js          # Frontend logic
/server
  ├── app.js            # Backend server entry point
  ├── ai.js             # AI core logic
  ├── board.js          # Board class implementation
  ├── minmax.js         # Minimax algorithm implementation
  ├── eval.js           # Board evaluation functions
  ├── config.js         # Global configuration
  └── cache.js          # Cache class for AI optimization


---

## 📘 Usage

---

### How to Play
- **Single-Player Mode**: Click on the board to place a piece. The backend will calculate the AI's move and display it.
- **Undo**: Click the **"Undo"** button to revert your last move.
- **Restart**: Click the **"Restart"** button to reset the game and start a new session.


---
  ## 📈 Roadmap

---

- [ ] Implement online multiplayer mode.
- [ ] Optimize AI for faster responses.
- [ ] Add user login and leaderboard functionality.

---

## 🤝 Contribution

Welcome all contributions! Please submit a **Pull Request** or report any **Issues**.

---
## 📄 License

This project is licensed under the [MIT License](LICENSE).



