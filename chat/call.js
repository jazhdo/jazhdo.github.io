// // Version 1/5/2026

// // Firebase stuff
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { 
//     getFirestore, collection, addDoc, query, orderBy, doc, getDoc, setDoc, arrayUnion, increment, arrayRemove, where, onSnapshot, deleteDoc 
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// import {
//     getAuth, onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// // Firebase references
// // https://firebase.google.com/docs/reference/js/app.md
// // https://firebase.google.com/docs/reference/js/firestore_.md
// // https://firebase.google.com/docs/reference/js/auth.md

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAHm5_zvReOaA6RpttJ1KlIhoONis99MKA",
//     authDomain: "jazhdo-backend.firebaseapp.com",
//     projectId: "jazhdo-backend",
//     storageBucket: "jazhdo-backend.firebasestorage.app",
//     messagingSenderId: "535780894340",
//     appId: "1:535780894340:web:ca78bc82bbe1ff0a8204d1"
// };

// // Variables
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// // Functions
// const openMediaDevices = async (constraints) => {
//     return await navigator.mediaDevices.getUserMedia(constraints);
// };
// function callStart() {
//     try {
//         const stream = openMediaDevices({'video':true,'audio':true});
//         console.log('Got MediaStream:', stream);
//     } catch(error) {
//         console.error('Error accessing media devices.', error);
//     };
// };
// async function getInputs(type) {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     return devices.filter(device => device.kind === type)

//     // const videoCameras = getInputs('videoinput');
//     // concsole.log('Cameras found:', videoCameras);
// }

// onAuthStateChanged(auth, async (user) => {
//     return user;
// });

// // Updates the select element with the provided set of cameras
// function updateCameraList(cameras) {
//     const listElement = document.querySelector('select#availableCameras');
//     listElement.innerHTML = '';
//     cameras.map(camera => {
//         const cameraOption = document.createElement('option');
//         cameraOption.label = camera.label;
//         cameraOption.value = camera.deviceId;
//     }).forEach(cameraOption => listElement.add(cameraOption));
// }

// // Get the initial set of cameras connected
// const videoCameras = getInputs('videoinput');
// updateCameraList(videoCameras);

// // Listen for changes to media devices and update the list accordingly
// navigator.mediaDevices.addEventListener('devicechange', event => {
//     const newCameraList = getInputs('video');
//     updateCameraList(newCameraList);
// });
