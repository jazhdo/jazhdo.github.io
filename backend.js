// v0.2.4

// Firebase stuff
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
    let data;
    try {
        data = JSON.parse(atob(localStorage.getItem('pfp')));
    } catch {}
    loginLink.href = '/settings.html';
    loginLink.id = 'login-link';
    div.id = 'pfp';
    p.textContent = String(data?.letter || 'G');
    [
        ['border', `clamp(1px, 0.2vw, 2px) ${data?.border || 'black'} solid`],
        ['color', String(data?.color || 'white')],
        ['backgroundColor', String(data?.background || 'gray')]
    ].forEach(style => { div.style[style[0]] = style[1]; });
    div.append(p);
    loginLink.append(div);
    document.getElementById('toptitle').after(loginLink);
}
window.updatePfp = updateProfilePic;

onAuthStateChanged(auth, async user => {
    if (user) {
        const userRef = doc(db, 'users', user.uid);
        const usersSnap = await getDoc(userRef);
        const data = usersSnap?.data();
        if (!data.pfp) {
            console.log('Running fallback for no profile.');
            console.log(data)
            const fallback = { pfp: { letter: data.displayName?.charAt(0).toUpperCase() || user.uid.charAt(0).toUpperCase(), border: 'black', color: 'white', background: 'gray' } };
            await setDoc(doc(db, 'users', user.uid), fallback, { merge: true });
            localStorage.setItem('pfp', btoa(JSON.stringify(fallback)));
        } else localStorage.setItem('pfp', btoa(JSON.stringify(data.pfp)));
        updateProfilePic();
    }
});
updateProfilePic();