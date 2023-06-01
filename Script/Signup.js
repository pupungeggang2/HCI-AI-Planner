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
            'username' : username,
            'email' : email,
            'password' : password,
            'plan' : [],
        };
        console.log(tempAccount);
        account.push(tempAccount);
        localStorage.setItem('PlanGPT-Account', JSON.stringify(account));
        location.href = 'index.html';
    }
}

function signupValidityCheck(username, email, password, passwordConfirm) {
    if (username.length <= 0) {
        return false;
    }

    if (email.length <= 0) {
        return false;
    }

    if (password.length <= 0) {
        return false;
    }

    if (password != passwordConfirm) {
        return false;
    }

    return true;
}