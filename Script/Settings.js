window.onload = settingsInit;
window.onbeforeunload = settingsEnd;

function settingsInit() {
    if (localStorage.getItem('PlanGPT-Account') === null) {
        location.href = 'index.html';
        return;
    }

    if (sessionStorage.getItem('PlanGPT-AccountCurrent') === null) {
        location.href = 'index.html';
        return;
    }

    username = sessionStorage.getItem('PlanGPT-AccountCurrent');
    account = JSON.parse(localStorage.getItem('PlanGPT-Account'));

    if (username in account) {
        usernameInfo = account[username];
    } else {
        location.href = 'index.html';
        return;
    }

    commandTextbox = document.getElementById('dashboardcommandbartextbox');
}

function settingsEnd() {
    account[username] = usernameInfo;
    localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
}

function moveToDashboard() {
    settingsEnd();
    location.href = 'dashboard.html';
}

function moveToCalendar() {
    settingsEnd();
    location.href = 'calendar.html';
}

function moveToSettings() {
    settingsEnd();
    location.href = 'settings.html';
}