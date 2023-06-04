window.onload = calendarInit;
window.onbeforeunload = calendarEnd;

const dayName = {0 : 'Sun', 1 : 'Mon', 2 : 'Tue', 3 : 'Wed', 4 : 'Thu', 5 : 'Fri', 6 : 'Sat'};

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
let calendarTopElement;
let calendarTableHeadElement;
let weekElement;
let monthElement;

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

    dayCurrent = new Date();
    weekStart = new Date();
    monthStart = new Date();

    findCalendarDate();
    refreshCalendar();
}

function findCalendarDate() {
    date = dayCurrent.getDate();
    day = dayCurrent.getDay();

    weekStart = new Date(dayCurrent.getFullYear(), dayCurrent.getMonth(), dayCurrent.getDate());
    monthStart = new Date(dayCurrent.getFullYear(), dayCurrent.getMonth(), dayCurrent.getDate());

    let monthStartDay = monthStart.getDay();
    weekStart.setDate(weekStart.getDate() - day);
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

function refreshCalendar() {
    calendarTopElement = document.getElementById('calendartop');
    calendarTableHeadElement = document.getElementById('calendarweeklytableheadview');
    weekElement = document.getElementById('calendarweeklytableview');
    monthElement = document.getElementById('calendarmonthlytableview');

    if (viewMode === 'Week') {
        weekElement.style.display = 'block';
        monthElement.style.display = 'none';

        calendarTopElement.innerHTML = '';
        calendarTableHeadElement.innerHTML = '';
        weekElement.innerHTML = '';
        monthElement.innerHTML = '';

        // Calendar Top Elmement
        calendarTopElement.innerHTML += `<button id="calendarleftbutton" onclick="goPreviousWeek();"></button>`;
        calendarTopElement.innerHTML += `<div id="calendardate">${weekDay[0][0]}/${weekDay[0][1]}/${weekDay[0][2]} ~ ${weekDay[6][0]}/${weekDay[6][1]}/${weekDay[6][2]}</div>`;
        calendarTopElement.innerHTML += `<button id="calendarrightbutton" onclick="goNextWeek();"></button>`;
        calendarTopElement.innerHTML += `<button id="calendarweeklybutton" onclick="onButtonWeekClick();">Weekly</button><button id="calendarmonthlybutton" onclick="onButtonMonthClick();">Monthly</button>`;

        let tempStr = '';
        tempStr += `<table id="calendarweeklytablehead"><tr>`;
        tempStr += `<th id="calendarweeklyelementfirst">Time</th>`;

        for (let i = 0; i < 7; i++) {
            tempStr += `<th id="calendarweeklyelement">${weekDay[i][1]}/${weekDay[i][2]}</th>`;
        }

        tempStr += `</tr></table>`;
        calendarTableHeadElement.innerHTML = tempStr;

        tempStr = '';
        tempStr += `<table id="calendarweeklytable">`;

        for (let i = 0; i < 24; i++) {
            tempStr += `<tr>`;
            tempStr += `<th id="calendarweeklyelementfirst">${i}:00~<br>${i + 1}:00</th>`;
            for (let j = 0; j < 7; j++) {
                tempStr += `<th id="calendarweeklyelement">`
                tempStr += `</th>`;
            }
            tempStr += `</tr>`;
        }

        tempStr += `</table>`;
        weekElement.innerHTML = tempStr;

    } else if (viewMode === 'Month') {
        weekElement.style.display = 'none';
        monthElement.style.display = 'block';

        calendarTopElement.innerHTML = '';
        weekElement.innerHTML = '';
        monthElement.innerHTML = '';

        calendarTopElement.innerHTML += `<button id="calendarleftbutton" onclick="goPreviousMonth();"></button>`;
        calendarTopElement.innerHTML += `<div id="calendardate">${dayCurrent.getFullYear()}/${dayCurrent.getMonth() + 1}</div>`;
        calendarTopElement.innerHTML += `<button id="calendarrightbutton" onclick="goNextMonth();"></button>`;
        calendarTopElement.innerHTML += `<button id="calendarrightbutton" onclick="goNextWeek();"></button>`;
        calendarTopElement.innerHTML += `<button id="calendarweeklybutton" onclick="onButtonWeekClick();">Weekly</button><button id="calendarmonthlybutton" onclick="onButtonMonthClick();">Monthly</button>`;
    }
}

function onButtonWeekClick() {
    viewMode = 'Week';

    findCalendarDate();
    refreshCalendar();
}

function onButtonMonthClick() {
    viewMode = 'Month';

    findCalendarDate();
    refreshCalendar();
}

function goPreviousWeek() {
    dayCurrent.setDate(dayCurrent.getDate() - 7);

    findCalendarDate();
    refreshCalendar();
}

function goNextWeek() {
    dayCurrent.setDate(dayCurrent.getDate() + 7);

    findCalendarDate();
    refreshCalendar();
}

function goPreviousMonth() {
    dayCurrent.setMonth(dayCurrent.getMonth() - 1);

    findCalendarDate();
    refreshCalendar();
}

function goNextMonth() {
    dayCurrent.setMonth(dayCurrent.getMonth() + 1);

    findCalendarDate();
    refreshCalendar();
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