GoBang Project
Project Overview
GoBang is a JavaScript-based Gomoku (Five in a Row) game that supports single-player mode against an AI, local two-player mode, and online mode. The project employs modern frontend technologies with a Node.js backend to provide AI opponent capabilities.

Features
Single-Player Mode: Play against an AI opponent. The AI uses the minmax algorithm with an evaluation function to determine the best move.
Two-Player Mode: Local game where two players take turns placing pieces.
AI Algorithm: Utilizes the minmax search algorithm, scoring functions, and a custom cache mechanism for optimization.
Responsive UI: Game interface adapts to screen size for enhanced user experience.
Undo Functionality: Players can undo their last move.
Tech Stack
Frontend:
HTML5
CSS3
JavaScript (ES6+)
Canvas API for drawing the board and pieces
Backend:
Node.js
Express.js
Custom AI module using minmax algorithm and board evaluation logic
Development Tools:
Visual Studio Code
Git version control
Project Structure
bash
Copy code
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
  └── cache.js          # Cache class for AI search optimization
How to Run
Steps to run locally:
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/gobang.git
cd gobang
Install dependencies:

bash
Copy code
npm install
Start the server:

bash
Copy code
node app.js
Open http://localhost:3000 in your browser to start playing.

Usage
Single-Player Mode: Click on the board to place a piece, and the backend will calculate the AI's next move.
Undo Move: Click the "Undo" button to revert the last move.
Restart Game: Click the "Restart" button to reset the game.
Roadmap
 Add online multiplayer mode.
 Optimize the AI algorithm for faster responses.
 Implement user login and leaderboard features.
Contribution
Contributions are welcome! Please submit a Pull Request or report an Issue.
