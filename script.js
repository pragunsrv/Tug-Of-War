let ropePosition = 50;
let scoreA = 0;
let scoreB = 0;
let timer = 60;
let timerInterval;
let specialEventInterval;
let currentPowerUp = 'none';
let difficulty = 'easy';
let multiRoundMode = false;
let gameHistory = [];
let stats = {
    totalGames: 0,
    gamesWonA: 0,
    gamesWonB: 0,
    ties: 0,
    rounds: 0
};
let leaderboard = [];
let playerStats = {
    teamA: { wins: 0, losses: 0, ties: 0 },
    teamB: { wins: 0, losses: 0, ties: 0 }
};

document.getElementById('pullA').addEventListener('click', () => {
    const pullStrengthA = parseInt(document.getElementById('pullStrengthA').value, 10);
    const effectiveStrengthA = adjustForDifficulty(pullStrengthA);
    applyPowerUps('A');
    playSound('pullSound');
    if (ropePosition > 0) {
        ropePosition -= effectiveStrengthA;
        if (ropePosition < 0) ropePosition = 0;
        updateRopePosition();
    }
});

document.getElementById('pullB').addEventListener('click', () => {
    const pullStrengthB = parseInt(document.getElementById('pullStrengthB').value, 10);
    const effectiveStrengthB = adjustForDifficulty(pullStrengthB);
    applyPowerUps('B');
    playSound('pullSound');
    if (ropePosition < 100) {
        ropePosition += effectiveStrengthB;
        if (ropePosition > 100) ropePosition = 100;
        updateRopePosition();
    }
});

document.getElementById('reset').addEventListener('click', () => {
    resetGame();
});

document.getElementById('powerUpEffects').addEventListener('change', (event) => {
    currentPowerUp = event.target.value;
});

document.getElementById('difficulty').addEventListener('change', (event) => {
    difficulty = event.target.value;
});

document.getElementById('teamAColor').addEventListener('input', (event) => {
    document.getElementById('teamA').style.backgroundColor = event.target.value;
});

document.getElementById('teamBColor').addEventListener('input', (event) => {
    document.getElementById('teamB').style.backgroundColor = event.target.value;
});

document.getElementById('multiRoundMode').addEventListener('change', (event) => {
    multiRoundMode = event.target.checked;
    resetGame();
});

document.getElementById('viewStats').addEventListener('click', () => {
    displayStats();
});

function adjustForDifficulty(strength) {
    if (difficulty === 'medium') {
        return strength * 1.5;
    } else if (difficulty === 'hard') {
        return strength * 2;
    }
    return strength;
}

function applyPowerUps(team) {
    switch (currentPowerUp) {
        case 'speed':
            if (team === 'A') ropePosition -= 5;
            else ropePosition += 5;
            break;
        case 'slow':
            if (team === 'A') ropePosition += 5;
            else ropePosition -= 5;
            break;
        case 'reverse':
            if (team === 'A') ropePosition += 10;
            else ropePosition -= 10;
            break;
        case 'double':
            if (team === 'A') ropePosition -= 10;
            else ropePosition += 10;
            break;
        case 'boost':
            if (team === 'A') ropePosition -= 15;
            else ropePosition += 15;
            break;
        case 'swap':
            ropePosition = 100 - ropePosition;
            break;
        case 'random':
            const randomShift = Math.random() < 0.5 ? -10 : 10;
            ropePosition += randomShift;
            break;
        case 'freeze':
            // Do nothing, freeze effect
            break;
        case 'halftime':
            timer += 10;
            break;
        case 'superpull':
            if (team === 'A') ropePosition -= 20;
            else ropePosition += 20;
            break;
        case 'divide':
            if (team === 'A') ropePosition -= 5;
            else ropePosition += 5;
            break;
    }
    if (ropePosition < 0) ropePosition = 0;
    if (ropePosition > 100) ropePosition = 100;
    updateRopePosition();
}

function playSound(id) {
    const sound = document.getElementById(id);
    if (sound) sound.play();
}

function updateRopePosition() {
    const rope = document.getElementById('rope');
    const progressA = document.getElementById('progressA');
    const progressB = document.getElementById('progressB');
    rope.style.left = `${ropePosition}%`;
    progressA.style.width = `${50 - ropePosition / 2}%`;
    progressB.style.width = `${50 + ropePosition / 2}%`;

    if (ropePosition === 0) {
        scoreA++;
        document.getElementById('scoreA').textContent = `Team A: ${scoreA}`;
        checkWinner();
    } else if (ropePosition === 100) {
        scoreB++;
        document.getElementById('scoreB').textContent = `Team B: ${scoreB}`;
        checkWinner();
    }
}

function checkWinner() {
    let winner = '';
    if (ropePosition === 0) {
        winner = 'Team A';
        stats.gamesWonA++;
        playerStats.teamA.wins++;
        playerStats.teamB.losses++;
    } else if (ropePosition === 100) {
        winner = 'Team B';
        stats.gamesWonB++;
        playerStats.teamB.wins++;
        playerStats.teamA.losses++;
    }

    if (winner) {
        alert(`${winner} wins!`);
        updateGameHistory(winner);
        if (multiRoundMode) {
            resetRound();
        } else {
            clearInterval(timerInterval);
            clearInterval(specialEventInterval);
        }
    }
}

function resetGame() {
    ropePosition = 50;
    scoreA = 0;
    scoreB = 0;
    timer = parseInt(document.getElementById('timerInput').value, 10);
    document.getElementById('scoreA').textContent = 'Team A: 0';
    document.getElementById('scoreB').textContent = 'Team B: 0';
    document.getElementById('timer').textContent = `Time: ${timer}`;
    updateRopePosition();
    clearInterval(timerInterval);
    clearInterval(specialEventInterval);
    startTimer();
    startSpecialEvent();
}

function resetRound() {
    ropePosition = 50;
    document.getElementById('scoreA').textContent = `Team A: ${scoreA}`;
    document.getElementById('scoreB').textContent = `Team B: ${scoreB}`;
    updateRopePosition();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = `Time: ${timer}`;
        if (timer <= 0) {
            clearInterval(timerInterval);
            if (ropePosition < 50) {
                scoreA++;
                updateGameHistory('Team A');
                playerStats.teamA.wins++;
                playerStats.teamB.losses++;
            } else if (ropePosition > 50) {
                scoreB++;
                updateGameHistory('Team B');
                playerStats.teamB.wins++;
                playerStats.teamA.losses++;
            } else {
                updateGameHistory('Tie');
                stats.ties++;
                playerStats.teamA.ties++;
                playerStats.teamB.ties++;
            }
            checkWinner();
        }
    }, 1000);
}

function startSpecialEvent() {
    specialEventInterval = setInterval(() => {
        const randomShift = Math.random() < 0.5 ? -10 : 10;
        ropePosition += randomShift;
        if (ropePosition < 0) ropePosition = 0;
        if (ropePosition > 100) ropePosition = 100;
        updateRopePosition();
    }, 30000);
}

function updateGameHistory(winner) {
    const teamAName = document.getElementById('teamAName').value || 'Team A';
    const teamBName = document.getElementById('teamBName').value || 'Team B';
    const entry = `${teamAName} vs ${teamBName}: ${winner} wins!`;
    gameHistory.push(entry);
    const historyList = document.getElementById('gameHistory');
    const listItem = document.createElement('li');
    listItem.textContent = entry;
    historyList.appendChild(listItem);
    stats.totalGames++;
    updateStats();
}

function updateStats() {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <p>Total Games: ${stats.totalGames}</p>
        <p>Games Won by Team A: ${stats.gamesWonA}</p>
        <p>Games Won by Team B: ${stats.gamesWonB}</p>
        <p>Ties: ${stats.ties}</p>
        <p>Rounds: ${stats.rounds}</p>
    `;
}

function displayStats() {
    updateStats();
    const playerStatsDiv = document.getElementById('playerStats');
    playerStatsDiv.innerHTML = `
        <p>Team A Wins: ${playerStats.teamA.wins}</p>
        <p>Team A Losses: ${playerStats.teamA.losses}</p>
        <p>Team A Ties: ${playerStats.teamA.ties}</p>
        <p>Team B Wins: ${playerStats.teamB.wins}</p>
        <p>Team B Losses: ${playerStats.teamB.losses}</p>
        <p>Team B Ties: ${playerStats.teamB.ties}</p>
    `;
}
