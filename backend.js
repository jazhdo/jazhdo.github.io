// v0.2.2

// Firebase stuff
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, query, orderBy, doc, getDoc, setDoc, where 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase references
// https://firebase.google.com/docs/reference/js/app.md
// https://firebase.google.com/docs/reference/js/firestore_.md
// https://firebase.google.com/docs/reference/js/auth.md

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHm5_zvReOaA6RpttJ1KlIhoONis99MKA",
    authDomain: "jazhdo-backend.firebaseapp.com",
    projectId: "jazhdo-backend",
    storageBucket: "jazhdo-backend.firebasestorage.app",
    messagingSenderId: "535780894340",
    appId: "1:535780894340:web:ca78bc82bbe1ff0a8204d1"
};

// Variables
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function updateProfilePic() {
    document.getElementById('login-link')?.remove();
    const loginLink = document.createElement('a');
    const div = document.createElement('div');
    const p = document.createElement('p');
    loginLink.href = '/settings.html';
    loginLink.id = 'login-link';
    div.id = 'pfp';
    p.textContent = String(localStorage.getItem('pfp-letter') || 'G');
    [
        ['border', `clamp(1px, 0.2vw, 2px) ${localStorage.getItem('pfp-brcolor') || 'black'} solid`],
        ['color', String(localStorage.getItem('pfp-text-color') || 'white')],
        ['backgroundColor', String(localStorage.getItem('pfp-bgcolor') || 'gray')]
    ].forEach(style => { div.style[style[0]] = style[1]; });
    div.append(p);
    loginLink.append(div);
    document.getElementsByClassName('toptitle')[0].after(loginLink);
}
function timestampToDate(ts) {
    if (!ts) {
        console.error("Nothing was provided when timestampToDate was called.");
        return null;
    }
    if (ts.toDate) return ts.toDate();
    if (ts.seconds) return new Date(ts.seconds * 1000 + (ts.nanoseconds || 0) / 1_000_000);
    return null;
}
// Test network status (if website was downloaded offline)
async function networkTest() {
    const response = await fetch('https://jazhdo.pages.dev');
    if (response.ok) return true
    return false
}
async function loadContacts() {
    const snapshot = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
    snapshot.forEach(doc => {
        const box = document.createElement("div");
        const id = document.createElement("h2");
        const time = document.createElement("p");
        const email = document.createElement("p");
        const message = document.createElement("p");

        const createdDate = timestampToDate(doc.data().createdAt);

        id.textContent = "Id: " + doc.id;
        time.textContent = "Date: " + createdDate.toLocaleString(undefined, {
            hour12: false,
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        email.textContent = "Contact Method: " + doc.data()?.contactMethod;
        if (email.textContent === 'Contact Method: undefined') { email.textContent = "Email: " + doc.data().email; }
        message.textContent = doc.data().message;

        box.className = "posts";
        box.style.display = "none";
        box.className += document.getElementById("darktest").classList.contains('darkmode') ? ' darkmode' : '';
        box.append(id, time, email, message);
        document.getElementById("message-bottom").before(box);
    });
}
function redirectToHome() { window.location.href = "/login.html"; }
// Show after logged in on admin page
let showMessages = false;
function showAdminContent() {
    const message = document.createElement("p");
    const showButton = document.createElement("button");
    showButton.textContent = "Show messages";
    showButton.id = "showMessages";
    showButton.onclick = () => {
        if (showMessages === false) {
            document.querySelectorAll(".posts").forEach(e => {
                e.style.display = "";
                document.getElementById("showMessages").innerText = "Hide messages";
            });
            showMessages = true;
        } else if (showMessages === true) {
            document.querySelectorAll(".posts").forEach(e => {
                e.style.display = "none";
                document.getElementById("showMessages").innerText = "Show messages";
            });
            showMessages = false;
        };
    };
    message.textContent = `Welcome.`;
    document.getElementById("message-bottom").before(message, showButton);
    loadContacts();
    document.querySelectorAll(".posts").forEach(e => e.style.display = "");
    document.getElementById("adminTitle").style.display = "";
    document.getElementById("goBack").style.display = "";
    document.getElementById("message-bottom").innerText = "";
}

// Admin page
if (document.getElementById("message-bottom") !== null) {
    onAuthStateChanged(auth, async (user) => {
        if (user !== null) {
            try {
                const adminSnap = await getDoc(doc(db, "admins", user.uid));
                if (adminSnap.exists()) {
                    showAdminContent();
                } else {
                    alert("Access denied: You are not an admin. (If you actually are, ask to be added to the admins file)");
                    redirectToHome();
                };
            } catch(error) {
                window.showAlert(`There was an error getting admin details. Please try again. Error: ${error}`);
            };
        } else {
            alert("Please sign in before continuing.");
            redirectToHome();
        };
    });
};
// Contact page
if (document.getElementById("contactForm") !== null) {
    const method = document.getElementById("contactMethod");
    const message = document.getElementById("contactMessage");
    document.getElementById('contactFormDiv').style.display = '';
    method.value = localStorage.getItem("contactMethod") || "";
    method.addEventListener('input', (e) => localStorage.setItem('contactMethod', e.target.value), console.log('Contact method changed.'));
    message.value = localStorage.getItem("contactMessage") || "";
    message.addEventListener('input', (e) => localStorage.setItem('contactMessage', e.target.value), console.log('Contact message changed.'));
    let currentlyWorking = false;
    document.getElementById("contactForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        if (currentlyWorking === false) {
            currentlyWorking = true;
            // Reset saved values
            localStorage.setItem('contactMethod', '');
            localStorage.setItem('contactMessage', '');

            // Get trimmed values (Whitespace in front & back removed)
            const email = method.value.trim();
            const text = message.value.trim();
            const sentDate = new Date();

            // Prevent blank submissions
            if (!email || !text) {
                window.showAlert("Please fill in both the contact method and message fields before submitting.");
                return;
            };
            
            document.getElementById("contactForm").style.display = "none";
            document.getElementById("contactFormStatus").style.display = "";

            try {
                const record = await addDoc(collection(db, "messages"), {
                    contactMethod: email,
                    message: text,
                    createdAt: sentDate
                });
                window.showAlert("Thank you! Your message was successfully sent. \
                    Here's your message ID for future inquiries: " + record.id);
                document.getElementById("contactForm").reset();
            } catch (error) {
                window.showAlert("There was an error sending the message: ", error, ". \
                    Please try again later or on a different device.");
            };
            document.getElementById("contactForm").style.display = "";
            document.getElementById("contactFormStatus").style.display = "none";
            currentlyWorking = false;
        };
    });
};
onAuthStateChanged(auth, async user => {
    if (user) {
        const userRef = doc(db, 'users', user.uid);
        const usersSnap = await getDoc(userRef);
        const data = usersSnap.data();
        let letter;
        if (data && data.pfp && data.pfp.letter) {
            letter = data.pfp?.letter || usersSnap.data().displayName?.charAt(0).toUpperCase();
        } else letter = user.uid.charAt(0).toUpperCase();
        localStorage.setItem('pfp-letter', letter);
        updateProfilePic();
    }
});
updateProfilePic();