window.onload = dashboardInit;
window.onbeforeunload = dashboardEnd;

let account;
let username;
let usernameInfo;
let commandTextbox;

function dashboardInit() {
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
    commandTextbox.addEventListener('keyup', commandKeyUp, false);

    dashboardRefresh();
}

function dashboardRefresh() {
    let d = new Date();

    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let date = d.getDate();
    let dateText = year + '/' + month + '/' + date;
    document.getElementById('dashboarddatetext').innerHTML = dateText;
}

function commandKeyUp(event) {
    if (event.key === 'Enter') {
        addPlan();
    }
}

function addPlan() {
    console.log(commandTextbox.value);
    dashboardRefresh();
}

function moveToDashboard() {
    dashboardEnd();
    location.href = 'dashboard.html';
}

function moveToCalendar() {
    dashboardEnd();
    location.href = 'calendar.html';
}

function moveToSettings() {
    dashboardEnd();
    location.href = 'settings.html';
}

function dashboardEnd() {
    account[username] = usernameInfo;
    localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
}