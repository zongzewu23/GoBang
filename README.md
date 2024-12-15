# GoBang Project

## 📝 Project Overview
GoBang is a **JavaScript-based Gomoku (Five in a Row) game** offering:
- **Single-player mode** against an AI opponent.
- **Local two-player mode** for offline multiplayer.
- **Online multiplayer mode** (future feature).

This project demonstrates modern frontend techniques combined with a Node.js backend to manage AI computations and game state.

---

## 🚀 Features
- **Single-Player Mode**: Play against an AI using an optimized `minmax` algorithm.
- **Local Multiplayer Mode**: Challenge a friend locally.
- **Undo and Restart**:
  - Undo the last move or restart the game at any time.
  - Choose **"Restart as Black"** or **"Restart as White"**, with user stats dynamically updated.
- **Responsive Design**: Adapts seamlessly to different screen sizes and devices.
- **User Information Display**:
  - View `Max Streak`, `Win Rate`, `Total Games`, and more.
  - Statistics update automatically based on game results.
- **Upload Avatar**:
  - Upload custom avatars to personalize your account.
  - Avatars are displayed alongside your user name.
- **Optimized AI**:
  - Implements `minmax` algorithm for decision-making.
  - Uses a custom scoring function and caching for efficient performance.



---

## 🛠️ Tech Stack
### **Frontend**
- **HTML5** and **CSS3** for structure and design.
- **JavaScript (ES6+)** for game logic.
- **Canvas API** for dynamic board rendering.

### **Backend**
- **Node.js** with **Express.js** for server logic.
- AI implemented using:
  - `minmax` algorithm for intelligent decision-making.
  - Board evaluation and caching for optimal performance.

### **Development Tools**
- **Visual Studio Code**
- **Git** for version control and collaboration.

---

## 📂 Project Structure
```plaintext
GoBang/
├── app.js              # Backend server entry point
├── db.js               # PostgreSQL database connection
├── package.json        # Project metadata and dependencies
├── public/             # Main frontend directory
│   ├── index.html      # Main game interface
│   ├── login.html      # Login page
│   ├── offline-mode.html # Offline multiplayer mode page
│   ├── styles.css      # General styles
│   ├── login.css       # Specific styles for login page
│   ├── index.js        # Main frontend logic
│   ├── login.js        # Logic for login page
│   ├── offline-mode.js # Logic for offline multiplayer mode
│   ├── uploads/        # User-uploaded files
│       └── avatars/    # Uploaded user avatars
├── server/             # Backend logic directory
│   ├── ai.js           # AI core logic
├── src/                # Media files
│   ├── piecedown.mp3   # Sound effect for placing a piece
│   ├── rockwin.wav     # Sound effect for black's victory
│   ├── choirwin.wav    # Sound effect for white's victory
│   └── default-avatar.jpg # Default user avatar
| ... statics
```

---

## 📘 Usage

---

### **Play the Game**

1. **Single-Player Mode**:
   - Click on the board to place a piece. The AI will respond with its move.

2. **Local Multiplayer Mode**:
   - Take turns with a friend to play on the same device.

3. **Undo a Move**:
   - Click the **"Undo"** button to revert the last move.

4. **Restart the Game**:
   - Choose **"Restart as Black"** to restart the game with the player as black.
   - Choose **"Restart as White"** to restart the game with the player as white.
   - All user information (e.g., `Max Streak`, `Win Rate`) will reset and update accordingly.

5. **Display User Stats**:
   - View `Max Streak`, `Total Games`, `Win Rate`, and other statistics, which dynamically update based on gameplay.


---
  ## 📈 Roadmap

---

- [ ] Implement online multiplayer mode.
- [x] Optimize AI for faster responses.
- [x] Add user login and leaderboard functionality.

---

## 🤝 Contribution

Welcome all contributions! Please submit a **Pull Request** or report any **Issues**.

---
## 📄 License

This project is licensed under the [MIT License](LICENSE).



