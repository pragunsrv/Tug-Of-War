let ropePosition = 50; // 50 is the center
let scoreA = 0;
let scoreB = 0;
let timer = 60;
let timerInterval;

document.getElementById('pullA').addEventListener('click', () => {
    if (ropePosition > 0) {
        ropePosition--;
        updateRopePosition();
    }
});

document.getElementById('pullB').addEventListener('click', () => {
    if (ropePosition < 100) {
        ropePosition++;
        updateRopePosition();
    }
});

document.getElementById('reset').addEventListener('click', resetGame);

function updateRopePosition() {
    const rope = document.getElementById('rope');
    rope.style.marginLeft = `${ropePosition}%`;

    if (ropePosition === 0) {
        alert('Team A Wins!');
        scoreA++;
        resetGame();
    } else if (ropePosition === 100) {
        alert('Team B Wins!');
        scoreB++;
        resetGame();
    }

    document.getElementById('scoreA').textContent = `Team A: ${scoreA}`;
    document.getElementById('scoreB').textContent = `Team B: ${scoreB}`;
}

function startTimer() {
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
        alert('Team A Wins!');
        scoreA++;
    } else if (ropePosition > 50) {
        alert('Team B Wins!');
        scoreB++;
    } else {
        alert('It\'s a tie!');
    }
    resetGame();
}

function resetGame() {
    ropePosition = 50;
    timer = 60;
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = `Time: ${timer}`;
    updateRopePosition();
    startTimer();
}

window.onload = startTimer;
