// v0.2.5

// Load a script after page loads
function loadScript(url, callback = () => {}) {
    console.log("[Dynamic Script]: Loading " + url);
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onload = callback;
    script.onerror = e => {
        console.log("[Dynamic Script Error]:", e);
    };
    document.head.appendChild(script);
}
// Fetch JSON data
async function getJSON(url) {
    let response = await fetch(url);
    let data = await response.text();
    return JSON.parse(data);
}
// Copy text to clipboard
async function copy(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log(`[Copy]: Copied message: "${text}"`);
    } catch (e) {
        console.log("[Copy Error]:", e);
    }
}
// Ping backend
async function ping(website = "http://104.52.245.221:3000") {
    // Put future ping function here (after clearing up ports and moving nodejs around)
}
// Test if online
async function networkTest() {
    const response = await fetch("https://jazhdo.pages.dev");
    if (response.ok) return true;
    response = await fetch("https://jazhdo.github.io");
    if (response.ok) return true;
    return false;
}
// Check if there are updates
async function checkLastUpdated() {
    const currentVersion = document
        .getElementById("darktest")
        .textContent.match(/v(\d+).(\d+).(\d+)/)
        .slice(1, 4);
    if (!(await networkTest())) {
        console.log("[Version]: Network offline.");
        return;
    }
    let info = await fetch("https://api.github.com/repos/jazhdo/jazhdo.github.io/commits?per_page=1");
    info = await info.text();
    info = JSON.parse(info);
    const latestVersion = info[0].commit.message.match(/v(\d+).(\d+).(\d+)/).slice(1, 4);
    if (currentVersion[0] !== latestVersion[0] || currentVersion[1] !== latestVersion[1] || currentVersion[2] !== latestVersion[2]) {
        let versionReport = "(Latest: v" + latestVersion.join(".") + ", Current: v" + currentVersion.join(".") + ").";
        console.log("[Version]: Outdated " + versionReport);
        alert("Version Outdated. Please hard refresh the page to get the latest content " + versionReport);
    } else {
        console.log("[Version]: Up to date (v" + latestVersion.join(".") + " & v" + currentVersion.join(".") + ").");
    }
}
// Stuff to run after cookies have been accepted
async function afterCookies() {
    // Analytics
    // Possibly add data collection in the future
    const parser = new UAParser();
    const userAgent = parser.getResult();
    const now = new Date();
    console.log(userAgent);
}
// Check and update mode
function updateMode() {
    const mode = getLightmode();
    document.querySelectorAll("*").forEach(e => (mode ? e.classList.remove("darkmode") : e.classList.add("darkmode")));
    console.log("[Lightmode]: Color theme updated to " + (mode ? "light" : "dark") + ".");
}
// Return whether or not lightmode should be used
function getLightmode() {
    let mode = localStorage.getItem("lightmode");
    switch (mode) {
        case "dark":
            return false;
        case "light":
            return true;
        case "auto":
            if (window.matchMedia("(prefers-color-scheme: light)").matches) return true;
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) return false;
            else {
                console.log("[Lightmode Error]: Mode was auto, but no type was detected. Defaulting to light mode.");
                return true;
            }
        default:
            console.error("[Lightmode Error]: localStorage item 'lightmode' returned neither dark, light, or auto. Defaulting to light mode.");
            return true;
    }
}
// Response to the light mode/dark mode button being clicked (Not set light mode)
function lightmode() {
    let mode = localStorage.getItem("lightmode");
    let modes = ["auto", "light", "dark"];
    localStorage.setItem("lightmode", modes[(modes.indexOf(mode) + 1) % 3]);
    updateMode();
    document.getElementById("lightmode").innerHTML = "Current Mode: " + localStorage.getItem("lightmode");
}
// Show a custom alert instead of alert() (non-blocking)
function showAlert(message) {
    const box = document.createElement("div");
    const content = document.createElement("p");
    const button = document.createElement("button");

    box.id = "customAlert";
    content.id = "alertMessage";
    button.id = "alertClose";
    if (!getLightmode()) [box, content, button].forEach(e => (e.className = "darkmode"));

    content.append(message);
    button.innerText = "OK";

    button.addEventListener("click", () => document.getElementById("customAlert").remove());

    box.append(content, button);
    document.getElementById("main").after(box);
}
window.showAlert = showAlert;
// Handle cookie accept/decline
function manageCookies(status) {
    if (status) {
        console.log("Cookies Accepted.");
        loadScript("https://cdn.jsdelivr.net/npm/ua-parser-js/dist/ua-parser.min.js", afterCookies);
        localStorage.setItem("cookies", JSON.stringify({ value: true, time: Date.now() }));
    } else if (status === false) (console.log("Cookies Declined."), localStorage.setItem("cookies", JSON.stringify({ value: false, time: Date.now() })));
    else {
        console.log(`When calling function manageCookies in script.js, status gave the value: ${status} instead of true or false.`);
    }
    document.getElementById("cookies")?.remove();
}
// Show cookies banner
function addCookiesBar() {
    const box = document.createElement("div");
    const heading = document.createElement("h2");
    const text = document.createElement("p");
    const privacyLink = document.createElement("a");
    const acceptButton = document.createElement("button");
    const declineButton = document.createElement("button");

    heading.innerText = "This website uses data storage tools.";
    privacyLink.innerText = "privacy policy";
    privacyLink.href = "/privacy.html";
    acceptButton.innerText = "Accept";
    declineButton.innerText = "Decline";

    acceptButton.addEventListener("click", () => manageCookies(true));
    declineButton.addEventListener("click", () => manageCookies(false));

    box.id = "cookies";
    heading.className = "cookieheading";
    acceptButton.className = "cookiebutton";
    declineButton.className = "cookiebutton";
    if (!getLightmode()) [box, text, heading, acceptButton, declineButton].forEach(e => e.className.add("darkmode"));

    text.append("Accept our ", privacyLink, ", storage tools, and analytics.", document.createElement("br"), acceptButton, declineButton);
    box.append(heading, text);
    document.getElementById("main").after(box);
}

// Initial check (All pages)

// Default localStorage values
Object.entries({ "g.options": '{"exitCorner":"top-left","sort":"none"}', lightmode: "auto" }).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, value);
});
// Lightmode
updateMode();
if (document.getElementById("lightmode")) document.getElementById("lightmode").innerHTML = "Current Mode: " + localStorage.getItem("lightmode");
// Add lightmode button
const lightmodeButton = document.createElement("button");
lightmodeButton.id = "lightmode";
lightmodeButton.className = "footer";
lightmodeButton.textContent = "Current Mode: " + localStorage.getItem("lightmode");
if (!getLightmode()) lightmodeButton.classList.add("darkmode");
document.querySelectorAll('a[href="/terms.html"]')[0].after(lightmodeButton);
document.getElementById("lightmode").addEventListener("click", lightmode);
// Listen for changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("lightmode") == "auto") updateMode();
});
// Cookies Banner
const privacyData = getJSON("/privacy.json");
const cookiesUpdated = new Date(privacyData.newest);
let cookies;
if (!localStorage.getItem("cookies")) addCookiesBar();
else {
    cookies = JSON.parse(localStorage.getItem("cookies"));
    if (cookies.time < cookiesUpdated.getTime()) addCookiesBar();
    if (cookies.value === true) loadScript("https://cdn.jsdelivr.net/npm/ua-parser-js/dist/ua-parser.min.js", afterCookies);
}
console.log("Cookies Status: " + cookies?.value);
// Eruda
if (localStorage.getItem("eruda") == "1") loadScript("https://cdn.jsdelivr.net/npm/eruda", () => eruda.init());
// Check version
checkLastUpdated();

console.log("Initial Code Completed.");
