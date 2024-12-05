import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Update with your server URL

const App = () => {
    const [playerName, setPlayerName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [board, setBoard] = useState(Array(10).fill(Array(10).fill('')));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [winner, setWinner] = useState(null);
    const [players, setPlayers] = useState([]);
    const [playerSymbol, setPlayerSymbol] = useState('');
    const [showJoinRoom, setShowJoinRoom] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [createdRoomId, setCreatedRoomId] = useState('');

    useEffect(() => {
        const gameStateHandler = (state) => {
            setBoard(state.board);
            setCurrentPlayer(state.currentPlayer);
            setScores(state.scores);
            setWinner(state.winner);
            setPlayers(state.players);
            setPlayerSymbol(state.playerSymbols[playerName] || '');
            setShowJoinRoom(false); // Set showJoinRoom to false upon receiving gameState
        };

        socket.on('gameState', gameStateHandler);

        socket.on('roomCreated', (newRoomId) => {
            setCreatedRoomId(newRoomId);
            setRoomId(newRoomId); // Set roomId when room is created
            setShowJoinRoom(false); // Set showJoinRoom to false upon room creation
        });

        socket.on('invalidPassword', () => {
            setErrorMessage('Invalid password');
        });

        socket.on('roomFull', () => {
            setErrorMessage('Room is full');
        });

        socket.on('roomNotFound', () => {
            setErrorMessage('Room not found');
        });

        socket.on('usernameExists', () => {
            setErrorMessage('Username already exists');
        });

        socket.on('invalidName', () => {
            setErrorMessage('Username must be at least 3 characters long');
        });

        return () => {
            socket.off('gameState', gameStateHandler);
            socket.off('invalidPassword');
            socket.off('roomFull');
            socket.off('roomNotFound');
            socket.off('usernameExists');
            socket.off('invalidName');
            socket.off('roomCreated');
        };
    }, [playerName, roomId]); // Add roomId to dependency array

    const handleCreateRoom = () => {
        if (playerName.length < 3) {
            setErrorMessage('Username must be at least 3 characters long');
            return;
        }
        socket.emit('createRoom', playerName, password);
    };

    const handleJoinRoom = () => {
        if (playerName.length < 3) {
            setErrorMessage('Username must be at least 3 characters long');
            return;
        }
        if (!roomId) {
            setErrorMessage('Room ID is required');
            return;
        }
        socket.emit('joinRoom', roomId, playerName, password);
    };

    const handleClick = (row, col) => {
        if (playerSymbol === currentPlayer) {
            socket.emit('makeMove', roomId, playerName, row, col);
        }
    };

    const resetGame = () => {
        socket.emit('resetGame', roomId);
    };

    return (
        <div className="App">
            {showJoinRoom ? (
                <div>
                    <h1>Join or Create a Room</h1>
                    <div>
                        <h2>Join a Room</h2>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Enter room password (optional)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleJoinRoom}>Join Room</button>
                    </div>
                    <div>
                        <h2>Create a Room</h2>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Enter room password (optional)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleCreateRoom}>Create Room</button>
                        {createdRoomId && <p>Room ID: {createdRoomId}</p>}
                    </div>
                    {errorMessage && <p>{errorMessage}</p>}
                </div>
            ) : (
                <div>
                    <h1>10x10 Tic-Tac-Toe</h1>
                    <p>Room ID: {roomId}</p> {/* Use roomId for display */}
                    {winner ? (
                        <div>
                            {winner === 'draw' ? <h2>It's a draw!</h2> : <h2>Player {winner} wins!</h2>}
                            <button onClick={resetGame}>Play Again</button>
                        </div>
                    ) : (
                        <div>
                            <h2>Current Player: {currentPlayer}</h2>
                            <h3>Scores: X - {scores.X}, O - {scores.O}</h3>
                            {players.length === 2 && (
                                <div>
                                    <p>{players[0]} is playing as X</p>
                                    <p>{players[1]} is playing as O</p>
                                </div>
                            )}
                            <div className="board">
                                {board.map((row, rowIndex) => (
                                    <div key={rowIndex} className="row">
                                        {row.map((cell, colIndex) => (
                                            <button
                                                key={colIndex}
                                                className="cell"
                                                onClick={() => handleClick(rowIndex, colIndex)}
                                            >
                                                {cell}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;