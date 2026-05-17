const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static('public'));

let activeAlerts = [];
let profiles = [];

// API: Register User Safety Profile
app.post('/api/register', (req, res) => {
    profiles.push({ id: Date.now(), ...req.body });
    console.log(`👤 Profile Created: ${req.body.fullName}`);
    res.status(200).json({ status: "Success" });
});

// API: SOS Trigger
app.post('/api/sos', (req, res) => {
    const { userName, location } = req.body;
    activeAlerts.push({ id: Date.now(), userName, location });
    console.log(`🚨 SOS Broadcas: ${userName} at ${location.lat}, ${location.lng}`);
    res.json({ message: "SOS Broadcasted!", respondersNotified: 5 });
});

app.listen(PORT, () => console.log(`Safety Server: http://localhost:${PORT}`));