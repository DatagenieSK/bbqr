// --- SECURITY / LOGIN LOGIC ---
const validEmpCodes = [
    "17593", "IRC43228", "IRC47318", "IRC48509", "ATI1018", 
    "IRC47232", "IRC9727", "IRC44437", "IR0283", "IRC43478", 
    "IRC49181", "IRC52585", "IRC58435", "IRC28487", "IRC58308", 
    "IRC58309", "IRC0527", "IRC62486", "ASB0159", "IRC63399", 
    "IRC43580", "ASB0197", "IRC66135", "IR0619"
];

const loginScreen = document.getElementById("loginScreen");
const empCodeInput = document.getElementById("empCodeInput");
const loginError = document.getElementById("loginError");
const mainCard = document.getElementById("mainCard");

function checkLogin() {
    const code = empCodeInput.value.trim().toUpperCase();
    const loginCard = loginScreen.querySelector('.card');

    if (validEmpCodes.includes(code)) {
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.style.display = 'none';
            mainCard.style.display = 'block';
            mainCard.style.animation = 'none';
            mainCard.offsetHeight; 
            mainCard.style.animation = null; 
        }, 500);
    } else {
        loginError.style.display = 'block';
        loginCard.classList.add('shake-card');
        setTimeout(() => {
            loginCard.classList.remove('shake-card');
        }, 500);
    }
}

if(empCodeInput) {
    empCodeInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            checkLogin();
        }
    });
}

// DOM Elements
const qrcodeContainer = document.getElementById("qrcode");
const dlBtn = document.getElementById("dlBtn");
const inputField = document.getElementById("textInput");
const historyListEl = document.getElementById("historyList");
const historyContainer = document.getElementById("historyContainer");
const emojiBg = document.getElementById("emojiBg");
const headerTitle = document.getElementById("headerTitle");

// --- AUDIO SYSTEM (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol || 0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playGenSound() { playTone(600, 'sine', 0.1, 0.1); } 
function playDownloadSound() { playTone(1200, 'sine', 0.2, 0.1); }

function playBossSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime;
    
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(60, t);
    osc1.frequency.exponentialRampToValueAtTime(30, t + 2); 
    gain1.gain.setValueAtTime(0.3, t);
    gain1.gain.linearRampToValueAtTime(0, t + 3);
    
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(120, t);
    osc2.frequency.linearRampToValueAtTime(80, t + 1);
    gain2.gain.setValueAtTime(0.1, t);
    gain2.gain.linearRampToValueAtTime(0, t + 2);

    osc1.connect(gain1).connect(audioCtx.destination);
    osc2.connect(gain2).connect(audioCtx.destination);
    
    osc1.start(); osc2.start();
    osc1.stop(t + 3); osc2.stop(t + 3);
}

// --- HISTORY LOGIC ---
var historyData = [];
function addToHistory(code) {
    if (!code) return;
    if (historyData.length > 0 && historyData[0] === code) return;
    historyData.unshift(code);
    if (historyData.length > 5) historyData.pop();
    renderHistory();
}
function renderHistory() {
    if (historyData.length > 0) historyContainer.style.display = "block";
    historyListEl.innerHTML = "";
    historyData.forEach(code => {
        let div = document.createElement("div");
        div.className = "history-item";
        div.innerText = code;
        div.onclick = function() { inputField.value = code; makeQR(code, false); };
        historyListEl.appendChild(div);
    });
}

// --- GENERATOR LOGIC ---
function getRandomDigits(length) {
    let result = '';
    const characters = '0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateRandom(type) {
    let finalCode = "";
    if (type === 'BBNOW') finalCode = "BB" + getRandomDigits(9);
    else if (type === 'MED') finalCode = "PBM-" + getRandomDigits(10);
    else if (type === 'HED') finalCode = "PBHM-" + getRandomDigits(10);
    else if (type === 'LARGE') finalCode = "PBL-" + getRandomDigits(10);
    else if (type === 'SMALL') finalCode = "PBS-" + getRandomDigits(10);
    else if (type === 'SLOT') finalCode = "BN" + getRandomDigits(2) + "-PO01";
    else if (type === 'Gel') finalCode = "PCM-BLU-SM-C" + getRandomDigits(4);
    else if (type === 'IN') finalCode = "GP" + getRandomDigits(2) + "-IN-IBG-E" + getRandomDigits(4);
    else if (type === 'BL') finalCode = "GP" + getRandomDigits(2) + "-KL-BC-A" + getRandomDigits(4);
    else if (type === 'DS') finalCode = "Z-03-E-3";
    else if (type === 'SOFTBIN') finalCode = "SOFT-BIN-FL-0"; 
    else if (type === 'SBIFC') finalCode = "SB-IFC_123456"; 

    inputField.value = finalCode;
    makeQR(finalCode, true);
}

function makeQR(text, saveToHistory) {
    checkEasterEgg(text);
    qrcodeContainer.innerHTML = "";
    if(text) {
        new QRCode(qrcodeContainer, {
            text: text,
            width: 128,
            height: 128,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
        dlBtn.style.display = "block";
        
        if(!text.toLowerCase().includes("boss") && !text.toLowerCase().includes("alauddin")) {
           playGenSound(); 
        }

        if(saveToHistory) addToHistory(text);
    }
}

// --- VOLCANO FIRE PARTICLE SYSTEM ---
const canvas = document.getElementById("fireCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animationId;
let isFireActive = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20; 
        this.vx = (Math.random() - 0.5) * 3; 
        this.vy = Math.random() * 4 + 3; 
        this.size = Math.random() * 8 + 4;
        this.color = `hsl(${Math.random() * 40 + 10}, 100%, 50%)`; 
        this.life = 150;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1; 
        this.size *= 0.98; 
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 100;
        ctx.fill();
    }
}

function initFire() {
    if(isFireActive) return;
    isFireActive = true;
    animateFire();
}

function animateFire() {
    if(!isFireActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter'; 

    if (particles.length < 400) {
        for(let i=0; i<8; i++) particles.push(new Particle());
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0 || particles[i].y > canvas.height + 20) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateFire);
}

// --- EASTER EGG (BOSS MODE) ---
function checkEasterEgg(val) {
    const lower = val.toLowerCase();
    const body = document.body;
    
    if (lower.includes("alauddin") || lower.includes("boss")) {
        if (!body.classList.contains("royal-mode")) {
            body.classList.add("royal-mode");
            mainCard.classList.add("shake-card"); 
            
            emojiBg.innerHTML = `
                <div class="floating-emoji" style="top: 10%; left: 10%;">👑</div>
                <div class="floating-emoji" style="top: 20%; right: 15%;">🌟</div>
                <div class="floating-emoji" style="bottom: 15%; left: 20%;">✨</div>
                <div class="floating-emoji" style="bottom: 30%; right: 10%;">🔥</div>
            `;

            initFire();
            playBossSound();

            setTimeout(() => mainCard.classList.remove("shake-card"), 1000);
        }
    }
}

// --- INPUT HANDLING ---
function formatSmartInput(val) {
    let clean = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if(clean.length < 2) return clean;
    
    let part1 = clean.substring(0, 1);
    let part2 = clean.substring(1, 3);
    let part3 = clean.substring(3, 4);
    let part4 = clean.substring(4);
    
    let formatted = part1;
    if (part2) formatted += "-" + part2;
    if (part3) formatted += "-" + part3;
    if (part4) formatted += "-" + part4;
    return formatted;
}

if(inputField) {
    inputField.addEventListener("input", function() {
        let currentVal = inputField.value;
        let raw = currentVal.replace(/-/g, '');
        
        if (raw.length >= 2) {
            let firstChar = raw.charAt(0);
            let secondChar = raw.charAt(1);
            if (isNaN(firstChar) && !isNaN(secondChar)) {
                let formatted = formatSmartInput(raw);
                if (inputField.value !== formatted) inputField.value = formatted;
            }
        }
        
        if (inputField.value.trim() !== "") {
            makeQR(inputField.value, false); 
        } else {
            qrcodeContainer.innerHTML = '<span style="color:#555; font-size:12px; font-style:italic;">Select a type above to start</span>';
            dlBtn.style.display = "none";
        }
    });

    inputField.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            makeQR(inputField.value, true);
        }
    });
}

function downloadQR() {
    const img = document.querySelector("#qrcode img");
    if (img) {
        playDownloadSound();
        const link = document.createElement("a");
        const fileName = inputField.value.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        link.href = img.src;
        link.download = fileName + ".png";
        link.click();
    }
}
