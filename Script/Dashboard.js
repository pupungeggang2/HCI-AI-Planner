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

    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let todayDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()];
    let tomorrowDate = [tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate()];

    let todayContent = document.getElementById('dashboardtodaycontent');
    let tomorrowContent = document.getElementById('dashboardtomorrowcontent');

    todayContent.innerHTML = '';
    tomorrowContent.innerHTML = '';

    for (let i = 0; i < usernameInfo['Plan'].length; i++) {
        let tempStr = '';

        if (todayDate[0] === usernameInfo['Plan'][i]['Time'][0] && todayDate[1] === usernameInfo['Plan'][i]['Time'][1] && todayDate[2] === usernameInfo['Plan'][i]['Time'][2]) {
            tempStr += `<div class="planinstance">`;
            
            tempStr += `<div class="planachievetogglebutton" onclick="planAchieveToggle(usernameInfo['Plan'][${i}]['Category'], usernameInfo['Plan'][${i}]['Title'], usernameInfo['Plan'][${i}]['Time']);">`;
            
            if (usernameInfo['Plan'][i]['Status'] === 'NotAchieved') {
                tempStr += `<div class="plannotachieved"></div>`;
            } else {
                tempStr += `<div class="planachieved"></div>`;
            }

            tempStr += `</div>`;

            tempStr += `<div class="category">${usernameInfo['Plan'][i]['Category']}</div>`;
            tempStr += `<div class="title">${usernameInfo['Plan'][i]['Title']}</div>`;
            if (usernameInfo['Plan'][i]['Time'][4] === -1) {
                tempStr += `<div class="time">--:--</div>`;
            } else {
                tempStr += `<div class="time">${String(usernameInfo['Plan'][i]['Time'][4]).padStart(2, '0')}:${String(usernameInfo['Plan'][i]['Time'][5]).padStart(2, '0')}</div>`;
            }
            tempStr += `<div class="removebutton" onclick="removePlan(usernameInfo['Plan'][${i}]['Category'], usernameInfo['Plan'][${i}]['Title'], usernameInfo['Plan'][${i}]['Time']);"></div>`;
            tempStr += `</div>`;
            todayContent.innerHTML += tempStr;
        }

        if (tomorrowDate[0] === usernameInfo['Plan'][i]['Time'][0] && tomorrowDate[1] === usernameInfo['Plan'][i]['Time'][1] && tomorrowDate[2] === usernameInfo['Plan'][i]['Time'][2]) {
            tempStr += `<div class="planinstance">`;

            tempStr += `<div class="planachievetogglebutton" onclick="planAchieveToggle(usernameInfo['Plan'][${i}]['Category'], usernameInfo['Plan'][${i}]['Title'], usernameInfo['Plan'][${i}]['Time']);">`;
            
            if (usernameInfo['Plan'][i]['Status'] === 'NotAchieved') {
                tempStr += `<div class="plannotachieved"></div>`;
            } else {
                tempStr += `<div class="planachieved"></div>`;
            }

            tempStr += `</div>`;
            tempStr += `<div class="category">${usernameInfo['Plan'][i]['Category']}</div>`;
            tempStr+= `<div class="title">${usernameInfo['Plan'][i]['Title']}</div>`;
            if (usernameInfo['Plan'][i]['Time'][4] === -1) {
                tempStr+= `<div class="time">--:--</div>`;
            } else {
                tempStr += `<div class="time">${String(usernameInfo['Plan'][i]['Time'][4]).padStart(2, '0')}:${String(usernameInfo['Plan'][i]['Time'][5]).padStart(2, '0')}</div>`;
            }
            tempStr += `<div class="removebutton" onclick="removePlan(usernameInfo['Plan'][${i}]['Category'], usernameInfo['Plan'][${i}]['Title'], usernameInfo['Plan'][${i}]['Time']);"></div>`;
            tempStr += `</div>`;
            tomorrowContent.innerHTML += tempStr;
        }
    }
}

function addPlan() {
    let today = new Date();
    let command = commandTextbox.value.split(' ').slice(0, 4);

    if (command.length === 2) {
        if (command[0] === '/AI') {
            let todayPlan = [];

            for (let i = 0; i < usernameInfo['Plan'].length; i++) {
                if (usernameInfo['Plan'][i]['Time'][0] === today.getFullYear() && usernameInfo['Plan'][i]['Time'][1] === today.getMonth() + 1 && usernameInfo['Plan'][i]['Time'][2] === today.getDate()) {
                    todayPlan.push(JSON.parse(JSON.stringify(usernameInfo['Plan'][i])));
                }
            }

            if (command[1] === 'today') {
                let targetDate = new Date();

                for (let i = 0; i < todayPlan.length; i++) {
                    let tempPlan = {
                        'Category' : todayPlan[i]['Category'],
                        'Title' : todayPlan[i]['Title'],
                        'Status' : 'NotAchieved',
                        'Time' : [targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate(), targetDate.getDay(), todayPlan[i]['Time'][4],  todayPlan[i]['Time'][5]],
                    };

                    usernameInfo['Plan'].push(tempPlan);
                }

                dashboardRefresh();
            } else if (command[1] === 'tomorrow') {
                let targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + 1);

                for (let i = 0; i < todayPlan.length; i++) {
                    let tempPlan = {
                        'Category' : todayPlan[i]['Category'],
                        'Title' : todayPlan[i]['Title'],
                        'Status' : 'NotAchieved',
                        'Time' : [targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate(), targetDate.getDay(), todayPlan[i]['Time'][4],  todayPlan[i]['Time'][5]],
                    };

                    usernameInfo['Plan'].push(tempPlan);
                }

                dashboardRefresh();
            } else {
                let targetDate = new Date(dateChecker(command[1])[0], dateChecker(command[1])[1] - 1, dateChecker(command[1])[2]);

                for (let i = 0; i < todayPlan.length; i++) {
                    let tempPlan = {
                        'Category' : todayPlan[i]['Category'],
                        'Title' : todayPlan[i]['Title'],
                        'Status' : 'NotAchieved',
                        'Time' : [targetDate.getFullYear(), targetDate.getMonth() + 1, targetDate.getDate(), targetDate.getDay(), todayPlan[i]['Time'][4],  todayPlan[i]['Time'][5]],
                    };

                    usernameInfo['Plan'].push(tempPlan);
                }
                
                dashboardRefresh();
            }
        }
    } else if (command.length === 3) {
        let plan = {
            'Category' : '',
            'Title' : '',
            'Time' : [1970, 01, 01, 03, 00, 00],
            'Status' : 'NotAchieved'
        };

        plan['Category'] = command[0];
        plan['Title'] = command[1];

        if (command[2] === 'today') {
            plan['Time'][0] = today.getFullYear();
            plan['Time'][1] = today.getMonth() + 1;
            plan['Time'][2] = today.getDate();
            plan['Time'][3] = today.getDay();
        } else if (command[2] === 'tomorrow') {
            today.setDate(today.getDate() + 1);
            plan['Time'][0] = today.getFullYear();
            plan['Time'][1] = today.getMonth() + 1;
            plan['Time'][2] = today.getDate();
            plan['Time'][3] = today.getDay();
        } else {
            let returnedDate = dateChecker(command[2]);
            console.log(returnedDate);

            if (returnedDate === null) {
                plan['Time'][0] = today.getFullYear();
                plan['Time'][1] = today.getMonth() + 1;
                plan['Time'][2] = today.getDate();
                plan['Time'][3] = today.getDay();
            } else {
                let selectedDate = new Date(returnedDate[0], returnedDate[1], returnedDate[2]);
                plan['Time'][0] = selectedDate.getFullYear();
                plan['Time'][1] = selectedDate.getMonth();
                plan['Time'][2] = selectedDate.getDate();
                plan['Time'][3] = selectedDate.getDay();
            }
        }

        plan['Time'][4] = -1;
        plan['Time'][5] = -1;

        usernameInfo['Plan'].push(plan);
        account[username] = usernameInfo;
        localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
    } else if (command.length === 4) {
        let plan = {
            'Category' : '',
            'Title' : '',
            'Time' : [1970, 01, 01, 03, 00, 00],
            'Status' : 'NotAchieved'
        };

        plan['Category'] = command[0];
        plan['Title'] = command[1];

        if (command[2] === 'today') {
            plan['Time'][0] = today.getFullYear();
            plan['Time'][1] = today.getMonth() + 1;
            plan['Time'][2] = today.getDate();
            plan['Time'][3] = today.getDay();
        } else if (command[2] === 'tomorrow') {
            today.setDate(today.getDate() + 1);
            plan['Time'][0] = today.getFullYear();
            plan['Time'][1] = today.getMonth() + 1;
            plan['Time'][2] = today.getDate();
            plan['Time'][3] = today.getDay();
        } else {
            let returnedDate = dateChecker(command[2]);

            if (returnedDate === null) {
                plan['Time'][0] = today.getFullYear();
                plan['Time'][1] = today.getMonth() + 1;
                plan['Time'][2] = today.getDate();
                plan['Time'][3] = today.getDay();
            } else {
                let selectedDate = new Date(returnedDate[0], returnedDate[1], returnedDate[2]);
                plan['Time'][0] = selectedDate.getFullYear();
                plan['Time'][1] = selectedDate.getMonth();
                plan['Time'][2] = selectedDate.getDate();
                plan['Time'][3] = selectedDate.getDay();
            }
        }

        const regTime = /^[0-9]?[0-9]?:[0-9]?[0-9]?$/;

        if (regTime.test(command[3]) === true) {
            let timeSplit = command[3].split(':');
            let time = [parseInt(timeSplit[0]), parseInt(timeSplit[1])];

            if (time[0] >= 0 && time[0] <= 23 && time[1] >= 0 && time[1] <= 59) {
                plan['Time'][4] = time[0];
                plan['Time'][5] = time[1];
            } else {
                plan['Time'][4] = -1;
                plan['Time'][5] = -1;
            }
        } else {
            plan['Time'][4] = -1;
            plan['Time'][5] = -1;
        }

        usernameInfo['Plan'].push(plan);
        account[username] = usernameInfo;
        localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
    }

    commandTextbox.value = '';
    dashboardRefresh();
}

function dateChecker(str) {
    let today = new Date();
    const regDateExDateYYYYMMDD = /^[0-9]?[0-9]?[0-9]?[0-9]?\/[0-9]?[0-9]?\/[0-9]?[0-9]?$/;
    const regDateExDateYYMMDD = /^[0-9]?[0-9]?\/[0-9]?[0-9]?\/[0-9]?[0-9]?$/;
    const regDateExDateMMDD = /^[0-9]?[0-9]?\/[0-9]?[0-9]?$/;
    const regDateExDateDD = /^[0-9]?[0-9]?$/;
    const monthDateNotLeap = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const monthDateLeap = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (regDateExDateYYYYMMDD.test(str) === true) {
        let dateSplit = str.split('/');
        let date = [parseInt(dateSplit[0]), parseInt(dateSplit[1]), parseInt(dateSplit[2])];
        if (date[1] >= 1 && date[1] <= 12) {
            let ly = leapYearCheck(date[0]);
            if (ly === true) {
                if (dateSplit[2] >= 1 && date[2] <= monthDateLeap[date[1]]) {
                    return date;
                }
            } else {
                if (date[2] >= 1 && date[2] <= monthDateNotLeap[date[1]]) {
                    return date;
                }
            }
        }
    } else if (regDateExDateYYMMDD.test(str) === true) {
        let dateSplit = str.split('/');
        let date = [2000 + parseInt(dateSplit[0]), parseInt(dateSplit[1]), parseInt(dateSplit[2])];
        if (date[1] >= 1 && date[1] <= 12) {
            let ly = leapYearCheck(date[0]);
            if (ly === true) {
                if (dateSplit[2] >= 1 && date[2] <= monthDateLeap[date[1]]) {
                    return date;
                }
            } else {
                if (date[2] >= 1 && date[2] <= monthDateNotLeap[date[1]]) {
                    return date;
                }
            }
        }
    } else if (regDateExDateMMDD.test(str) === true) {
        let dateSplit = str.split('/');
        let date = [today.getFullYear(), parseInt(dateSplit[0]), parseInt(dateSplit[1])];
        if (date[1] >= 1 && date[1] <= 12) {
            let ly = leapYearCheck(date[0]);
            if (ly === true) {
                if (dateSplit[2] >= 1 && date[2] <= monthDateLeap[date[1]]) {
                    return date;
                }
            } else {
                if (date[2] >= 1 && date[2] <= monthDateNotLeap[date[1]]) {
                    return date;
                }
            }
        }
    } else if (regDateExDateDD.test(str) === true) {
        let date = [today.getFullYear(), today.getMonth() + 1, parseInt(str)];
        if (date[1] >= 1 && date[1] <= 12) {
            let ly = leapYearCheck(date[0]);
            if (ly === true) {
                if (dateSplit[2] >= 1 && date[2] <= monthDateLeap[date[1]]) {
                    return date;
                }
            } else {
                if (date[2] >= 1 && date[2] <= monthDateNotLeap[date[1]]) {
                    return date;
                }
            }
        }
    }

    return null;
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

function removePlan(category, title, time) {
    let timeMatch = false;

    for (let i = 0; i < usernameInfo['Plan'].length; i++) {
        if (usernameInfo['Plan'][i]['Category'] === category && usernameInfo['Plan'][i]['Title'] === title) {
            for (let j = 0; j < 6; j++) {
                if (usernameInfo['Plan'][i]['Time'][j] != time[j]) {
                    break;
                }

                if (j === 5) {
                    timeMatch = true;
                }
            }

            if (timeMatch === true) {
                usernameInfo['Plan'].splice(i, 1);
                dashboardRefresh();
                return;
            }
        }
    }
}

function planAchieveToggle(category, title, time) {
    let timeMatch = false;

    for (let i = 0; i < usernameInfo['Plan'].length; i++) {
        if (usernameInfo['Plan'][i]['Category'] === category && usernameInfo['Plan'][i]['Title'] === title) {
            for (let j = 0; j < 6; j++) {
                if (usernameInfo['Plan'][i]['Time'][j] != time[j]) {
                    break;
                }

                if (j === 5) {
                    timeMatch = true;
                }
            }

            if (timeMatch === true) {
                if (usernameInfo['Plan'][i]['Status'] === 'NotAchieved') {
                    usernameInfo['Plan'][i]['Status'] = 'Achieved';
                } else {
                    usernameInfo['Plan'][i]['Status'] = 'NotAchieved';
                }
                dashboardRefresh();
                return;
            }
        }
    }
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

function commandKeyUp(event) {
    if (event.key === 'Enter') {
        addPlan();
    }
}