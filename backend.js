// Version 12/12/2025

// Firebase stuff
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHm5_zvReOaA6RpttJ1KlIhoONis99MKA",
    authDomain: "jazhdo-backend.firebaseapp.com",
    projectId: "jazhdo-backend",
    storageBucket: "jazhdo-backend.firebasestorage.app",
    messagingSenderId: "535780894340",
    appId: "1:535780894340:web:ca78bc82bbe1ff0a8204d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Check if the form is submitted
if (document.getElementById("contactForm") !== null) {
    document.getElementById("contactForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get trimmed values
        const email = document.getElementById("contactEmail").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        // Prevent blank submissions
        if (!email || !message) {
            window.showAlert("Please fill in both the email and message fields before submitting.");
            return; // Stop the submission
        }
        try {
            await addDoc(collection(db, "messages"), {
                email: email,
                message: message,
                createdAt: new Date()
            });
            console.log("Thank you! Your message has been sent.");
            document.getElementById("contactForm").reset();
        } catch (error) {
            console.error("Error saving message:", error);
            alert("Oops! Something went wrong.");
        }
    });
}