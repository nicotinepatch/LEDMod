// ------ TOGGLE BUTTONS
// Get the button elements
const toggleBtn = document.getElementById('toggle-btn');
const controlBtn = document.getElementById('toggle-btn-control');

// Track the state (true = ON, false = OFF)
let isOn = false;
let webCont = false;

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

    fetch('/led', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ led: isOn })
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

    fetch('/webOverride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webOverride: webCont })
    });
});

// ------ MODE DROP DOWN
const modeVal = document.getElementById('mode');
modeVal.addEventListener('change', function () {
    fetch('mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: modeVal.value })
    });
});

// ------ SLIDER
const brightness = document.getElementById('brightness');
const label = document.getElementById('slider-label');

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

    fetch('/brightness', {
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
        fetch('/colour', {
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

    fetch('/colour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colour })
    });
});

const sofiasButt_on = document.getElementById('tiagottaflatass');
const hitLabel = document.getElementById('hitButton-label');
const hitComment = document.getElementById('butt-comment');
let hitCount = 0;
sofiasButt_on.addEventListener('click', function () {
    hitCount++;
    hitLabel.textContent = "Hit Count: " + JSON.stringify(hitCount);

    if (hitCount > 0) {
        if (hitCount === 1) sofiasButt_on.value = ":O I'VE BEEN SLAPPED?";
        if (hitCount === 5) sofiasButt_on.value = "😳 WELL WELL WELL...🍑🍑🍑🍑";
        sofiasButt_on.value += "🍑";
        sofiasButt_on.classList.add('on');

        if (hitCount % 2 === 0) {
            hitComment.textContent = "THANK YOU"
        } else {
            hitComment.textContent = "AND WHAT ABOUT THE OTHER CHEEK HUH?";
        }
        hitComment.style.fontSize++;
        hitComment.style.color += (1 << 5);
    }
});