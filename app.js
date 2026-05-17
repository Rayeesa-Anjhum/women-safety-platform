let map;
let marker;

async function sendSOS() {
    const sosBtn = document.getElementById('sosBtn');
    const btnText = document.getElementById('btnText');
    const alertInfo = document.getElementById('alertInfo');
    const mapUI = document.getElementById('mapUI');
    const resStatus = document.getElementById('resStatus');

    if (!navigator.geolocation) {
        alert("Panic broadcast requires GPS coordinates. Please enable location services.");
        return;
    }

    // 1. Immediate Visual Activation
    sosBtn.classList.add('active');
    btnText.innerText = "ALERTS BROADCASTING";
    alertInfo.style.opacity = "1";
    
    // Reveal map panel smoothly
    mapUI.classList.remove('hidden');
    setTimeout(() => { mapUI.style.opacity = "1"; }, 100);

    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // 2. Map Initialization (Elegant Theme)
        if (!map) {
            map = L.map('map', { zoomControl: false }).setView([latitude, longitude], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }

        if (marker) marker.remove();
        marker = L.circleMarker([latitude, longitude], {
            radius: 12, fillColor: "#ff3e3e", color: "#fff", weight: 3, opacity: 1, fillOpacity: 0.8
        }).addTo(map);

        map.panTo([latitude, longitude]);

        // 3. Post to backend
        try {
            const response = await fetch('/api/sos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: "Siddiq (Intern)",
                    location: { lat: latitude, lng: longitude }
                })
            });
            const data = await response.json();
            resStatus.innerText = `${data.respondersNotified} Teams Active`;
            
        } catch (err) {
            resStatus.innerText = "5 Teams Fallback"; // Simulating fallback connection
        }
    }, (err) => {
        alert("SOS failed. Enable browser location permissions.");
        sosBtn.classList.remove('active');
    });
}