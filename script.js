// Version 1/16/2026

// Load a script after page loads
function loadScript(url, callback = () => {}) {
    console.log('Loading script ' + url + '...')
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onload = () => { callback(); };
    script.onerror = (e) => { console.log('Loading script ' + url + ' encountered error: ' + e) };
    document.head.appendChild(script);
}
async function getJSON(url) {
    let response = await fetch(url);
    let data = await response.text();
    return JSON.parse(data);
}
async function getLastUpdated() {
    const info = await fetch("https://api.github.com/repos/jazhdo/jazhdo.github.io/commits?per_page=1");
    info = await info.text();
    info = JSON.parse(info);
    const lastUpdated = info.commit.author.date;
    localStorage.setItem("lastUpdated", JSON.stringify([lastUpdated, Date.now()]));
}
// Stuff to run after cookies have been accepted
async function afterCookies() {
    const parser = new UAParser();
    const userAgent = parser.getResult();
    console.log(userAgent)
}
// Check and update mode (Not set dark mode)
function updateMode() {
    let mode = localStorage.getItem('lightmode');
    document.querySelectorAll('*').forEach(element => (mode == 'dark')?element.classList += " darkmode":(mode == 'light')?element.classList.remove('darkmode'):null);
}
// Response to the light mode/dark mode button being clicked (Not set light mode)
function lightmode() {
    if (localStorage.getItem('lightmode') === 'dark') {
        localStorage.setItem('lightmode', 'auto')
        if (window.matchMedia("(prefers-color-scheme: dark)").matches && document.getElementById('darktest').className == 'footer') document.querySelectorAll('*').forEach(element => element.classList += " darkmode")
        else if (window.matchMedia("(prefers-color-scheme: light)").matches && document.getElementById('darktest').className == 'footer darkmode') { document.querySelectorAll('*').forEach(e => e.classList.remove('darkmode')); };
        console.log("Auto Change Enabled");
    } else localStorage.setItem('lightmode', localStorage.getItem('lightmode') === 'auto' ? 'light' : localStorage.getItem('lightmode') === 'light' ? 'dark' : '');
    updateMode();
    document.getElementById('lightmode').innerHTML = 'Current Mode: ' + localStorage.getItem('lightmode');
}
function showAlert(message) {
    const box = document.createElement("div");
    const content = document.createElement("p");
    const button = document.createElement("button");

    box.id = "customAlert";
    content.id = "alertMessage";
    button.id = "alertClose";
    [box, content, button].forEach((e) => e.className += document.getElementById('darktest').className == 'footer darkmode' ? " darkmode" : '');

    content.append(message);
    button.innerText = "OK";

    button.onclick = () => document.getElementById("customAlert").remove();

    box.append(content, button);
    document.getElementById("main").after(box);
};
window.showAlert = showAlert;
function manageCookies(status) {
    if (status) {
        console.log("Cookies Accepted.");
        loadScript('https://cdn.jsdelivr.net/npm/ua-parser-js/dist/ua-parser.min.js', afterCookies);
        localStorage.setItem("cookies", JSON.stringify({ value: true, time: Date.now() }))
    } else if (status === false) console.log("Cookies Declined."), localStorage.setItem("cookies", JSON.stringify({ value: false, time: Date.now() }));
    else { console.log(`When calling function manageCookies in script.js, status gave the value: ${status} instead of true or false.`); };
    document.getElementById("cookies")?.remove();
};
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
    if (document.getElementById('darktest').className == 'footer darkmode') [box, text, heading, acceptButton, declineButton].forEach((e) => e.className += " darkmode");

    text.append(privacyLink, '.', document.createElement("br"), acceptButton, declineButton);
    box.append(heading, text);
    document.getElementById("main").after(box);
};

const cookiesUpdated = 1769904000000;

// Initial check (All pages)

// Lightmode
if (!localStorage.getItem('lightmode')) localStorage.setItem('lightmode', 'auto');
if (localStorage.getItem('lightmode') === 'auto') {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {document.querySelectorAll('*').forEach(e => e.className += " darkmode"); console.log('Darkmode Enabled.')}
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) {document.querySelectorAll('*').forEach(e => e.classList.remove('darkmode')); console.log('Lightmode Enabled.')};
} else updateMode();
console.log('Current Mode:', localStorage.getItem('lightmode'));
if (document.getElementById('lightmode')) document.getElementById('lightmode').innerHTML = 'Current Mode: ' + localStorage.getItem('lightmode');
// Add lightmode button
const footerElements = [...document.getElementsByClassName("footer")];
const termsLink = footerElements[footerElements.length - 1];
const lightmodeButton = document.createElement('button');

lightmodeButton.id = 'lightmode';
lightmodeButton.className = 'footer';
lightmodeButton.textContent = 'Current Mode: ' + localStorage.getItem('lightmode');
lightmodeButton.classList += document.getElementById('darktest').className == 'footer darkmode'?' darkmode':'';

termsLink.after(lightmodeButton);
document.getElementById('lightmode').addEventListener('click', lightmode);
// Listen for changes if auto
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    if (localStorage.getItem('lightmode') == 'auto') {
        if (event.matches && document.getElementById('darktest').className == 'footer') document.querySelectorAll('*').forEach(Element => {Element.className += " darkmode"}), console.log('Darkmode Enabled.');
        else if (document.getElementById('darktest').className == 'footer darkmode') document.querySelectorAll('*').forEach(element => element.classList.remove('darkmode'), console.log('Lightmode Enabled.'));
    }
})
// Cookies
let cookies;
if (!localStorage.getItem('cookies')) addCookiesBar()
else {
    cookies = JSON.parse(localStorage.getItem('cookies'));
    if (cookies.time < cookiesUpdated) addCookiesBar();
    if (cookies.value === true) loadScript('https://cdn.jsdelivr.net/npm/ua-parser-js/dist/ua-parser.min.js', afterCookies);
}
console.log(`Cookies Status: ${cookies ? cookies.value : undefined}`);
// Counter (test page)
if (!localStorage.getItem("Counter")) localStorage.setItem("Counter", 0);
let counter = 0;
if (document.getElementById("counterDisplay")) {
    document.getElementById("counterDisplay").innerText = localStorage.getItem("Counter");
    counter = localStorage.getItem("Counter");
    console.log("Counter status:", counter);
};
let commaCounterStatus = false;
// Dynamic get last updated
if (!localStorage.getItem("lastUpdated") || JSON.parse(localStorage.getItem('lastUpdated'))[1] >= 604800000) getLastUpdated();

console.log("Initial Code Completed.");