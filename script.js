let ropePosition = 50; // 50 is the center
let scoreA = 0;
let scoreB = 0;
let timer = 60;
let timerInterval;

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
        alert(`${document.getElementById('teamAName').value} Wins!`);
        scoreA++;
        resetGame();
    } else if (ropePosition === 100) {
        alert(`${document.getElementById('teamBName').value} Wins!`);
        scoreB++;
        resetGame();
    }

    document.getElementById('scoreA').textContent = `${document.getElementById('teamAName').value}: ${scoreA}`;
    document.getElementById('scoreB').textContent = `${document.getElementById('teamBName').value}: ${scoreB}`;
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
        alert(`${document.getElementById('teamAName').value} Wins!`);
        scoreA++;
    } else if (ropePosition > 50) {
        alert(`${document.getElementById('teamBName').value} Wins!`);
        scoreB++;
    } else {
        alert('It\'s a tie!');
    }
    resetGame();
}

function resetGame() {
    ropePosition = 50;
    clearInterval(timerInterval);
    startTimer();
    updateRopePosition();
}

window.onload = startTimer;
