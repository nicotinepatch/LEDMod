const express = require("express");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
    res.send("Express on Vercel is running");
});

app.get("/api/led", (req, res) => {
    res.json({ led: true });
});

module.exports = (req, res) => app(req, res);

//module.exports = app;


//const express = require('express');

//const app = express();

//app.get('/', (req, res) => {
//    res.send('API alive');
//});

//app.get('/led', (req, res) => {
//    res.json({ led: true });
//});

//module.exports = app;

//////////////////////////

//const express = require('express');
//const app = express();
//const bodyParser = require('body-parser');

//app.use(express.static('public')); // serve /public and its contents (HTML, JS, CSS)
//app.use(bodyParser.json());

//// STATE VARIABLES
//let on = false;
//let modeVal = 0;
//let brightnessVal = 50;
//let colourVal = {
//    R: 0,
//    G: 0,
//    B: 0,
//};
//let overrideVal = 0;
//let totalHits = 0;

//// Default route --> Confirm its running
//// app.use runs for EVERY method (and EVERY route by default, default route is always '/' if unspecified)
//// - prefix based: E.g /api will run for /api, /api/led, /api/mode, /api/ANYTHING...
//// app.METHOD (e.g app.get, app.post) runs for the specified method and route (default route is always '/' if unspecified))
//// - NOT prefix based: E.g /api will run for /api ONLY but NOT /api/led, /api/mode, /api/ANYTHING...
//app.get('/', (req, res) => {
//    res.send('Hello! The server is running. Use the API endpoints to control the LED strip.');
//});

//// on/off trigger
//app.post('/led', (req, res) => {
//    if (req.body !== undefined) console.log(JSON.stringify(req.body));
//    if (req.body.led !== undefined) {
//        on = req.body.led;
//        console.log(`Are the lights on? ${on}`);
//        res.json({ status: 'ok', led: on });
//    } else {
//        res.status(400).json({ status: 'error', message: 'No on/off value' });
//    }
//});

//app.get('/led', (req, res) => {
//    res.json({ led: on });
//});

//// mode select
//app.post('/mode', (req, res) => {
//    if (req.body !== undefined) console.log(JSON.stringify(req.body));
//    if (req.body.mode !== undefined) {
//        modeVal = req.body.mode;
//        console.log(`Selected mode: ${modeVal}`);
//        res.json({ status: 'ok', mode: modeVal });
//    } else {
//        res.status(400).json({ status: 'error', message: 'No mode value' });
//    }
//});

//app.get('/mode', (req, res) => {
//    res.json({ mode: modeVal });
//});

//// brightness value
//app.post('/brightness', (req, res) => {
//    if (req.body !== undefined) console.log(JSON.stringify(req.body));
//    if (req.body.brightness !== undefined) {
//        brightnessVal = req.body.brightness;
//        console.log(`Selected brightness: ${brightnessVal}`);
//        res.json({ status: 'ok', brightness: brightnessVal });
//    } else {
//        res.status(400).json({ status: 'error', message: 'No brightness value' });
//    }
//});

//app.get('/brightness', (req, res) => {
//    res.json({ brightness: brightnessVal });
//});

//// colour values
//app.post('/colour', (req, res) => {
//    if (req.body !== undefined) console.log(JSON.stringify(req.body));
//    if (req.body.colour !== undefined) {
//        let hex = req.body.colour;
//        hex = hex.replace(/^#/, '');

//        // Parse the r, g, b components
//        const asInt = parseInt(hex, 16);
//        colourVal.R = (asInt >> 16) & 0xFF;
//        colourVal.G = (asInt >> 8) & 0xFF;
//        colourVal.B = asInt & 0xFF;
//        console.log(`Selected colour: ${colourVal.R} ${colourVal.G} ${colourVal.B}`);
//        res.json({ status: 'ok', colour: colourVal });
//    } else {
//        res.status(400).json({ status: 'error', message: 'No colour value' });
//    }
//});

//app.get('/webOverride', (req, res) => {
//    res.json({ colour: colourVal });
//});

//// override value
//app.post('/webOverride', (req, res) => {
//    if (req.body !== undefined) console.log(JSON.stringify(req.body));
//    if (req.body.webOverride !== undefined) {
//        overrideVal = req.body.webOverride;
//        console.log(`Selected override: ${overrideVal}`);
//        res.json({ status: 'ok', webOverride: overrideVal });
//    } else {
//        res.status(400).json({ status: 'error', message: 'No webOverride value' });
//    }
//});

//app.get('/override', (req, res) => {
//    res.json({ override: overrideVal });
//});

//// EVERYTHING
//app.get("/state", (req, res) => {
//    res.json({
//        led: on,
//        mode: modeVal,
//        brightness: brightnessVal,
//        colour: colourVal,
//        webOverride: overrideVal
//    });
//});

//// TOTAL HITS (FOR FRONT END ONLY)
//app.post('/hitCount', (req, res) => {
//    if (req.body !== undefined) console.log(JSON.stringify(req.body));
//    if (req.body.hit === true) {
//        totalHits++;
//        console.log(`ANOTHER HIT DETECTED: ${totalHits}`);
//        res.json({ status: 'ok', lifetimeHits: totalHits });
//    } else {
//        res.status(400).json({ status: 'error', message: 'No hit occured' });
//    }
//});

//app.get('/hitCount', (req, res) => {
//    res.json({ lifetimeHits: totalHits });
//});

//// For local deployment:
////app.listen(3000, () => {
////    console.log('Server running on http://localhost:3000');
////});

//// For Vercel deployment: wrap as serverless and serve to Vercel:
////module.exports = app;
//const serverless = require('serverless-http');
//module.exports = serverless(app);