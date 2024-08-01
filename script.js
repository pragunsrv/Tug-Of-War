let ropePosition = 50; // 50 is the center
let scoreA = 0;
let scoreB = 0;
let timer = 60;
let timerInterval;
let gameHistory = [];

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
    timerInterval = setInterval(() => {
        if (timer > 0) {
            timer--;
            document.getElementById('timer').textContent = `Time: ${timer}`;
        } else {
            clearInterval(timerInterval);
            determineWinner();
        }
    }, 1000);
}

function determineWinner() {
    if (ropePosition < 50) {
        declareWinner('A');
    } else if (ropePosition > 50) {
        declareWinner('B');
    } else {
        declareTie();
    }
}

function declareWinner(winner) {
    const teamA = document.getElementById('teamA');
    const teamB = document.getElementById('teamB');
    const teamAName = document.getElementById('teamAName').value;
    const teamBName = document.getElementById('teamBName').value;

    if (winner === 'A') {
        alert(`${teamAName} Wins!`);
        scoreA++;
        addGameToHistory(`${teamAName} Wins!`);
        teamA.classList.add('winner');
        teamB.classList.add('loser');
    } else {
        alert(`${teamBName} Wins!`);
        scoreB++;
        addGameToHistory(`${teamBName} Wins!`);
        teamB.classList.add('winner');
        teamA.classList.add('loser');
    }

    document.getElementById('scoreA').textContent = `${teamAName}: ${scoreA}`;
    document.getElementById('scoreB').textContent = `${teamBName}: ${scoreB}`;
    setTimeout(resetGame, 2000);
}

function declareTie() {
    alert('It\'s a tie!');
    addGameToHistory('It\'s a tie!');
    setTimeout(resetGame, 2000);
}

function resetGame() {
    ropePosition = 50;
    clearInterval(timerInterval);
    startTimer();
    updateRopePosition();
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

    const randomEffect = Math.random() > 0.5 ? 'A' : 'B';
    if (randomEffect === 'A') {
        ropePosition -= 10;
        if (ropePosition < 0) ropePosition = 0;
    } else {
        ropePosition += 10;
        if (ropePosition > 100) ropePosition = 100;
    }
    updateRopePosition();
}

setInterval(triggerPowerUp, 10000);

resetGame();
