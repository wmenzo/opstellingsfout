
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [players, setPlayers] = useState([
        { id: 1, name: 'Spelverdeler', x: 200, y: 100, hasError: false },
        { id: 2, name: 'Buiten', x: 150, y: 100, hasError: false },
        { id: 3, name: 'Midden', x: 100, y: 100, hasError: false },
        { id: 4, name: 'Diagonaal', x: 100, y: 200, hasError: false },
        { id: 5, name: 'Buiten', x: 150, y: 200, hasError: false },
        { id: 6, name: 'Midden', x: 200, y: 200, hasError: false }
    ]);

    const [draggedPlayer, setDraggedPlayer] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [currentFormationIndex, setCurrentFormationIndex] = useState(0);

    const courtDimensions = { width: 350, height: 300 };
    const netY = courtDimensions.height / 2; // Y-coordinaat van het net

    // Definieer verschillende opstellingen
    const formations = [
        // Opstelling 1: Standaard 4-2
        [
            { id: 1, name: 'Spelverdeler', x: 335, y: 175, hasError: false },   // rechts-voor
            { id: 2, name: 'Buiten', x: 280, y: 130, hasError: false },   // midden-voor
            { id: 3, name: 'Midden', x: 175, y: 60, hasError: false },   // links-voor
            { id: 4, name: 'Diagonaal', x: 50, y: 170, hasError: false },  // links-achter
            { id: 5, name: 'Buiten', x: 125, y: 220, hasError: false },  // midden-achter
            { id: 6, name: 'Midden', x: 210, y: 220, hasError: false }   // rechts-achter
        ],
        // Opstelling 2: 5-1 formatie
        [
            { id: 1, name: 'Spelverdeler', x: 200, y: 80, hasError: false },   // rechts-voor
            { id: 2, name: 'Buiten', x: 210, y: 220, hasError: false },   // midden-voor
            { id: 3, name: 'Midden', x: 300, y: 180, hasError: false },   // links-voor
            { id: 4, name: 'Diagonaal', x: 280, y: 60, hasError: false },   // links-achter
            { id: 5, name: 'Buiten', x: 50, y: 170, hasError: false },  // midden-achter (setter)
            { id: 6, name: 'Midden', x: 125, y: 220, hasError: false }   // rechts-achter
        ],
        // Opstelling 3: 6-2 formatie
        [
            { id: 1, name: 'Spelverdeler', x: 70, y: 80, hasError: false },   // rechts-voor
            { id: 2, name: 'Buiten', x: 140, y: 220, hasError: false },   // midden-voor (setter)
            { id: 3, name: 'Midden', x: 220, y: 220, hasError: false },   // links-voor
            { id: 4, name: 'Diagonaal', x: 300, y: 170, hasError: false },  // links-achter
            { id: 5, name: 'Buiten', x: 70, y: 170, hasError: false },  // midden-achter (setter)
            { id: 6, name: 'Midden', x: 40, y: 50, hasError: false }   // rechts-achter
        ],
        // Opstelling 4: Aanvallende formatie
        [
            { id: 1, name: 'Spelverdeler', x: 40, y: 50, hasError: false },   // rechts-voor (aanvaller)
            { id: 2, name: 'Buiten', x: 140, y: 220, hasError: false },   // midden-voor (snelle aanval)
            { id: 3, name: 'Midden', x: 220, y: 220, hasError: false },    // links-voor (aanvaller)
            { id: 4, name: 'Diagonaal', x: 300, y: 180, hasError: false },  // links-achter
            { id: 5, name: 'Buiten', x: 70, y: 170, hasError: false },  // midden-achter (libero pos)
            { id: 6, name: 'Midden', x: 60, y: 80, hasError: false }   // rechts-achter
        ],
        // Opstelling 5: Verdedigende formatie
        [
            { id: 1, name: 'Spelverdeler', x: 240, y: 50, hasError: false },  // rechts-voor
            { id: 2, name: 'Buiten', x: 70, y: 170, hasError: false },   // midden-voor
            { id: 3, name: 'Midden', x: 140, y: 220, hasError: false },  // links-voor
            { id: 4, name: 'Diagonaal', x: 220, y: 220, hasError: false },   // links-achter (diep)
            { id: 5, name: 'Buiten', x: 300, y: 200, hasError: false },  // midden-achter
            { id: 6, name: 'Midden', x: 300, y: 100, hasError: false }   // rechts-achter (diep)
        ],
        // Opstelling 6: Rotatie compleet
        [
            { id: 1, name: 'Spelverdeler', x: 240, y: 50, hasError: false },  // naar achter
            { id: 2, name: 'Buiten', x: 70, y: 170, hasError: false },  // naar rechts-achter
            { id: 3, name: 'Midden', x: 40, y: 50, hasError: false },   // naar rechts-voor
            { id: 4, name: 'Diagonaal', x: 140, y: 220, hasError: false },   // naar midden-voor
            { id: 5, name: 'Buiten', x: 220, y: 220, hasError: false },   // naar links-voor
            { id: 6, name: 'Midden', x: 300, y: 200, hasError: false }   // naar links-achter
        ]
    ];

    // Valideer opstellingsfouten op basis van posities
    const validatePositions = (currentPlayers) => {
        const updatedPlayers = currentPlayers.map(player => ({ ...player, hasError: false }));

        // Front-line spelers (boven het net)
        const frontPlayers = updatedPlayers.filter(p => p.y < netY);
        // Back-line spelers (onder het net)
        const backPlayers = updatedPlayers.filter(p => p.y >= netY);

        // Sorteer spelers van links naar rechts binnen elke lijn
        frontPlayers.sort((a, b) => a.x - b.x);
        backPlayers.sort((a, b) => a.x - b.x);

        // Controleer front/back lijn overtredingen
        frontPlayers.forEach(frontPlayer => {
            backPlayers.forEach(backPlayer => {
                // Als een front-line speler achter (onder) een back-line speler staat
                if (frontPlayer.y >= backPlayer.y) {
                    const frontIndex = updatedPlayers.findIndex(p => p.id === frontPlayer.id);
                    const backIndex = updatedPlayers.findIndex(p => p.id === backPlayer.id);
                    updatedPlayers[frontIndex].hasError = true;
                    updatedPlayers[backIndex].hasError = true;
                }
            });
        });

        // Controleer links/rechts volgorde binnen dezelfde lijn
        [frontPlayers, backPlayers].forEach((playersInLine) => {
            for (let i = 0; i < playersInLine.length - 1; i++) {
                const leftPlayer = playersInLine[i];
                const rightPlayer = playersInLine[i + 1];

                // Als spelers te dicht bij elkaar staan (overlap)
                const distance = Math.abs(leftPlayer.x - rightPlayer.x);
                if (distance < 60) { // Minimum afstand tussen spelers
                    const leftIndex = updatedPlayers.findIndex(p => p.id === leftPlayer.id);
                    const rightIndex = updatedPlayers.findIndex(p => p.id === rightPlayer.id);
                    updatedPlayers[leftIndex].hasError = true;
                    updatedPlayers[rightIndex].hasError = true;
                }
            }
        });

        // Controleer of er precies 3 spelers voor en 3 achter het net staan
        if (frontPlayers.length !== 3 || backPlayers.length !== 3) {
            updatedPlayers.forEach(player => {
                const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                updatedPlayers[playerIndex].hasError = true;
            });
        }

        return updatedPlayers;
    };

    // Update validatie wanneer spelers bewegen
    useEffect(() => {
        const validatedPlayers = validatePositions(players);
        setPlayers(validatedPlayers);
    }, []);

    // Mouse down - start slepen
    const handleMouseDown = (e, player) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const courtRect = e.currentTarget.closest('.volleyball-court').getBoundingClientRect();

        setDraggedPlayer(player);
        setDragOffset({
            x: e.clientX - courtRect.left - player.x,
            y: e.clientY - courtRect.top - player.y
        });

        e.preventDefault();
    };

    // Mouse move - tijdens slepen
    const handleMouseMove = (e) => {
        if (!draggedPlayer) return;

        const courtRect = e.currentTarget.getBoundingClientRect();
        let newX = e.clientX - courtRect.left - dragOffset.x;
        let newY = e.clientY - courtRect.top - dragOffset.y;

        // Beperk beweging binnen het veld (met speler radius)
        const playerRadius = 25;
        newX = Math.max(playerRadius, Math.min(courtDimensions.width - playerRadius, newX));
        newY = Math.max(playerRadius, Math.min(courtDimensions.height - playerRadius, newY));

        // Update speler positie
        const updatedPlayers = players.map(player =>
            player.id === draggedPlayer.id
                ? { ...player, x: newX, y: newY }
                : player
        );

        // Valideer en update
        const validatedPlayers = validatePositions(updatedPlayers);
        setPlayers(validatedPlayers);
    };

    // Mouse up - stop slepen
    const handleMouseUp = () => {
        setDraggedPlayer(null);
        setDragOffset({ x: 0, y: 0 });
    };

    // Reset naar standaard opstelling
    const resetPositions = () => {
        setCurrentFormationIndex(0);
        const validatedPlayers = validatePositions(formations[0]);
        setPlayers(validatedPlayers);
    };

    // Roteer naar volgende opstelling
    const rotatePositions = () => {
        const nextFormationIndex = (currentFormationIndex + 1) % formations.length;
        setCurrentFormationIndex(nextFormationIndex);

        const validatedPlayers = validatePositions(formations[nextFormationIndex]);
        setPlayers(validatedPlayers);
    };

    const hasAnyErrors = players.some(player => player.hasError);

    return (
        <div className="app">
            <h1>Volleybal Opstellingsfout Simulator</h1>

            <div className="controls">
                <button onClick={resetPositions}>Reset Opstelling</button>
                <button onClick={rotatePositions}>Volgende Opstelling ({currentFormationIndex + 1}/6)</button>
            </div>

            <div className="status">
                {hasAnyErrors ? (
                    <div className="error-status">❌ Opstellingsfout gedetecteerd!</div>
                ) : (
                    <div className="success-status">✅ Correcte opstelling</div>
                )}
                <div className="formation-info">
                    <strong>Huidige opstelling:</strong> {
                    ['Standaard 4-2', '5-1 Formatie', '6-2 Formatie', 'Aanvallend', 'Verdedigend', 'Rotatie'][currentFormationIndex]
                }
                </div>
            </div>

            <div
                className="volleyball-court"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Net */}
                <div className="net" style={{ top: netY }}></div>

                {/* Veld lijnen */}
                <div className="front-line-indicator">FRONT LINE</div>
                <div className="back-line-indicator">BACK LINE</div>

                {/* Spelers */}
                {players.map(player => (
                    <div
                        key={player.id}
                        className={`player ${player.hasError ? 'error' : ''} ${draggedPlayer?.id === player.id ? 'dragging' : ''}`}
                        style={{
                            left: player.x,
                            top: player.y,
                            cursor: draggedPlayer?.id === player.id ? 'grabbing' : 'grab'
                        }}
                        onMouseDown={(e) => handleMouseDown(e, player)}
                    >
                        <div className="player-circle">
                            {player.id}
                        </div>
                        <span className="player-name">{player.name}</span>
                    </div>
                ))}
            </div>

            <div className="instructions">
                <h3>Instructies:</h3>
                <ul>
                    <li><strong>Sleep spelers</strong> naar elke positie op het veld</li>
                    <li><strong>3 spelers</strong> moeten boven het net (front line)</li>
                    <li><strong>3 spelers</strong> moeten onder het net (back line)</li>
                    <li><strong>Front line spelers</strong> mogen niet achter back line spelers staan</li>
                    <li><strong>Spelers</strong> moeten voldoende afstand houden (geen overlap)</li>
                    <li><strong>Rode spelers</strong> = opstellingsfout</li>
                </ul>
            </div>
        </div>
    );
};

export default App;
