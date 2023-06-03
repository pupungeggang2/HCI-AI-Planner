window.onload = tutorialInit;

let tutorialPage = 0;
let tutorialCanvas = document.getElementById('tutorial');
let tutorialConext = tutorialCanvas.getContext('2d');

function tutorialInit() {
    tutorialPage = 0;
    window.addEventListener('keydown', skip, false);
}

function prev() {
    if (tutorialPage > 0) {
        tutorialPage -= 1;
    }
}

function next() {
    if (tutorialPage >= 5) {
        location.href = 'dashboard.html';
    } else {
        tutorialPage += 1;
    }
}

function drawCanvas(image) {
    tutorialContext.clearRect(0, 0, tutorialCanvas.width, tutorialCanvas.height);
}

function skip(event) {
    if (event.key === ' ') {
        location.href = 'dashboard.html';
    }
}