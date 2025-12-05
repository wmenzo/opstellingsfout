
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [players, setPlayers] = useState([
        { id: 1, name: 'Spelverdeler', x: 200, y: 100, hasError: false, position: 'RA' },
        { id: 2, name: 'Buiten', x: 150, y: 100, hasError: false, position: 'RV' },
        { id: 3, name: 'Midden', x: 100, y: 100, hasError: false, position: 'MV' },
        { id: 4, name: 'Diagonaal', x: 100, y: 200, hasError: false, position: 'LV' },
        { id: 5, name: 'Buiten', x: 150, y: 200, hasError: false, position: 'LA' },
        { id: 6, name: 'Midden', x: 200, y: 200, hasError: false, position: 'MA' }
    ]);

    const [draggedPlayer, setDraggedPlayer] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [currentFormationIndex, setCurrentFormationIndex] = useState(0);

    const courtDimensions = { width: 350, height: 300 };
    const netY = courtDimensions.height / 3; // Y-coordinaat van het net

    // Definieer verschillende opstellingen
    const formations = [
        // Opstelling 1: Standaard 4-2
        [
            { id: 1, name: 'Spelverdeler', x: 335, y: 175, hasError: false , position: 'RA' },   // rechts-voor
            { id: 2, name: 'Buiten', x: 280, y: 130, hasError: false, position: 'RV' },   // midden-voor
            { id: 3, name: 'Midden', x: 175, y: 60, hasError: false, position: 'MV' },   // links-voor
            { id: 4, name: 'Diagonaal', x: 50, y: 170, hasError: false, position: 'LV' },  // links-achter
            { id: 5, name: 'Buiten', x: 125, y: 220, hasError: false, position: 'LA' },  // midden-achter
            { id: 6, name: 'Midden', x: 210, y: 220, hasError: false, position: 'MA' }   // rechts-achter
        ],
        // Opstelling 2: 5-1 formatie
        [
            { id: 1, name: 'Spelverdeler', x: 200, y: 80, hasError: false, position: 'MA' },   // rechts-voor
            { id: 2, name: 'Buiten', x: 210, y: 220, hasError: false, position: 'RA' },   // midden-voor
            { id: 3, name: 'Midden', x: 300, y: 180, hasError: false, position: 'RV' },   // links-voor
            { id: 4, name: 'Diagonaal', x: 280, y: 60, hasError: false, position: 'MV' },   // links-achter
            { id: 5, name: 'Buiten', x: 50, y: 170, hasError: false, position: 'LV' },  // midden-achter (setter)
            { id: 6, name: 'Midden', x: 125, y: 220, hasError: false, position: 'LA' }   // rechts-achter
        ],
        // Opstelling 3: 6-2 formatie
        [
            { id: 1, name: 'Spelverdeler', x: 70, y: 80, hasError: false, position: 'LA' },   // rechts-voor
            { id: 2, name: 'Buiten', x: 140, y: 220, hasError: false, position: 'MA' },   // midden-voor (setter)
            { id: 3, name: 'Midden', x: 220, y: 220, hasError: false, position: 'RA' },   // links-voor
            { id: 4, name: 'Diagonaal', x: 300, y: 170, hasError: false, position: 'RV' },  // links-achter
            { id: 5, name: 'Buiten', x: 70, y: 170, hasError: false, position: 'MV' },  // midden-achter (setter)
            { id: 6, name: 'Midden', x: 40, y: 50, hasError: false, position: 'LV' }   // rechts-achter
        ],
        // Opstelling 4: Aanvallende formatie
        [
            { id: 1, name: 'Spelverdeler', x: 40, y: 50, hasError: false, position: 'LV' },   // rechts-voor (aanvaller)
            { id: 2, name: 'Buiten', x: 140, y: 220, hasError: false, position: 'LA' },   // midden-voor (snelle aanval)
            { id: 3, name: 'Midden', x: 220, y: 220, hasError: false, position: 'MA' },    // links-voor (aanvaller)
            { id: 4, name: 'Diagonaal', x: 300, y: 180, hasError: false, position: 'RA' },  // links-achter
            { id: 5, name: 'Buiten', x: 70, y: 170, hasError: false, position: 'RV' },  // midden-achter (libero pos)
            { id: 6, name: 'Midden', x: 60, y: 80, hasError: false, position: 'MV' }   // rechts-achter
        ],
        // Opstelling 5: Verdedigende formatie
        [
            { id: 1, name: 'Spelverdeler', x: 240, y: 50, hasError: false, position: 'MV' },  // rechts-voor
            { id: 2, name: 'Buiten', x: 70, y: 170, hasError: false, position: 'LV' },   // midden-voor
            { id: 3, name: 'Midden', x: 140, y: 220, hasError: false, position: 'LA' },  // links-voor
            { id: 4, name: 'Diagonaal', x: 220, y: 220, hasError: false, position: 'MA' },   // links-achter (diep)
            { id: 5, name: 'Buiten', x: 300, y: 200, hasError: false, position: 'RA' },  // midden-achter
            { id: 6, name: 'Midden', x: 300, y: 100, hasError: false, position: 'RV' }   // rechts-achter (diep)
        ],
        // Opstelling 6: Rotatie compleet
        [
            { id: 1, name: 'Spelverdeler', x: 240, y: 50, hasError: false, position: 'RV' },  // naar achter
            { id: 2, name: 'Buiten', x: 70, y: 170, hasError: false, position: 'MV' },  // naar rechts-achter
            { id: 3, name: 'Midden', x: 40, y: 50, hasError: false, position: 'LV' },   // naar rechts-voor
            { id: 4, name: 'Diagonaal', x: 140, y: 220, hasError: false, position: 'LA' },   // naar midden-voor
            { id: 5, name: 'Buiten', x: 220, y: 220, hasError: false, position: 'MA' },   // naar links-voor
            { id: 6, name: 'Midden', x: 300, y: 200, hasError: false, position: 'RA' }   // naar links-achter
        ]
    ];

    // Function to get the player at a specific position
    const getPlayerAtPosition = (positionKey, currentPlayers = players) => {
        let playerOnPosition = null;
        currentPlayers.forEach(player => {

            // console.log('3' + player.position + ' ' + positionKey)
            if (player.position === positionKey) {
                // console.log('4' + player.name + ' ' + positionKey)
                playerOnPosition = player;
            }
        });

        return playerOnPosition;
    };


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

        currentPlayers.forEach(player => {
            console.log(player.name + ' ' + player.position);

            if (player.position === 'RA') {
                // console.log('0: ' + player.name)

                let rightFront = getPlayerAtPosition('RV', currentPlayers);
                let midAchter = getPlayerAtPosition('MA', currentPlayers);

                // console.log('1: ' + rightFront.name + ' ry ' + rightFront.y + '###### 2'  + player.name +  ' ly' + player.y)
                // console.log('1: ' + midAchter.name + ' rx ' + midAchter.x + '###### 2'  + player.name +  ' lx' + player.x)

                if (rightFront.y  >  player.y + 50) {
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

                if (midAchter.x  >  player.x + 50) {
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }
            }

            if (player.position === 'RV') {
                // console.log('0: ' + player.name)

                let rightBack = getPlayerAtPosition('RA', currentPlayers);
                let midVoor = getPlayerAtPosition('MV', currentPlayers);

                // console.log('5: ' + rightBack.name + rightBack.id + ' ry ' + rightBack.y + '###### 2'  + player.name + player.id  +  ' ly' + player.y)
                // console.log('5: ' + midVoor.name + midVoor.id + ' rx ' + midVoor.x + '###### 2'  + player.name + player.id +  ' lx' + player.x)

                if (rightBack.y  <  player.y -50 ) {
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

                if (midVoor.x  >  player.x + 50) {
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }
            }

            if (player.position === 'MV') {
                // console.log('0: ' + player.name)

                let rightFront = getPlayerAtPosition('RV', currentPlayers);
                let leftFront = getPlayerAtPosition('LV', currentPlayers);
                let midAchter = getPlayerAtPosition('MA', currentPlayers);
                //
                // console.log('5: ' + rightFront.name + rightFront.id + ' rx ' + rightFront.x + '###### 2'  + player.name + player.id  +  ' ly' + player.x)
                // console.log('5: ' + leftFront.name + leftFront.id + ' rx ' + leftFront.x + '###### 2'  + player.name + player.id +  ' lx' + player.x)
                // console.log('5: ' + midAchter.name + midAchter.id + ' ry ' + midAchter.y + '###### 2'  + player.name + player.id +  ' ly' + player.y)

                if (rightFront.x + 50  <  player.x) {
                    console.log('x')
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

                if (leftFront.x  >  player.x + 50) {
                    console.log('y')
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

                if (midAchter.y  <  player.y - 50 ) {
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

            }

            if (player.position === 'LV') {
                // console.log('0: ' + player.name)

                let leftBack = getPlayerAtPosition('LA', currentPlayers);
                let midVoor = getPlayerAtPosition('MV', currentPlayers);

                // console.log('5: ' + leftBack.name + leftBack.id + ' ry ' + leftBack.y + '###### 2'  + player.name + player.id  +  ' ly' + player.y)
                // console.log('5: ' + midVoor.name + midVoor.id + ' rx ' + midVoor.x + '###### 2'  + player.name + player.id +  ' lx' + player.x)

                if (leftBack.y + 50 <  player.y  ) {
                    console.log('y')

                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

                if (midVoor.x + 50 < player.x ) {
                    console.log('z')

                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }
            }

            if (player.position === 'LA') {
                // console.log('0: ' + player.name)

                let leftFront = getPlayerAtPosition('LV', currentPlayers);
                let midBack = getPlayerAtPosition('MA', currentPlayers);

                // console.log('5: ' + leftFront.name + leftFront.id + ' ry ' + leftFront.y + '###### 2'  + player.name + player.id  +  ' ly' + player.y)
                // console.log('5: ' + midBack.name + midBack.id + ' rx ' + midBack.x + '###### 2'  + player.name + player.id +  ' lx' + player.x)

                if (leftFront.y > player.y + 50) {
                    // console.log('r')

                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

                if (midBack.x + 50 < player.x ) {
                    // console.log('t')

                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }
            }

            if (player.position === 'MA') {
                // console.log('0: ' + player.name)

                let rightBack = getPlayerAtPosition('RA', currentPlayers);
                let leftBack = getPlayerAtPosition('LA', currentPlayers);
                let midFront = getPlayerAtPosition('MV', currentPlayers);

                // console.log('6: ' + rightBack.name + rightBack.id + ' rx ' + rightBack.x + '###### 2'  + player.name + player.id  +  ' lx' + player.x)
                // console.log('6: ' + leftBack.name + leftBack.id + ' rx ' + leftBack.x + '###### 2'  + player.name + player.id +  ' lx' + player.x)
                // console.log('6: ' + midFront.name + midFront.id + ' ry ' + midFront.y + '###### 2'  + player.name + player.id +  ' ly' + player.y)

                if (rightBack.x + 50  <  player.x) {
                    // console.log('s')
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

                if (leftBack.x  >  player.x + 50) {
                    // console.log('t')
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }

                if (midFront.y  >  player.y + 50 ) {
                    // console.log('u')
                    const playerIndex = updatedPlayers.findIndex(p => p.id === player.id);
                    updatedPlayers[playerIndex].hasError = true;
                }
            }

        });

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
                    <strong>5-1 opstelling:</strong> {
                    ['Rotatie 1', 'Rotatie 2', 'Rotatie 3', 'Rotatie 4', 'Rotatie 5', 'Rotatie 6'][currentFormationIndex]
                }
                </div>
            </div>

            <div
                className="volleyball-court"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* 3Meter */}
                <div className="meter3" style={{ top: netY }}></div>

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
                    <li><strong>Spelers</strong> staan pas fout wanneer ze voorbij de speler komen waarmee ze vakfout kunnen staan</li>
                    <li><strong>Rode spelers</strong> = opstellingsfout</li>
                </ul>
            </div>
        </div>
    );
};

export default App;
