window.onload = signupInit;

function signupInit() {
    if (localStorage.getItem('PlanGPT-Account') === null) {
        localStorage.setItem('PlanGPT-Account', '{}');
    }
}

let errorMessage = '';

function signupBackClick() {
    location.href = 'index.html';
}

function signupConfirmClick() {
    let username = document.getElementById('signupusernametextbox').value;
    let email = document.getElementById('signupemailtextbox').value;
    let password = document.getElementById('signuppasswordtextbox').value;
    let passwordConfirm = document.getElementById('signuppasswordconfirmtextbox').value;

    if (signupValidityCheck(username, email, password, passwordConfirm)) {
        let account = JSON.parse(localStorage.getItem('PlanGPT-Account'));
        console.log(account);
        let tempAccount = {
            'Email' : email,
            'Password' : password,
            'FirstLoggedIn' : true,
            'Plan' : [],
        };
        account[username] = tempAccount;
        localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
        location.href = 'index.html';
    }
}

function signupValidityCheck(username, email, password, passwordConfirm) {
    if (username.length <= 0) {
        alert('Username is not valid!');
        return false;
    }

    if (email.length <= 0) {
        alert('Email is not valid!');
        return false;
    }

    if (password.length <= 0) {
        alert('Password is not valid!');
        return false;
    }

    if (password != passwordConfirm) {
        alert('Passwords do not match!');
        return false;
    }

    return true;
}