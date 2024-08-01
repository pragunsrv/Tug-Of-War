let ropePosition = 50; // 50 is the center

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
    } else if (ropePosition === 100) {
        alert('Team B Wins!');
    }
}
