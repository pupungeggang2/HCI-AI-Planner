window.onload = indexInit;

function indexInit() {
    if (localStorage.getItem('PlanGPT-Account') === null) {
        localStorage.setItem('PlanGPT-Account', '{}');
    }
}