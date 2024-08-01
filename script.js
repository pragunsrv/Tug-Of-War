let ropePosition = 50; // 50 is the center
let scoreA = 0;
let scoreB = 0;
let timer = 60;
let timerInterval;
let gameHistory = [];
let currentPowerUp = 'none';
let difficulty = 'easy';
let stats = {
    totalGames: 0,
    gamesWonA: 0,
    gamesWonB: 0,
    ties: 0,
    rounds: 0
};
let leaderboard = [];
let multiRoundMode = false;

document.getElementById('pullA').addEventListener('click', () => {
    const pullStrengthA = parseInt(document.getElementById('pullStrengthA').value, 10);
    const effectiveStrengthA = adjustForDifficulty(pullStrengthA);
    if (ropePosition > 0) {
        ropePosition -= effectiveStrengthA;
        if (ropePosition < 0) ropePosition = 0;
        updateRopePosition();
    }
});

document.getElementById('pullB').addEventListener('click', () => {
    const pullStrengthB = parseInt(document.getElementById('pullStrengthB').value, 10);
    const effectiveStrengthB = adjustForDifficulty(pullStrengthB);
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

function adjustForDifficulty(strength) {
    if (difficulty === 'medium') {
        return strength * 1.5;
    } else if (difficulty === 'hard') {
        return strength * 2;
    }
    return strength;
}

function updateRopePosition() {
    const progressA = document.getElementById('progressA');
    const progressB = document.getElementById('progressB');
    const rope = document.getElementById('rope');

    const progressWidth = (ropePosition / 100) * 100;
    progressA.style.width = `${progressWidth}%`;
    progressB.style.width = `${100 - progressWidth}%`;
    rope.style.left = `${progressWidth}%`;

    if (ropePosition === 0) {
        declareWinner('B');
    } else if (ropePosition === 100) {
        declareWinner('A');
    }
}

function startTimer() {
    timer = parseInt(document.getElementById('timerInput').value, 10);
    document.getElementById('timer').textContent = `Time: ${timer}`;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer').textContent = `Time: ${timer}`;
        if (timer <= 0) {
            clearInterval(timerInterval);
            declareTimeout();
        }
    }, 1000);
}

function declareTimeout() {
    if (ropePosition === 0) {
        alert('Team A Wins by default due to timeout!');
        scoreA++;
        addGameToHistory('Team A Wins by default due to timeout!');
        document.getElementById('teamA').classList.add('winner');
        document.getElementById('teamB').classList.add('loser');
    } else if (ropePosition === 100) {
        alert('Team B Wins by default due to timeout!');
        scoreB++;
        addGameToHistory('Team B Wins by default due to timeout!');
        document.getElementById('teamB').classList.add('winner');
        document.getElementById('teamA').classList.add('loser');
    } else {
        declareTie();
    }
    updateScores();
    updateLeaderboard();
    resetGame();
}

function declareWinner(team) {
    const teamAName = document.getElementById('teamAName').value || 'Team A';
    const teamBName = document.getElementById('teamBName').value || 'Team B';

    if (team === 'A') {
        alert(`${teamAName} Wins!`);
        scoreA++;
        stats.gamesWonA++;
        addGameToHistory(`${teamAName} Wins!`);
        document.getElementById('teamA').classList.add('winner');
        document.getElementById('teamB').classList.add('loser');
    } else {
        alert(`${teamBName} Wins!`);
        scoreB++;
        stats.gamesWonB++;
        addGameToHistory(`${teamBName} Wins!`);
        document.getElementById('teamB').classList.add('winner');
        document.getElementById('teamA').classList.add('loser');
    }
    updateScores();
    updateLeaderboard();
    resetGame();
}

function declareTie() {
    alert('It\'s a Tie!');
    stats.ties++;
    addGameToHistory('It\'s a Tie!');
    updateLeaderboard();
    resetGame();
}

function updateScores() {
    document.getElementById('scoreA').textContent = `Team A: ${scoreA}`;
    document.getElementById('scoreB').textContent = `Team B: ${scoreB}`;
}

function resetGame() {
    ropePosition = 50;
    updateRopePosition();
    startTimer();
    document.getElementById('teamA').classList.remove('winner', 'loser');
    document.getElementById('teamB').classList.remove('winner', 'loser');
    if (multiRoundMode) {
        stats.rounds++;
    }
}

function addGameToHistory(result) {
    const historyList = document.getElementById('gameHistory');
    const listItem = document.createElement('li');
    listItem.textContent = result;
    historyList.appendChild(listItem);
    gameHistory.push(result);
    stats.totalGames++;
}

function triggerPowerUp() {
    const powerUp = document.getElementById('powerUp');
    powerUp.classList.remove('hidden');
    setTimeout(() => {
        powerUp.classList.add('hidden');
    }, 1000);

    if (currentPowerUp === 'speed') {
        ropePosition += 20;
        if (ropePosition > 100) ropePosition = 100;
    } else if (currentPowerUp === 'slow') {
        ropePosition -= 20;
        if (ropePosition < 0) ropePosition = 0;
    } else if (currentPowerUp === 'reverse') {
        ropePosition = 100 - ropePosition;
    } else if (currentPowerUp === 'double') {
        ropePosition += 10; // Extra pull
        if (ropePosition > 100) ropePosition = 100;
    } else if (currentPowerUp === 'boost') {
        ropePosition += 30; // Boosted pull
        if (ropePosition > 100) ropePosition = 100;
    } else if (currentPowerUp === 'swap') {
        const temp = document.getElementById('pullStrengthA').value;
        document.getElementById('pullStrengthA').value = document.getElementById('pullStrengthB').value;
        document.getElementById('pullStrengthB').value = temp;
    }

    updateRopePosition();
}

setInterval(triggerPowerUp, 10000);

function displayStats() {
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
        <p>Total Games: ${stats.totalGames}</p>
        <p>Games Won by Team A: ${stats.gamesWonA}</p>
        <p>Games Won by Team B: ${stats.gamesWonB}</p>
        <p>Ties: ${stats.ties}</p>
        <p>Total Rounds: ${stats.rounds}</p>
    `;
}

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = '';

    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

    sortedLeaderboard.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.team} - ${entry.score} points`;
        leaderboardList.appendChild(listItem);
    });
}

document.getElementById('teamAName').addEventListener('input', displayStats);
document.getElementById('teamBName').addEventListener('input', displayStats);

resetGame();
displayStats();
