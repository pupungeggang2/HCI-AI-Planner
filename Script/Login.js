window.onload = loginInit;

function loginInit() {
    if (localStorage.getItem('PlanGPT-Account') === null) {
        localStorage.setItem('PlanGPT-Account', '{}');
    }
}

function loginBackClick() {
    location.href = 'index.html';
}

function loginConfirmClick() {
    let username = document.getElementById('loginusernametextbox').value;
    let password = document.getElementById('loginpasswordtextbox').value;

    login(username, password);
}

function login(username, password) {
    let account = JSON.parse(localStorage.getItem('PlanGPT-Account'));

    if (username in account) {
        if (password === account[username]['Password']) {
            sessionStorage.setItem('PlanGPT-AccountCurrent', username);
            if (account[username]['FirstLoggedIn'] === true) {
                account[username]['FirstLoggedIn'] = false;
                localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
                location.href = 'tutorial.html';
            } else {
                location.href = 'dashboard.html';
            }
        } else {
            alert('Password does not match!');
        }
    }
}