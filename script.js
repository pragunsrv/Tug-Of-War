let ropePosition = 50; // 50 is the center
let scoreA = 0;
let scoreB = 0;

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

function resetGame() {
    ropePosition = 50;
    updateRopePosition();
}
