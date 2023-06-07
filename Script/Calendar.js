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
let editMode = false;
let editPlanIndex = -1;
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

    dayCurrent = new Date();
    weekStart = new Date();
    monthStart = new Date();

    window.addEventListener('keydown', onKeyDown, false);

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
    monthStart.setDate(monthStart.getDate() - date);

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
    let calendarTopElement = document.getElementById('calendartop');
    let weekElement = document.getElementById('calendarweeklytableview');
    let monthElement = document.getElementById('calendarmonthlytableview');
    let calendarWeeklyTableHeadElement = document.getElementById('calendarweeklytableheadview');
    let calendarMonthlyTableHeadElement = document.getElementById('calendarmonthlytableheadview');
    let calendarEditWindow = document.getElementById('calendareditwindow');
    let weeklyPlan = [];
    let monthlyPlan = [];
    let numOfWeeklyPlan = 0;
    let numOfMonthlyPlan = 0;
    let numOfWeeklyPlanAchieved = 0;
    let numOfMonthlyPlanAchieved = 0;

    for (let i = 0; i < 7; i++) {
        let tempRow = [];
        for (let j = 0; j < 24; j++) {
            let tempCell = [];

            for (let k = 0; k < usernameInfo['Plan'].length; k++) {
                if (usernameInfo['Plan'][k]['Time'][0] === weekDay[i][0] && usernameInfo['Plan'][k]['Time'][1] === weekDay[i][1] && usernameInfo['Plan'][k]['Time'][2] === weekDay[i][2] && usernameInfo['Plan'][k]['Time'][4] === j) {
                    tempCell.push(k);
                    numOfWeeklyPlan += 1;

                    if (usernameInfo['Plan'][k]['Status'] === 'Achieved') {
                        numOfWeeklyPlanAchieved += 1;
                    }
                }
            }

            tempRow.push(tempCell);
        }
        weeklyPlan.push(tempRow);
    }

    for (let i = 0; i < 42; i++) {
        let tempCell = [];
        for (let j = 0; j < usernameInfo['Plan'].length; j++) {
            if (usernameInfo['Plan'][j]['Time'][0] === monthDay[i][0] && usernameInfo['Plan'][j]['Time'][1] === monthDay[i][1] && usernameInfo['Plan'][j]['Time'][2] === monthDay[i][2]) {
                tempCell.push(j);
                numOfMonthlyPlan += 1;

                if (usernameInfo['Plan'][j]['Status'] === 'Achieved') {
                    numOfMonthlyPlanAchieved += 1;
                }
            }
        }
        monthlyPlan.push(tempCell);
    }

    // Add Elements
    if (viewMode === 'Week') {
        calendarWeeklyTableHeadElement.style.display = 'block';
        calendarMonthlyTableHeadElement.style.display = 'none';
        weekElement.style.display = 'block';
        monthElement.style.display = 'none';

        calendarTopElement.innerHTML = '';
        calendarWeeklyTableHeadElement.innerHTML = '';
        weekElement.innerHTML = '';
        monthElement.innerHTML = '';

        // Calendar Top Elmement
        calendarTopElement.innerHTML += `<button id="calendarleftbutton" onclick="goPreviousWeek();"><</button>`;
        if (numOfWeeklyPlan > 0) {
            calendarTopElement.innerHTML += `<div id="calendarachieveratetext">${Math.floor(numOfWeeklyPlanAchieved / numOfWeeklyPlan * 100)}% Achieved</div>`;
        }
        calendarTopElement.innerHTML += `<div id="calendardate">${weekDay[0][0]}/${weekDay[0][1]}/${weekDay[0][2]} ~ ${weekDay[6][0]}/${weekDay[6][1]}/${weekDay[6][2]}</div>`;
        calendarTopElement.innerHTML += `<button id="calendarrightbutton" onclick="goNextWeek();">></button>`;
        calendarTopElement.innerHTML += `<button id="calendarweeklybutton" onclick="onButtonWeekClick();">Weekly</button><button id="calendarmonthlybutton" onclick="onButtonMonthClick();">Monthly</button>`;

        let tempStr = '';
        tempStr += `<table id="calendarweeklytablehead"><tr class="calendarweeklytableheadrow">`;
        tempStr += `<th class="calendarweeklyheadelementfirst">Time</th>`;

        for (let i = 0; i < 7; i++) {
            tempStr += `<th class="calendarweeklyheadelement">${weekDay[i][1]}/${weekDay[i][2]}</th>`;
        }

        tempStr += `</tr></table>`;
        calendarWeeklyTableHeadElement.innerHTML = tempStr;

        tempStr = '';
        tempStr += `<table id="calendarweeklytable">`;

        for (let i = 0; i < 24; i++) {
            tempStr += `<tr class="calendarweeklyrow">`;
            tempStr += `<th class="calendarweeklyelementfirst">${i}:00~${i + 1}:00</th>`;
            for (let j = 0; j < 7; j++) {
                tempStr += `<th class="calendarweeklyelement">`;
                for (let k = 0; k < weeklyPlan[j][i].length; k++) {
                    let index = weeklyPlan[j][i][k];
                    tempStr += `<div class="planinstance">`;
                    if (usernameInfo['Plan'][index]['Status'] === "Achieved") {
                        tempStr += `<div class="planachievebutton" onclick="planAchieveToggle(${index});"><div class="planachieved"></div></div>`;
                    } else {
                        tempStr += `<div class="planachievebutton" onclick="planAchieveToggle(${index});"><div class="plannotachieved"></div></div>`;
                    }
                    if (usernameInfo['Plan'][index]['Time'][4] != -1) {
                        tempStr += `<div class="plantime">${String(usernameInfo['Plan'][index]['Time'][4]).padStart(2, '0')}:${String(usernameInfo['Plan'][index]['Time'][5]).padStart(2, '0')}</div>`;
                    } else {
                        tempStr += `<div class="plantime">--:--</div>`;
                    }
                    tempStr += `<div class="plancategory" onclick="editPlanInit(${index});">${usernameInfo['Plan'][index]['Category']}</div>`;
                    tempStr += `<div class="plantitle" onclick="editPlanInit(${index});">${usernameInfo['Plan'][index]['Title']}</div>`;
                    tempStr += `<div class="planremovebutton" onclick="removePlan(${index});"></div>`;
                    tempStr += `</div>`;
                }
                tempStr += `</th>`;
            }
            tempStr += `</tr>`;
        }

        tempStr += `</table>`;
        weekElement.innerHTML = tempStr;

    } else if (viewMode === 'Month') {
        calendarWeeklyTableHeadElement.style.display = 'none';
        calendarMonthlyTableHeadElement.style.display = 'block';
        weekElement.style.display = 'none';
        monthElement.style.display = 'block';

        calendarTopElement.innerHTML = '';
        calendarMonthlyTableHeadElement.innerHTML = '';
        weekElement.innerHTML = '';
        monthElement.innerHTML = '';

        calendarTopElement.innerHTML += `<button id="calendarleftbutton" onclick="goPreviousMonth();"><</button>`;
        if (numOfMonthlyPlan > 0) {
            calendarTopElement.innerHTML += `<div id="calendarachieveratetext">${Math.floor(numOfMonthlyPlanAchieved / numOfMonthlyPlan * 100)}% Achieved</div>`;
        }
        calendarTopElement.innerHTML += `<div id="calendardate">${dayCurrent.getFullYear()}/${dayCurrent.getMonth() + 1}</div>`;
        calendarTopElement.innerHTML += `<button id="calendarrightbutton" onclick="goNextMonth();">></button>`;
        calendarTopElement.innerHTML += `<button id="calendarweeklybutton" onclick="onButtonWeekClick();">Weekly</button><button id="calendarmonthlybutton" onclick="onButtonMonthClick();">Monthly</button>`;

        let tempStr = '';
        tempStr += `<table id="calendarmonthlytablehead">`;
        tempStr += `<tr>`;
        for (let i = 0; i < 7; i++) {
            tempStr += `<th class="calendarmonthlyheadelement">${dayName[i]}</th>`;
        }
        tempStr += `</tr>`;
        tempStr += `</table>`;

        calendarMonthlyTableHeadElement.innerHTML = tempStr;

        tempStr = '';
        tempStr += `<table id="calendarmonthlytable">`;

        for (let i = 0; i < 6; i++) {
            tempStr += `<tr class="calendarmonthlyrow">`;

            for (let j = 0; j < 7; j++) {
                tempStr += `<th class="calendarmonthlyelement">`;
                let monthDayIndex = i * 7 + j;
                tempStr += `<div class="calendardatetext">${monthDay[monthDayIndex][1]}/${monthDay[monthDayIndex][2]}</div>`;
                for (let k = 0; k < monthlyPlan[monthDayIndex].length; k++) {
                    let index = monthlyPlan[monthDayIndex][k];
                    tempStr += `<div class="planinstance">`;
                    if (usernameInfo['Plan'][index]['Status'] === "Achieved") {
                        tempStr += `<div class="planachievebutton" onclick="planAchieveToggle(${index});"><div class="planachieved"></div></div>`;
                    } else {
                        tempStr += `<div class="planachievebutton" onclick="planAchieveToggle(${index});"><div class="plannotachieved"></div></div>`;
                    }
                    if (usernameInfo['Plan'][index]['Time'][4] != -1) {
                        tempStr += `<div class="plantime">${String(usernameInfo['Plan'][index]['Time'][4]).padStart(2, '0')}:${String(usernameInfo['Plan'][index]['Time'][5]).padStart(2, '0')}</div>`;
                    } else {
                        tempStr += `<div class="plantime">--:--</div>`;
                    }
                    tempStr += `<div class="plancategory" onclick="editPlanInit(${index});">${usernameInfo['Plan'][index]['Category']}</div>`;
                    tempStr += `<div class="plantitle" onclick="editPlanInit(${index});">${usernameInfo['Plan'][index]['Title']}</div>`;
                    tempStr += `<div class="planremovebutton" onclick="removePlan(${index});"></div>`;
                    tempStr += `</div>`;
                }
                tempStr += `</th>`;
            }

            tempStr += `</tr>`;
        }

        tempStr += `</table>`;
        monthElement.innerHTML = tempStr;
    }

    if (editMode === true) {
        calendarEditWindow.style.display = 'block';
    } else {
        calendarEditWindow.style.display = 'none';
    }
}

function planAchieveToggle(index) {
    if (usernameInfo['Plan'][index]['Status'] === 'Achieved') {
        usernameInfo['Plan'][index]['Status'] = 'NotAchieved';
    } else {
        usernameInfo['Plan'][index]['Status'] = 'Achieved';
    }

    refreshCalendar();
}

function editPlanInit(index) {
    if (editMode === false) {
        editMode = true;
        editPlanIndex = index;

        let calendarEditWindow = document.getElementById('calendareditwindow');

        document.getElementById('calendareditcategorytextbox').value = usernameInfo['Plan'][index]['Category'];
        document.getElementById('calendaredittitletextbox').value = usernameInfo['Plan'][index]['Title'];
        document.getElementById('calendaredityeartextbox').value = usernameInfo['Plan'][index]['Time'][0];
        document.getElementById('calendareditmonthtextbox').value = usernameInfo['Plan'][index]['Time'][1];
        document.getElementById('calendareditdatetextbox').value = usernameInfo['Plan'][index]['Time'][2];
        document.getElementById('calendaredithourtextbox').value = usernameInfo['Plan'][index]['Time'][4];
        document.getElementById('calendareditminutetextbox').value = usernameInfo['Plan'][index]['Time'][5];

        refreshCalendar();
    }
}

function editPlan(index) {
    let category = document.getElementById('calendareditcategorytextbox').value;
    let title = document.getElementById('calendaredittitletextbox').value;
    let year = parseInt(document.getElementById('calendaredityeartextbox').value);
    let month = parseInt(document.getElementById('calendareditmonthtextbox').value);
    let date = parseInt(document.getElementById('calendareditdatetextbox').value);
    let hour = parseInt(document.getElementById('calendaredithourtextbox').value);
    let minute = parseInt(document.getElementById('calendareditminutetextbox').value);
    const monthDateNotLeap = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const monthDateLeap = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (category.length <= 0) {
        return;
    }

    if (title.length <= 0) {
        return;
    }

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(date) || !Number.isInteger(hour) || !Number.isInteger(minute)) {
        return;
    }

    if (month < 1 || month > 12) {
        return;
    }

    if (leapYearCheck(year) === true) {
        if (date < 1 || date > monthDateLeap[month]) {
            return;
        }
    } else {
        if (date < 1 || date > monthDateNotLeap[month]) {
            return;
        }
    }

    if (hour < 0 || hour > 23) {
        return;
    }

    if (minute < 0 || minute > 59) {
        return;
    }

    usernameInfo['Plan'][index]['Category'] = category;
    usernameInfo['Plan'][index]['Title'] = title;
    usernameInfo['Plan'][index]['Time'][0] = year;
    usernameInfo['Plan'][index]['Time'][1] = month;
    usernameInfo['Plan'][index]['Time'][2] = date;
    usernameInfo['Plan'][index]['Time'][3] = new Date(year, month - 1, date).getDate();
    usernameInfo['Plan'][index]['Time'][4] = hour;
    usernameInfo['Plan'][index]['Time'][5] = minute;

    editMode = false;
    editPlanIndex = -1;
    refreshCalendar();
}

function editCancel() {
    editMode = false;
    editPlanIndex = -1;
    refreshCalendar();
}

function removePlan(index) {
    usernameInfo['Plan'].splice(index, 1);
    refreshCalendar();
}

function leapYearCheck(year) {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function onButtonWeekClick() {
    if (editMode === false) {
        viewMode = 'Week';

        findCalendarDate();
        refreshCalendar();
    }
}

function onButtonMonthClick() {
    if (editMode === false) {
        viewMode = 'Month';

        findCalendarDate();
        refreshCalendar();
    }
}

function goPreviousWeek() {
    if (editMode === false) {
        dayCurrent.setDate(dayCurrent.getDate() - 7);

        findCalendarDate();
        refreshCalendar();
    }
}

function goNextWeek() {
    if (editMode === false) {
        dayCurrent.setDate(dayCurrent.getDate() + 7);

        findCalendarDate();
        refreshCalendar();
    }
}

function goPreviousMonth() {
    if (editMode === false) {
        dayCurrent.setMonth(dayCurrent.getMonth() - 1);

        findCalendarDate();
        refreshCalendar();
    }
}

function goNextMonth() {
    if (editMode === false) {
        dayCurrent.setMonth(dayCurrent.getMonth() + 1);

        findCalendarDate();
        refreshCalendar();
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

function onKeyDown(event) {
    if (event.key === 'Enter') {
        if (editMode === true) {
            editPlan(editPlanIndex);
        }
    }
}