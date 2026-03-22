// Configuration
let site = 'http://192.168.68.100:3000';
let fps = 60;
let imgElement = undefined;

// Login and get token
async function login(username, password) {
    const res = await fetch(`${site}/camera/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('rpi-cam-token', data.token);
        return data.token;
    }
    throw new Error('Login failed');
}

function logout() { localStorage.removeItem('rpi-cam-token') }
function getToken() { return localStorage.getItem('rpi-cam-token') }
function filename2date(filename) { if (!filename) return 'Error: Missing input'; return new Date(parseInt(filename.match(/\d+/)[0])) }
function config(IMAGE_ELEMENT, FPS = 60, IP = 'http://192.168.68.100:3000') { fps = FPS; imgElement = IMAGE_ELEMENT; site = IP; }

// Load stream into <img> element
function stream() { imgElement.src = `${site}/camera/stream?token=${getToken()}&fps=${fps || 60}` }

// Camera info
async function info() {
    const res = await fetch(`${site}/camera/info`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
    
    if (res.ok) return await res.json();
    throw new Error('Failed to get camera info');
}

// Online status
async function health() {
    const res = await fetch(`${site}/camera/health`);

    if (res.ok) {
        const data = await res.json();
        const rpiDate = new Date(data.timestamp);
        const now = new Date();
        return {
            ip: data.ip,
            userAgent: data.userAgent,
            status: 'online',
            delay: Math.abs(now.getTime() - rpiDate.getTime())
        }
    }
    return { status: 'offline' }
}

// Start recording
async function startRecording() {
    const res = await fetch(`${site}/camera/record/start`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    
    if (res.ok) {
        stream();
        return res.json();
    }
    throw new Error('Failed to start recording');
}

// Stop recording
async function stopRecording() {
    const res = await fetch(`${site}/camera/record/stop`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Fps' : String(fps)
        }
    });
    
    if (res.ok) return res.json();
    throw new Error('Failed to stop recording');
}

// Recordings list
async function getRecordings() {
    const res = await fetch(`${site}/camera/record/list`, { headers: { 'Authorization': `Bearer ${getToken()}` } });
    
    if (res.ok) {
        const data = await res.json();
        return data.recordings;
    }
    throw new Error('Failed to get recordings');
}

// Recording download by opening a new file
function downloadRecording(filename) { window.open(`${site}/camera/record/get/${filename}?token=${getToken()}`, '_blank'); }