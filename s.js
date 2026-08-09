// --- SECURITY / LOGIN LOGIC ---
const validEmpCodes = [
    "17593", "IRC43228", "IRC47318", "IRC48509", "ATI1018", 
    "IRC47232", "IRC9727", "IRC44437", "IR0283", "IRC43478", 
    "IRC49181", "IRC52585", "IRC58435", "IRC28487", "IRC58308", 
    "IRC58309", "IRC0527", "IRC62486", "ASB0159", "IRC63399", 
    "IRC43580", "ASB0197", "IRC66135", "IR0619", "SK"
];

const loginScreen = document.getElementById("loginScreen");
const empCodeInput = document.getElementById("empCodeInput");
const loginError = document.getElementById("loginError");
const mainCard = document.getElementById("mainCard");
const errorVideo = document.getElementById("errorVideo"); // Added video element

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
        // Handle incorrect code
        loginError.style.display = 'block';
        loginCard.classList.add('shake-card');
        
        // Show, position, and play the video
        errorVideo.style.display = 'block';
        errorVideo.style.position = 'fixed';
        errorVideo.style.top = '50%';
        errorVideo.style.left = '50%';
        errorVideo.style.transform = 'translate(-50%, -50%)';
        errorVideo.style.zIndex = '10000'; // Ensures it appears above the login screen
        errorVideo.play();

        setTimeout(() => {
            loginCard.classList.remove('shake-card');
        }, 500);
    }
}