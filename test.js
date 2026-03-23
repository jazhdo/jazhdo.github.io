// v0.2.2
function hide(list) { for (let a = 0; a < list.length; a++) { document.querySelectorAll(list[a]).forEach(element => { element.style.display = "none"; }); }; };
function updateCounter(newCounter) {
    localStorage.setItem("Counter", newCounter);
    showCounter = newCounter;
    if (commaCounterStatus) { showCounter = commaNumber(showCounter) };
    document.getElementById("counterDisplay").innerText = showCounter;
}
function addCounter() {
    counter = Number(counter);
    counter += 1;
    updateCounter(counter);
}
function minusCounter() {
    counter -= 1;
    updateCounter(counter);
}
function resetCounter() {
    counter = 0;
    updateCounter(counter);
}
function commaCounter() {
    commaCounterStatus = !commaCounterStatus;
    document.getElementById("counterDisplay").innerText = commaCounterStatus ? commaNumber(counter) : counter;
}
function fullScreen(element) {
    element.fullscreenElement ? element.exitFullscreen() : element.requestFullscreen();
}
// Broken for hex (base16) function
function binary2bases(baseNumber, binary) {
    if (!/^[01]+$/.test(binary)) console.error('Error: String must be binary.');
    const list = String(binary).match(new RegExp(`.{1,${Math.log2(baseNumber)}}`, 'g'));
    const base = (baseNumber == '64')?['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/',]:(baseNumber == '16')?['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']:[''];
    let result = "";
    list.forEach((e, i) => {
        if (i == list.length - 1) while (e.length < Math.log2(baseNumber)) e += '0';
        let decimal = 0;
        e.split('').reverse().forEach((a, i) => { decimal += Number(a)*(2**i); });
        result += base[decimal];
    });
    if (baseNumber == '64') while (result.length%4 > 0) result += '=';
    if (baeseNumber == '16') result = '0x' + result;
    return result
}
// Mod is '%'
function flip(number) { return String(number).split('').reverse().join(''); }
function commaNumber(oldNumber) {
    let newNumber = '';
    oldNumber = flip(oldNumber);
    for (let a = 0; a < oldNumber.length; a++) {
        if (a%3 == 0 && a != 0) { newNumber += ','; };
        newNumber += oldNumber[a];
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
function rgb2hex(r, g, b) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    let answer = '#';
    [r, g, b].forEach((e) => {
        let digit1 = Math.floor(e/16);
        let digit2 = e%16;
        console.log(digit1, digit2);
        let return1, return2;
        if (digit1 <= 9) return1 = digit1;
        else if (digit1 > 9 && digit1 <= 15) return1 = letters[digit1 - 10];
        if (digit2 <= 9) return2 = digit2;
        else if (digit2 > 9 && digit2 <= 15) return2 = letters[digit2 - 10];
        answer += return1 + return2;
    });
    return answer;
}
if (!localStorage.getItem("Counter")) localStorage.setItem("Counter", 0);
let counter = Number(localStorage.getItem("Counter"));
document.getElementById("counterDisplay").innerText = counter;
console.log("Counter status:", counter);
let commaCounterStatus = false;
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