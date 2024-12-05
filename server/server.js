const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your frontend URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createRoom', (playerName, password) => {
    if (!playerName || playerName.length < 3) {
      socket.emit('invalidName');
      return;
    }

    const roomId = uuidv4();
    rooms[roomId] = {
      board: Array(10).fill(Array(10).fill('')),
      currentPlayer: 'X',
      scores: { X: 0, O: 0 },
      winner: null,
      players: [playerName],
      playerSymbols: { [playerName]: 'X' },
      password: password || null
    };

    socket.join(roomId);
    socket.playerName = playerName;
    socket.roomId = roomId; // Assign roomId to socket
    io.to(roomId).emit('gameState', rooms[roomId]);
    socket.emit('roomCreated', roomId);
  });

  socket.on('joinRoom', (roomId, playerName, password) => {
    if (!roomId) {
      socket.emit('roomNotFound');
      return;
    }
    if (!playerName || playerName.length < 3) {
      socket.emit('invalidName');
      return;
    }

    if (!rooms[roomId]) {
      socket.emit('roomNotFound');
      return;
    }

    if (rooms[roomId].password && rooms[roomId].password !== password) {
      socket.emit('invalidPassword');
      return;
    }

    if (rooms[roomId].players.includes(playerName)) {
      socket.emit('usernameExists');
      return;
    }

    if (rooms[roomId].players.length < 2) {
      rooms[roomId].players.push(playerName);
      rooms[roomId].playerSymbols[playerName] = rooms[roomId].players.length === 1 ? 'X' : 'O';
      socket.join(roomId);
      socket.playerName = playerName;
      socket.roomId = roomId; // Assign roomId to socket
      io.to(roomId).emit('gameState', rooms[roomId]);
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('makeMove', (roomId, playerName, row, col) => {
    const room = rooms[roomId];
    if (!room || room.winner || room.board[row][col] || room.playerSymbols[playerName] !== room.currentPlayer) return;

    const newBoard = room.board.map(row => row.slice());
    newBoard[row][col] = room.currentPlayer;
    room.board = newBoard;

    const points = checkWinner(room, row, col);
    if (points > 0) {
      room.scores[room.currentPlayer] += points;
      if (room.scores[room.currentPlayer] >= 4) {
        room.winner = room.currentPlayer;
      }
    } else if (checkDraw(room.board)) {
      room.winner = 'draw';
    } else {
      room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
    }

    io.to(roomId).emit('gameState', room);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (socket.roomId) {
      const room = rooms[socket.roomId];
      if (room) {
        const playerIndex = room.players.indexOf(socket.playerName);
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          delete room.playerSymbols[socket.playerName];
          if (room.players.length === 1) {
            room.winner = room.players[0];
            io.to(socket.roomId).emit('gameState', room);
          }
        }
      }
    }
  });
});

const checkWinner = (room, row, col) => {
  const directions = [
    { dx: 0, dy: 1 },  // horizontal
    { dx: 1, dy: 0 },  // vertical
    { dx: 1, dy: 1 },  // diagonal down-right
    { dx: 1, dy: -1 }  // diagonal down-left
  ];

  let totalPoints = 0;

  for (const { dx, dy } of directions) {
    let count = 1;
    for (let k = 1; k < 4; k++) {
      const x = row + k * dx;
      const y = col + k * dy;
      if (x >= 0 && x < 10 && y >= 0 && y < 10 && room.board[x][y] === room.currentPlayer) {
        count++;
      } else {
        break;
      }
    }
    for (let k = 1; k < 4; k++) {
      const x = row - k * dx;
      const y = col - k * dy;
      if (x >= 0 && x < 10 && y >= 0 && y < 10 && room.board[x][y] === room.currentPlayer) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 4) totalPoints++;
  }
  return totalPoints;
};

const checkDraw = (board) => {
  return board.every(row => row.every(cell => cell !== ''));
};

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));