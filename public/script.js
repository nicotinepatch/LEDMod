// ===== ON PAGE LOAD =====
// Fetch the current state from the server AND parse JSON into JS object
const currState = await fetch('/api/state').then(r => r.json()); // Method is GET by default, requires no payload/body

// Update the UI to reflect the current state (at file end for buttons, in relevant sections for rest)
// ========================

// ------ TOGGLE BUTTONS
// Get the button elements
const toggleBtn = document.getElementById('toggle-btn');
const controlBtn = document.getElementById('toggle-btn-control');

// Track the state (true = ON, false = OFF)
let isOn = currState.on;
let webCont = currState.webOverride;

// Add click event listener
toggleBtn.addEventListener('click', function () {
    isOn = !isOn; // Toggle state

    if (isOn) {
        toggleBtn.value = 'ON';
        toggleBtn.classList.add('on');
    } else {
        toggleBtn.value = 'OFF';
        toggleBtn.classList.remove('on');
    }

    // on
    fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ on: isOn })
    });
});

controlBtn.addEventListener('click', function () {
    webCont = !webCont; // Toggle state

    if (webCont) {
        controlBtn.value = 'Web Control';
        controlBtn.classList.add('on');
    } else {
        controlBtn.value = 'Manual Control';
        controlBtn.classList.remove('on');
    }

    // webOveride
    fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webOverride: webCont })
    });
});

// ------ MODE DROP DOWN
const modeVal = document.getElementById('mode');
modeVal.value = currState.mode; // Set initial value based on server state
modeVal.addEventListener('change', function () {
    // mode
    fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: modeVal.value })
    });
});

// ------ SLIDER
const brightness = document.getElementById('brightness');
const label = document.getElementById('slider-label');
brightness.value = currState.brightness; // Set initial value based on server state
label.textContent = brightness.value + '%'; // Set initial label text

brightness.addEventListener('input', () => {
    const value = brightness.value;
    label.textContent = value + '%';

    brightness.style.background = `
        linear-gradient(
            to right,
            rgb(74, 17, 76) ${value}%,
            #ddd ${value}%
        )
    `;

    // brightness
    fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brightness: parseInt(value) })
    });
});

// ------ COLOUR BUTTONS (Preset)
const colMap = {
    "wheat": "0xF5DEB3",
    "white": "0xFFFFFF",
    "red": "0xFF0000",
    "orange": "0xFFA500",
    "yellow": "0xFFFF00",
    "green": "0x008000",
    "blue": "0x0000FF",
    "purple": "0x800080"
};
const colourBtns = document.getElementsByClassName('colour-btn');

for (let i = 0; i < colourBtns.length; i++) {
    colourBtns[i].addEventListener('click', function () {

        for (let j = 0; j < colourBtns.length; j++) {
            colourBtns[j].classList.remove('on');
        }

        this.classList.add('on');

        // Get the colour value
        let colour;
        if (this.querySelector('input[type="color"]')) {
            console.log('Custom colour selected:' + JSON.stringify(this));
            return; // Ignore if it's the custom color picker
        }
        // Preset button, read --preview-color
        colour = getComputedStyle(this).getPropertyValue('--preview-color').trim();
        console.log(`Preset colour selected: ${colour}`);

        // Send to server
        // colour
        fetch('/api/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ colour: colMap[colour] })
        });
    });
}

// ------ COLOUR BUTTONS (Custom)
const colourPicker = document.querySelector('#colourSelect');
colourPicker.addEventListener('input', function () {
    // Remove 'on' from all buttons
    for (let j = 0; j < colourBtns.length; j++) {
        colourBtns[j].classList.remove('on');
    }

    this.parentElement.classList.add('on');

    const colour = this.value; // Always the current picked color

    // colour
    fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colour })
    });
});

const sofiasButt_on = document.getElementById('tiagottaflatass');
const hitLabel = document.getElementById('hitButton-label');
const hitComment = document.getElementById('butt-comment');
const sumHitComment = document.getElementById('totalHitCount');
let hitCount = 0;
let currRed = 0;
let weight = 200;
sofiasButt_on.addEventListener('click', function () {
    hitCount++;
    hitLabel.textContent = "Hit Count: " + JSON.stringify(hitCount);

    hitComment.style.color = "#000000";

    if (hitCount > 0) {
        if (hitCount === 1) sofiasButt_on.value = ":O I'VE BEEN SLAPPED?";
        if (hitCount === 5) sofiasButt_on.value = "😳 WELL WELL WELL...🍑🍑🍑🍑";
        if (hitCount === 10) sofiasButt_on.value = "😵 YOU'RE REALLY SOMETHING ELSE!";
        if (hitCount === 11) sofiasButt_on.value = "🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑";
        sofiasButt_on.value += "🍑";
        sofiasButt_on.classList.add('on');

        if (hitCount % 2 === 0) {
            hitComment.textContent = "THANK YOU"
        } else {
            hitComment.textContent = "AND WHAT ABOUT THE OTHER CHEEK HUH?";
        }
        hitComment.style.fontSize = (hitCount + 4) + "px";
        currRed += 15;
        hitComment.style.color += "#" + currRed.toString(16).toUpperCase().padStart(6, "0");

        weight += 50;
        hitComment.style.weight = JSON.stringify(weight);

        //// Button was hit:
        //// 1. Update total hit counter in server by signalling the hits occurance
        //fetch('/hitCount', {
        //    method: 'POST',
        //    headers: { 'Content-Type': 'application/json' },
        //    body: JSON.stringify({ colour })
        //});

        //// 2. Get the new hit counter value from the server (default fetch method is GET)
        //let newTotal = fetch('/hitCount');

        //// 3. Update value in html
        //sumHitComment.textContent = "Total Lifetime Slaps: " + newTotal;
    }
});

// ====== INIT STATE ON PAGE LOAD (BUTTONS) ======
// Toggle buttons
if (currState.on) toggleBtn.click(); // Simulate a click to set the correct state and UI
if (currState.webOverride) controlBtn.click();

// Colour buttons
let presetSelected = false;
for (let i = 0; i < colourBtns.length; i++) {
    if (currState.colour === colMap[i]) {
        presetSelected = true;
        colourBtns[i].click();
        break;
    }
}
if (!presetSelected) {
    colourPicker.click();
)