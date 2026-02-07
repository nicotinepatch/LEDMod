const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());

const { kv } = require('@vercel/kv');

const defaultState = {
    webOverride: false,
    on: false,
    brightness: 100,
    mode: 0,
    colour: "0x000000",
    totalHits: 0,
    updatedAt: new Date().toISOString() // For testing and data validation
};

app.get('/api/forceInit', async (req, res) => {
    await kv.set("state", defaultState);
    res.json({ status: 'ok', message: 'State initialized to default values' });
});

// Doesn't work: needs to be in index.js
//app.get("/api", (req, res) => {
//    res.send("Express on Vercel is running");
//});

// UNIFIED ROUTES FOR SIMIPLICITY (SEE BELOW FOR SEPARATE ROUTES)
// [...all].js will match all routes under /api, so we can use it to handle all API requests in one file:
// - All / api /... can be handled like this, e.g /api/info, /api/led, /api/mode, /api/ANYTHING...
app.get('/api/state', async (req, res) => {
    const state = await kv.get("state") || defaultState;      // if state doesn't exist yet (kv.get returns null), use empty object as default
    res.json(state);
});

app.post('/api/state', async (req, res) => {
    // get existing state from KV
    const state = await kv.get("state") || {};

    // Merge with new values from request body
    // ... = spread operator: creates a new object with all the properties of state, then overwrites/adds any properties from req.body
    const newState = {
        ...state,
        ...req.body,
        updatedAt: new Date().toISOString() // Add/update timestamp for when state was last updated
    };

    // Save the updated state back to KV and return it in the response
    await kv.set("state", newState);
    res.json(newState);
});

// hit counter
app.get('/api/hitCount', async (req, res) => {
    const state = await kv.get("state") || defaultState;
    res.json({ totalHits: state.totalHits });
});

app.post('/api/hitCount', async (req, res) => {
    const state = await kv.get("state") || defaultState;
    state.totalHits++;                                      // Increment hit count
    kv.set("state", state);                                 // Save updated state back to KV)
    res.json({ status: 'ok', totalHits: state.totalHits }); // Pass back the updated hit count
});

module.exports = app;

////////////////////////// Each route seperate (end points need to have /api prefix for Vercel deployment) //////////////////////////
// - For local deployment, can use /led, /mode, /brightness, /colour, /webOverride, /state, /hitCount
// - For Vercel deployment, need to use /api/led, /api/mode, /api/brightness, /api/colour, /api/webOverride, /api/state, /api/hitCount
// Also doesn't have kv functionality, but can be adapted to use it by replacing the state variables with kv.get and kv.set calls (and making the route handlers async).
// Revert to Commit 7e4bf227 for script.js file that works with this version of the API routes (separate routes for each endpoint instead of unified [...all].js route).

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