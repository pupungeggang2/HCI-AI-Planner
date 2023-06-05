window.onload = settingsInit;
window.onbeforeunload = settingsEnd;

let account;
let username;
let usernameInfo;
let usernameText;
let emailText;
let accountDeleted = false;

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

    settingsRefresh();
}

function settingsRefresh() {
    usernameText = document.getElementById('settingsusernametext');
    emailText = document.getElementById('settingsemailtext');

    usernameText.innerHTML = `Username : ${username}`;
    emailText.innerHTML = `Email : ${usernameInfo['Email']}`;

    document.getElementById('settingsusernametextbox').value = '';
    document.getElementById('settingsemailtextbox').value = '';
    document.getElementById('settingspasswordtextbox').value = '';
    document.getElementById('settingspasswordconfirmtextbox').value = '';
}

function changeUsername() {
    let str = document.getElementById('settingsusernametextbox').value;

    if (str.length <= 0) {
        alert('Invalid username!');
        return;
    } else if (str === username) {
        alert('Username is same as original!');
    } else {
        delete account[username];
        account[str] = usernameInfo;
        username = str;
        sessionStorage.setItem('PlanGPT-AccountCurrent', str);
        localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
    }

    settingsRefresh();
}

function changeEmail() {
    let str = document.getElementById('settingsemailtextbox').value;

    if (str.length <= 0) {
        alert('Invalid email!');
        return;
    } else if (str === usernameInfo['Email']) {
        alert('Email is same as original!');
    } else {
        usernameInfo['Email'] = str;
        account[username] = usernameInfo;
        localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
        settingsRefresh();
    }
}

function changePassword() {
    let pass1 = document.getElementById('settingspasswordtextbox').value;
    let pass2 = document.getElementById('settingspasswordconfirmtextbox').value;

    if (pass1.length <= 0) {
        alert('Invalid password!');
    } else if (pass1 != pass2) {
        alert('Passwords do not match!');
    } else {
        usernameInfo['Password'] = pass1;
        account[username] = usernameInfo;
        localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
        settingsRefresh();
    }
}

function logout() {
    sessionStorage.clear();
    location.href = 'index.html';
}

function deleteAccount() {
    delete account[username];
    console.log(account);
    localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
    accountDeleted = true;
    location.href = 'index.html';
}

function settingsEnd() {
    if (accountDeleted === false) {
        account[username] = usernameInfo;
        localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
    }
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