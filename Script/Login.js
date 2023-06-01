function loginBackClick() {
    location.href = 'index.html';
}

function loginConfirmClick() {
    let username = document.getElementById('loginusernametextbox').value;
    let password = document.getElementById('loginpasswordtextbox').value;

    login(username, password);
}

function login(username, password) {
    if (localStorage.getItem('PlanGPT-Account') === null) {
        localStorage.setItem('PlanGPT-Account', JSON.stringify([]));
    }

    let account = JSON.parse(localStorage.getItem('PlanGPT-Account'));

    for (let i = 0; i < account.length; i++) {
        if (username === account[i]['username'] && password === account[i]['password']) {
            sessionStorage.setItem('PlanGPT-AccountCurrent', account[i]['username']);
            location.href = 'dashboard.html';
        }
    }
}