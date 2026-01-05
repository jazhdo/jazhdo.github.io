// Version 1/4/2026

//Check and update mode (Not set dark mode)
function darkmode() {
    if (localStorage.getItem('lightmode') === 'dark') {
        document.querySelectorAll('*').forEach(Element => {Element.className += " darkmode"});
        console.log('Darkmode Enabled.');
    } else if (localStorage.getItem('lightmode') === 'light') {
        document.querySelectorAll('*').forEach(element => {element.classList.remove('darkmode')});
        console.log('Lightmode Enabled.');
    }
}
//Response to the light mode/dark mode button being clicked (Not set light mode)
function lightmode() {
    if (localStorage.getItem('lightmode') === 'dark') {
        localStorage.setItem('lightmode', 'auto')
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            if (document.getElementById('darktest').className == 'footer') {
                document.querySelectorAll('*').forEach(Element => {Element.className += " darkmode"});
            }
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            if (document.getElementById('darktest').className == 'footer darkmode') {
                document.querySelectorAll('*').forEach(element => {
                element.classList.remove('darkmode');
                });
            }
        }
        console.log("Auto Change Enabled")
    } else if (localStorage.getItem('lightmode') === 'auto') {
        localStorage.setItem('lightmode', 'light')
    } else if (localStorage.getItem('lightmode') === 'light') {
        localStorage.setItem('lightmode', 'dark')
    }
    darkmode();
    document.getElementById('lightmode').innerHTML = 'Current Mode: ' + localStorage.getItem('lightmode');
}
function showAlert(message) {
    const box = document.createElement("div");
    const content = document.createElement("p");
    const button = document.createElement("button");

    box.id = "customAlert";
    content.id = "alertMessage";
    button.id = "alertClose";

    content.innerText = message;
    button.innerText = "OK";

    button.onclick = () => {
        document.getElementById("customAlert").remove();
    };

    box.append(content, button);
    document.getElementById("main").after(box);
};
window.showAlert = showAlert;
function manageCookies(status) {
    if (status === true) {
        console.log("Cookies Accepted.");
        localStorage.setItem("Cookies", true);
    } else if (status === false) {
        console.log("Cookies Declined.")
        localStorage.setItem("Cookies", false)
    } else {
        console.log(`When calling function manageCookies in script.js, status gave the value: ${status} instead of true or false.`)
    };
    if (document.getElementById("cookies") !== null) {
        document.getElementById("cookies").remove();
    };
}
function addCookiesBar() {
    const textContent = `
        Your perference will be stored until you clear your browser's cache. 
        By clicking accept, you also accept to the `
    const box = document.createElement("div");
    const heading = document.createElement("h2");
    const text = document.createElement("p");
    const privacyLink = document.createElement("a");
    const acceptButton = document.createElement("button");
    const declineButton = document.createElement("button");

    heading.innerText = 'This website uses cookies.';
    text.innerText = textContent;
    privacyLink.innerText = 'privacy policy';
    privacyLink.href = '/privacy.html';
    acceptButton.innerText = 'Accept';
    declineButton.innerText = 'Decline';

    acceptButton.addEventListener('click', () => manageCookies(true));
    declineButton.addEventListener('click', () => manageCookies(false));

    box.id = 'cookies';
    heading.className = 'cookieheading';
    acceptButton.className = 'cookiebutton';
    declineButton.className = 'cookiebutton';

    text.append(privacyLink, '.', document.createElement("br"), acceptButton, declineButton);
    box.append(heading, text);
    document.getElementById("main").after(box);
};
// Initial check (All pages)
if (localStorage.getItem('lightmode') === 'auto' || localStorage.getItem('lightmode') === null) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) { 
        if (document.getElementById('darktest').className == 'footer') {
            document.querySelectorAll('*').forEach(Element => {Element.className += " darkmode"});
            console.log('Darkmode Enabled.');
        }
    } 
    else if (document.getElementById('darktest').className == 'footer darkmode'){
        document.querySelectorAll('*').forEach(element => {
        element.classList.remove('darkmode');
        console.log('Lightmode Enabled.');
        });
    }
    localStorage.setItem('lightmode', 'auto');
} else {
    darkmode();
    console.log(localStorage.getItem('lightmode'))
}
if (document.getElementById('lightmode') !== null) {
    document.getElementById('lightmode').innerHTML = 'Current Mode: ' + localStorage.getItem('lightmode');
};
if (localStorage.getItem('Cookies') == null) {
    addCookiesBar();
};

console.log('Cookies Status: ' + localStorage.getItem('Cookies'))

if (localStorage.getItem("Counter") === null) {
    localStorage.setItem("Counter", 0);
}
let counter = 0
if (document.getElementById("counterDisplay") !== null) {
    document.getElementById("counterDisplay").innerText = localStorage.getItem("Counter");
    counter = Number(localStorage.getItem("Counter"));
    console.log("Counter status:", counter)
}
let commaCounterStatus = false

// Listen for changes if auto
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (localStorage.getItem('lightmode') == 'auto') {
        if (event.matches) {
            if (document.getElementById('darktest').className == 'footer') {
                document.querySelectorAll('*').forEach(Element => {Element.className += " darkmode"});
                console.log('Darkmode Enabled.');
            }
        } else {
        if (document.getElementById('darktest').className == 'footer darkmode') {
            document.querySelectorAll('*').forEach(element => {
            element.classList.remove('darkmode');
            console.log('Lightmode Enabled.')
            });
        }
        }
    }
})
console.log("Initial Code Completed.");