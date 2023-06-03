function loginBackClick() {
    location.href = 'index.html';
}

function loginConfirmClick() {
    let username = document.getElementById('loginusernametextbox').value;
    let password = document.getElementById('loginpasswordtextbox').value;

    login(username, password);
}

function login(username, password) {
    let noAccount = true;

    if (localStorage.getItem('PlanGPT-Account') === null) {
        localStorage.setItem('PlanGPT-Account', JSON.stringify([]));
    }

    let account = JSON.parse(localStorage.getItem('PlanGPT-Account'));

    for (let i = 0; i < account.length; i++) {
        if (username === account[i]['Username']) {
            noAccount = false;

            if (password === account[i]['Password']) {
                sessionStorage.setItem('PlanGPT-AccountCurrent', account[i]['username']);

                if (account[i]['FirstLoggedIn'] === true) {
                    account[i]['FirstLoggedIn'] = false;
                    localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
                    location.href = 'tutorial.html';
                } else {
                    location.href = 'dashboard.html';
                }
                break;
            } else {
                alert('Password does not match!');
                break;
            }
        }
    }

    if (noAccount === true) {
        alert('No account!');
    }
}