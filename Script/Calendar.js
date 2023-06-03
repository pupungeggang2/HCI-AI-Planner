window.onload = calendarInit;
window.onbeforeunload = calendarEnd;

let account;
let username;
let usernameInfo;
let commandTextbox;
let dayCurrent;
let weekStart;
let monthStart;
let viewMode = 'Week';
let weekDay = [];
let monthDay = [];

function calendarInit() {
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

    findCalendarDate();
}

function findCalendarDate() {
    dayCurrent = new Date();
    weekStart = new Date();
    monthStart = new Date();

    date = dayCurrent.getDate();
    day = dayCurrent.getDay();

    weekStart.setDate(weekStart.getDate() - day);
    monthStart.setDate(monthStart.getDate() - date + 1);

    let monthStartDay = monthStart.getDay();
    monthStart.setDate(monthStart.getDate() - monthStartDay);

    weekDay = [];
    monthDay = [];

    for (let i = 0; i < 7; i++) {
        weekDay.push([weekStart.getFullYear(), weekStart.getMonth() + 1, weekStart.getDate(), weekStart.getDay()]);
        weekStart.setDate(weekStart.getDate() + 1);
    }

    for (let i = 0; i < 42; i++) {
        monthDay.push([monthStart.getFullYear(), monthStart.getMonth() + 1, monthStart.getDate(), monthStart.getDay()]);
        monthStart.setDate(monthStart.getDate() + 1);
    }
}

function calendarEnd() {
    account[username] = usernameInfo;
    localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
}

function moveToDashboard() {
    calendarEnd();
    location.href = 'dashboard.html';
}

function moveToCalendar() {
    calendarEnd();
    location.href = 'calendar.html';
}

function moveToSettings() {
    calendarEnd();
    location.href = 'settings.html';
}