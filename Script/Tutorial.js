window.onload = tutorialInit;

let tutorialPage = 0;
const descriptions = ['Welcome to Plan GPT!', 'Add dategoty title date and time.', 'Your plan has created.', 'type /AI and date to auto-generate plans.', 'AI automatically generated your plans.', 'You can see your plans in calendar view.', 'Edit your plans.'];

function tutorialInit() {
    tutorialPage = 0;
    window.addEventListener('keydown', skip, false);
    tutorialRefresh();
}

function tutorialRefresh() {
    document.getElementById('tutorialtitle').innerHTML = descriptions[tutorialPage];
    document.getElementById('tutorialimage').src = `Image/Tutorial${tutorialPage + 1}.png`;

    if (tutorialPage === 0) {
        document.getElementById('tutorialprevbutton').style.display = 'none';
    } else {
        document.getElementById('tutorialprevbutton').style.display = 'block';
    }

    if (tutorialPage === 6) {
        document.getElementById('tutorialnextbutton').innerHTML = 'Done';
    } else {
        document.getElementById('tutorialnextbutton').innerHTML = 'Next';
    }
}

function prev() {
    if (tutorialPage > 0) {
        tutorialPage -= 1;
        tutorialRefresh();
    }
}

function next() {
    if (tutorialPage >= 6) {
        location.href = 'dashboard.html';
    } else {
        tutorialPage += 1;
        tutorialRefresh();
    }
}

function skip(event) {
    if (event.key === ' ') {
        location.href = 'dashboard.html';
    }
}