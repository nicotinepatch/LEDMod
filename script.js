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
mode.addEventListener('change', function () {
    fetch('mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: modeVal})
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

// ------ COLOUR BUTTONS
const colourBtns = document.getElementsByClassName('colour-btn');

for (let i = 0; i < colourBtns.length; i++) {
    colourBtns[i].addEventListener('click', function () {

        for (let j = 0; j < colourBtns.length; j++) {
            colourBtns[j].classList.remove('on');
        }

        this.classList.add('on');

        // Send this.value to the server
        fetch('/colour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colour: parseInt(this.value) })
      });
    });
}
