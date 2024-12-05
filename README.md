# 10x10 Tic-Tac-Toe Game

A real-time multiplayer 10x10 Tic-Tac-Toe game built with Node.js, Express, Socket.IO, and React.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Description

This project is a multiplayer Tic-Tac-Toe game that allows two players to play against each other in real-time on a 10x10 grid. Players can create a room with an optional password or join an existing room using the room ID and password (if set). The game detects wins and draws and keeps track of scores.

## Features

- Real-time multiplayer gameplay.
- Create a room with an optional password.
- Join a room using the room ID and password (if set).
- 10x10 game board for extended gameplay.
- Score tracking for players.
- Win detection for Tic-Tac-Toe patterns on the 10x10 grid.

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - Socket.IO
  - CORS
  - UUID

- **Frontend:**
  - React.js

## Installation

### Server

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/10x10-tic-tac-toe.git
   ```
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Client

1. Navigate to the client directory:
   ```bash
   cd ..
   ```
2. Clone the client repository if separate:
   ```bash
   git clone https://github.com/yourusername/10x10-tic-tac-toe-client.git
   ```
3. Navigate to the client directory:
   ```bash
   cd 10x10-tic-tac-toe-client
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the client:
   ```bash
   npm start
   ```

## How to Play

1. **Create a Room:**
    - Enter your player name (minimum 3 characters).
    - Optionally set a password for the room.
    - Click "Create Room" to generate a room ID.
    - Share the room ID (and password, if set) with your opponent.

2. **Join a Room:**
    - Enter your player name (minimum 3 characters).
    - Enter the room ID provided by the room creator.
    - If the room has a password, enter it.
    - Click "Join Room" to enter the game.

3. **Gameplay:**
    - Players take turns clicking on the grid cells to place their symbol ('X' or 'O').
    - The game detects winning patterns of Tic-Tac-Toe on the 10x10 grid.
    - The first player to reach 4 points wins the game.
    - If all cells are filled without a winner, the game is a draw.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute, including our code of conduct.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

- **GitHub:** [ZYRACX](https://github.com/ZYRACX)

```

**Note:** Replace `yourusername`, `your.email@example.com`, and links with your actual information.