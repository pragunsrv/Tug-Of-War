let ropePosition = 50; // 50 is the center
let scoreA = 0;
let scoreB = 0;
let timer = 60;
let timerInterval;
let gameHistory = [];
let currentPowerUp = 'none';
let stats = {
    totalGames: 0,
    gamesWonA: 0,
    gamesWonB: 0,
    ties: 0
};

document.getElementById('pullA').addEventListener('click', () => {
    const pullStrengthA = parseInt(document.getElementById('pullStrengthA').value, 10);
    if (ropePosition > 0) {
        ropePosition -= pullStrengthA;
        if (ropePosition < 0) ropePosition = 0;
        updateRopePosition();
    }
});

document.getElementById('pullB').addEventListener('click', () => {
    const pullStrengthB = parseInt(document.getElementById('pullStrengthB').value, 10);
    if (ropePosition < 100) {
        ropePosition += pullStrengthB;
        if (ropePosition > 100) ropePosition = 100;
        updateRopePosition();
    }
});

document.getElementById('reset').addEventListener('click', resetGame);

document.getElementById('teamAColor').addEventListener('input', (event) => {
    document.getElementById('teamA').style.backgroundColor = event.target.value;
});

document.getElementById('teamBColor').addEventListener('input', (event) => {
    document.getElementById('teamB').style.backgroundColor = event.target.value;
});

document.getElementById('powerUpEffects').addEventListener('change', (event) => {
    currentPowerUp = event.target.value;
});

function updateRopePosition() {
    const rope = document.getElementById('rope');
    rope.style.marginLeft = `${ropePosition}%`;

    const progressA = document.getElementById('progressA');
    const progressB = document.getElementById('progressB');

    progressA.style.width = `${ropePosition}%`;
    progressB.style.width = `${100 - ropePosition}%`;

    if (ropePosition === 0) {
        declareWinner('A');
    } else if (ropePosition === 100) {
        declareWinner('B');
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
    resetGame();
}

function declareTie() {
    alert('It\'s a Tie!');
    stats.ties++;
    addGameToHistory('It\'s a Tie!');
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
}

function addGameToHistory(result) {
    const historyList = document.getElementById('gameHistory');
    const listItem = document.createElement('li');
    listItem.textContent = result;
    historyList.appendChild(listItem);
    gameHistory.push(result);
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
    `;
}

document.getElementById('teamAName').addEventListener('input', displayStats);
document.getElementById('teamBName').addEventListener('input', displayStats);

resetGame();
displayStats();
