function updateStatus(data) {
    document.getElementById('radiationLevel').textContent = data.outside.radiationLevel + '%';
    document.getElementById('zombieActivity').textContent = data.outside.zombieActivity;
    document.getElementById('temperature').textContent = data.outside.temperature + '°C';

    document.getElementById('water').textContent = data.inside.water + '%';
    document.getElementById('food').textContent = data.inside.food + '%';
    document.getElementById('power').textContent = data.inside.power + '%';

    document.getElementById('event').textContent = data.event;

    const timestamp = new Date(data.timestamp);
    document.getElementById('timestamp').textContent = timestamp.toLocaleTimeString();
}

async function fetchStatus() {
    try {
        const response = await fetch('/application/api/status');
        const data = await response.json();
        updateStatus(data);
    } catch (error) {
        console.error('Error fetching status:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchStatus();
    setInterval(fetchStatus, 5000);
});
