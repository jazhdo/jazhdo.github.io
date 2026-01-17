// Version 1/16/2026
function hide(list) { for (let a = 0; a < list.length; a++) { document.querySelectorAll(list[a]).forEach(element => { element.style.display = "none"; }); }; };
function updateCounter(newCounter) {
    showCounter = newCounter;
    if (commaCounterStatus) { showCounter = commaNumber(showCounter) };
    document.getElementById("counterDisplay").innerText = showCounter;
}
function addCounter() {
    counter = Number(counter);
    counter += 1;
    localStorage.setItem("Counter", counter);
    updateCounter(counter);
}
function minusCounter() {
    counter -= 1;
    localStorage.setItem("Counter", counter);
    updateCounter(counter);
}
function resetCounter() {
    counter = 0;
    localStorage.setItem("Counter", 0);
    updateCounter(counter);
}
function commaCounter() {
    if (commaCounterStatus === false) commaCounterStatus = true
    else if (commaCounterStatus === true) commaCounterStatus = false
    else console.log("Variable commaCounterStatus has not given a value that is true or false.");
    showCounter = commaCounterStatus === true? commaNumber(showCounter) : counter;
    document.getElementById("counterDisplay").innerText = showCounter;
}
// Mod is '%'
function flip(number) {
    let a = 0;
    let newNumber = '';
    number = String(number);
    while (a < number.length) {
        newNumber += number[number.length - a - 1];
        a += 1;
    };
    return newNumber
}
function commaNumber(oldNumber) {
    let a = 0;
    let newNumber = '';
    a = 0;
    oldNumber = flip(String(oldNumber));
    while (a < oldNumber.length) {
        if (a%3 == 0 && a != 0) { newNumber += ','; };
        newNumber += oldNumber[a];
        a += 1;
    }
    return flip(newNumber)
}
function disableCounterPreset() {
    if (document.getElementById("counterForm").style.display == "none") {
        document.getElementById("counterSettings").style.display = "";
        document.getElementById("counterForm").style.display = "";
        document.getElementById("disableCounter").innerText = "Click to disable counter settings";
    } else if (document.getElementById("counterForm").style.display == "") {
        document.getElementById("counterSettings").style.display = "none";
        document.getElementById("counterForm").style.display = "none";
        document.getElementById("disableCounter").innerText = "Click to enable counter settings";
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('counterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (document.getElementById('presetCounter').value.length) {
            counter = document.getElementById('presetCounter').value;
            localStorage.setItem("Counter", counter)
            showCounter = localStorage.getItem("Counter");
            if (commaCounterStatus === true) { showCounter = commaNumber(showCounter); };
            document.getElementById("counterDisplay").innerText = showCounter;    
        } else console.log("Entered string is empty. Please enter a number.");
        document.getElementById('counterForm').reset();
    });
});