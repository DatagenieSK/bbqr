// =====================================================
// BB QR PRO
// MERGED + FIXED JAVASCRIPT
// New login system + Old working QR system
// =====================================================


// =====================================================
// VALID EMPLOYEE CODES
// =====================================================

const validEmpCodes = [
    "17593",
    "IRC43228",
    "IRC47318",
    "IRC48509",
    "ATI1018",

    "IRC47232",
    "IRC9727",
    "IRC44437",
    "IR0283",
    "IRC43478",

    "IRC49181",
    "IRC52585",
    "IRC58435",
    "IRC28487",
    "IRC58308",

    "IRC58309",
    "IRC0527",
    "IRC62486",
    "ASB0159",
    "IRC63399",

    "IRC43580",
    "IR0257",
    "ASB0197",
    "IRC66135",
    "IR0619",

    "SK"
];


// =====================================================
// GET ELEMENTS
// =====================================================

const loginScreen =
    document.getElementById("loginScreen");

const empCodeInput =
    document.getElementById("empCodeInput");

const loginError =
    document.getElementById("loginError");

const loginBtn =
    document.getElementById("loginBtn");

const mainCard =
    document.getElementById("mainCard");

const errorVideo =
    document.getElementById("errorVideo");

const textInput =
    document.getElementById("textInput");

const qrContainer =
    document.getElementById("qrcode");

const downloadBtn =
    document.getElementById("dlBtn");

const historyContainer =
    document.getElementById("historyContainer");

const historyList =
    document.getElementById("historyList");


// Old feature elements
const emojiBg =
    document.getElementById("emojiBg");

const headerTitle =
    document.getElementById("headerTitle");

const fireCanvas =
    document.getElementById("fireCanvas");


// =====================================================
// VARIABLES
// =====================================================

let currentQRText = "";


// =====================================================
// HISTORY
// =====================================================

let history = [];

try {

    history =
        JSON.parse(
            localStorage.getItem("bbQrHistory") || "[]"
        );

    if (!Array.isArray(history)) {
        history = [];
    }

} catch (error) {

    console.log(
        "History loading error:",
        error
    );

    history = [];
}


// =====================================================
// LOGIN
// =====================================================

function checkLogin() {

    const code =
        empCodeInput.value
            .trim()
            .toUpperCase();


    // Empty code
    if (!code) {

        showLoginError(
            "Please enter Employee Code."
        );

        return;
    }


    // Valid code
    if (validEmpCodes.includes(code)) {

        loginError.style.display = "none";

        stopErrorVideo();


        // Fade login
        loginScreen.style.opacity = "0";


        setTimeout(function () {

            loginScreen.style.display = "none";

            mainCard.style.display = "block";

            // Restart animation if CSS uses it
            mainCard.style.animation = "none";

            void mainCard.offsetWidth;

            mainCard.style.animation = "";

        }, 500);


        return;
    }


    // Invalid code
    showLoginError(
        "Invalid Employee Code. Try again."
    );

    playErrorVideo();
}


// =====================================================
// SHOW LOGIN ERROR
// =====================================================

function showLoginError(message) {

    if (loginError) {

        loginError.textContent = message;

        loginError.style.display = "block";
    }


    const loginCard =
        loginScreen
            ? loginScreen.querySelector(".card")
            : null;


    if (loginCard) {

        loginCard.classList.remove(
            "shake-card"
        );

        // Restart animation
        void loginCard.offsetWidth;

        loginCard.classList.add(
            "shake-card"
        );

        setTimeout(function () {

            loginCard.classList.remove(
                "shake-card"
            );

        }, 500);
    }
}


// =====================================================
// PLAY WRONG LOGIN VIDEO
// =====================================================

function playErrorVideo() {

    if (!errorVideo) {

        console.error(
            "errorVideo element not found."
        );

        return;
    }


    errorVideo.style.display = "block";

    errorVideo.style.position = "fixed";

    errorVideo.style.top = "50%";

    errorVideo.style.left = "50%";

    errorVideo.style.transform =
        "translate(-50%, -50%)";

    errorVideo.style.zIndex = "10000";


    try {

        errorVideo.currentTime = 0;

    } catch (error) {

        console.log(
            "Could not reset video:",
            error
        );
    }


    const playPromise =
        errorVideo.play();


    if (playPromise !== undefined) {

        playPromise.catch(function (error) {

            console.log(
                "Video playback error:",
                error
            );

        });
    }


    errorVideo.onended =
        function () {

            stopErrorVideo();

        };
}


// =====================================================
// STOP WRONG LOGIN VIDEO
// =====================================================

function stopErrorVideo() {

    if (!errorVideo) {
        return;
    }


    errorVideo.pause();

    errorVideo.style.display = "none";


    try {

        errorVideo.currentTime = 0;

    } catch (error) {

        console.log(error);
    }
}


// =====================================================
// LOGIN BUTTON
// =====================================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        function () {

            checkLogin();

        }
    );
}


// =====================================================
// ENTER KEY LOGIN
// =====================================================

if (empCodeInput) {

    empCodeInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                checkLogin();
            }

        }
    );
}


// =====================================================
// AUDIO SYSTEM
// =====================================================

let audioCtx = null;


function getAudioContext() {

    if (!audioCtx) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        audioCtx =
            new AudioContext();
    }

    return audioCtx;
}


function playTone(
    freq,
    type,
    duration,
    vol
) {

    const ctx =
        getAudioContext();


    if (!ctx) {
        return;
    }


    if (ctx.state === "suspended") {

        ctx.resume().catch(
            function () {}
        );
    }


    try {

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();


        osc.type = type;

        osc.frequency.setValueAtTime(
            freq,
            ctx.currentTime
        );


        gain.gain.setValueAtTime(
            vol || 0.1,
            ctx.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + duration
        );


        osc.connect(gain);

        gain.connect(ctx.destination);


        osc.start();

        osc.stop(
            ctx.currentTime + duration
        );

    } catch (error) {

        console.log(
            "Audio error:",
            error
        );
    }
}


function playGenSound() {

    playTone(
        600,
        "sine",
        0.1,
        0.1
    );
}


function playDownloadSound() {

    playTone(
        1200,
        "sine",
        0.2,
        0.1
    );
}


// =====================================================
// BOSS SOUND
// =====================================================

function playBossSound() {

    const ctx =
        getAudioContext();


    if (!ctx) {
        return;
    }


    if (ctx.state === "suspended") {

        ctx.resume().catch(
            function () {}
        );
    }


    try {

        const t =
            ctx.currentTime;


        const osc1 =
            ctx.createOscillator();

        const gain1 =
            ctx.createGain();


        osc1.type = "sawtooth";

        osc1.frequency.setValueAtTime(
            60,
            t
        );

        osc1.frequency.exponentialRampToValueAtTime(
            30,
            t + 2
        );


        gain1.gain.setValueAtTime(
            0.3,
            t
        );

        gain1.gain.linearRampToValueAtTime(
            0,
            t + 3
        );


        const osc2 =
            ctx.createOscillator();

        const gain2 =
            ctx.createGain();


        osc2.type = "square";

        osc2.frequency.setValueAtTime(
            120,
            t
        );

        osc2.frequency.linearRampToValueAtTime(
            80,
            t + 1
        );


        gain2.gain.setValueAtTime(
            0.1,
            t
        );

        gain2.gain.linearRampToValueAtTime(
            0,
            t + 2
        );


        osc1
            .connect(gain1)
            .connect(ctx.destination);

        osc2
            .connect(gain2)
            .connect(ctx.destination);


        osc1.start();

        osc2.start();


        osc1.stop(t + 3);

        osc2.stop(t + 3);

    } catch (error) {

        console.log(
            "Boss sound error:",
            error
        );
    }
}


// =====================================================
// RANDOM DIGITS
// =====================================================

function randomDigits(length) {

    let result = "";


    for (
        let i = 0;
        i < length;
        i++
    ) {

        result +=
            Math.floor(
                Math.random() * 10
            );
    }


    return result;
}


// =====================================================
// OLD WORKING QR FORMAT
// =====================================================

function generateRandom(type) {

    let finalCode = "";


    switch (type) {

        // =============================================
        // BB NOW
        // =============================================

        case "BBNOW":

            finalCode =
                "BB" +
                randomDigits(9);

            break;


        // =============================================
        // MEDIUM
        // OLD FORMAT
        // =============================================

        case "MED":

            finalCode =
                "PBM-" +
                randomDigits(10);

            break;


        // =============================================
        // HED
        // =============================================

        case "HED":

            finalCode =
                "PBHM-" +
                randomDigits(10);

            break;


        // =============================================
        // SMALL
        // =============================================

        case "SMALL":

            finalCode =
                "PBS-" +
                randomDigits(10);

            break;


        // =============================================
        // LARGE
        // =============================================

        case "LARGE":

            finalCode =
                "PBL-" +
                randomDigits(10);

            break;


        // =============================================
        // SLOT
        // =============================================

        case "SLOT":

            finalCode =
                "BN" +
                randomDigits(2) +
                "-PO01";

            break;


        // =============================================
        // GEL
        // OLD FORMAT
        // =============================================

        case "GEL":

        case "Gel":

            finalCode =
                "PCM-BLU-SM-C" +
                randomDigits(4);

            break;


        // =============================================
        // INSULATED
        // =============================================

        case "IN":

            finalCode =
                "GP" +
                randomDigits(2) +
                "-IN-IBG-E" +
                randomDigits(4);

            break;


        // =============================================
        // BULK
        // =============================================

        case "BL":

            finalCode =
                "GP" +
                randomDigits(2) +
                "-KL-BC-A" +
                randomDigits(4);

            break;


        // =============================================
        // DISPATCH
        // =============================================

        case "DS":

            finalCode =
                "Z-03-E-3";

            break;


        // =============================================
        // SOFT BIN
        // =============================================

        case "SOFTBIN":

            finalCode =
                "SOFT-BIN-FL-0";

            break;


        // =============================================
        // SB IFC
        // =============================================

        case "SBIFC":

            finalCode =
                "SB-IFC_123456";

            break;


        // =============================================
        // UNKNOWN
        // =============================================

        default:

            console.error(
                "Unknown QR type:",
                type
            );

            return;
    }


    // Put generated value in input
    if (textInput) {

        textInput.value =
            finalCode;
    }


    // Generate QR
    createQR(
        finalCode,
        true
    );
}


// =====================================================
// CREATE QR CODE
// =====================================================

function createQR(
    value,
    saveHistory = true
) {

    if (!value) {
        return;
    }


    value =
        String(value).trim();


    // Easter egg
    checkEasterEgg(value);


    // Check QR library
    if (
        typeof QRCode === "undefined"
    ) {

        if (qrContainer) {

            qrContainer.innerHTML = `

                <div
                    style="
                        color:#ff4500;
                        font-size:13px;
                        padding:20px;
                        text-align:center;
                    "
                >

                    <strong>
                        QR Library Not Loaded
                    </strong>

                    <br><br>

                    Please check your internet
                    connection and reload the page.

                </div>

            `;
        }


        console.error(
            "QRCode library is not loaded."
        );

        return;
    }


    currentQRText =
        value;


    // Remove old QR
    if (qrContainer) {

        qrContainer.innerHTML = "";
    }


    // Generate QR
    try {

        new QRCode(
            qrContainer,
            {
                text: value,

                // OLD WORKING SIZE
                width: 128,

                height: 128,

                colorDark: "#000000",

                colorLight: "#ffffff",

                correctLevel:
                    QRCode.CorrectLevel.H
            }
        );

    } catch (error) {

        console.error(
            "QR generation failed:",
            error
        );


        if (qrContainer) {

            qrContainer.innerHTML = `

                <div
                    style="
                        color:#ff4500;
                        padding:20px;
                        font-size:13px;
                    "
                >

                    QR generation failed.

                    <br>

                    Check browser console.

                </div>

            `;
        }

        return;
    }


    // Show download
    if (downloadBtn) {

        downloadBtn.style.display =
            "block";
    }


    // Generation sound
    if (
        !value.toLowerCase().includes("boss") &&
        !value.toLowerCase().includes("alauddin")
    ) {

        playGenSound();
    }


    // Save history
    if (saveHistory) {

        addToHistory(value);
    }
}


// =====================================================
// OLD FUNCTION COMPATIBILITY
// makeQR()
// =====================================================

function makeQR(
    text,
    saveToHistory = false
) {

    createQR(
        text,
        saveToHistory
    );
}


// =====================================================
// MANUAL TEXT QR
// ENTER KEY
// =====================================================

if (textInput) {

    textInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();


                const value =
                    textInput.value.trim();


                if (value) {

                    createQR(
                        value,
                        true
                    );
                }
            }

        }
    );
}


// =====================================================
// SMART INPUT FORMAT
// RESTORED FROM OLD VERSION
// =====================================================

function formatSmartInput(val) {

    const clean =
        val
            .replace(
                /[^a-zA-Z0-9]/g,
                ""
            )
            .toUpperCase();


    if (clean.length < 2) {

        return clean;
    }


    const part1 =
        clean.substring(0, 1);

    const part2 =
        clean.substring(1, 3);

    const part3 =
        clean.substring(3, 4);

    const part4 =
        clean.substring(4);


    let formatted =
        part1;


    if (part2) {

        formatted +=
            "-" + part2;
    }


    if (part3) {

        formatted +=
            "-" + part3;
    }


    if (part4) {

        formatted +=
            "-" + part4;
    }


    return formatted;
}


// =====================================================
// INPUT HANDLING
// =====================================================

if (textInput) {

    textInput.addEventListener(
        "input",
        function () {

            const currentVal =
                textInput.value;


            const raw =
                currentVal.replace(
                    /-/g,
                    ""
                );


            /*
             * Smart formatting only for
             * old-style mixed codes.
             *
             * Do not aggressively modify
             * known QR formats.
             */

            if (
                raw.length >= 2 &&
                /^[A-Za-z][0-9]/.test(raw)
            ) {

                const formatted =
                    formatSmartInput(raw);


                if (
                    textInput.value !==
                    formatted
                ) {

                    textInput.value =
                        formatted;
                }
            }


            /*
             * Automatic QR generation
             * restored from old version.
             */

            if (
                textInput.value.trim() !== ""
            ) {

                createQR(
                    textInput.value,
                    false
                );

            } else {

                if (qrContainer) {

                    qrContainer.innerHTML = `
                        <span
                            style="
                                color:#555;
                                font-size:12px;
                                font-style:italic;
                            "
                        >
                            Select a type above to start
                        </span>
                    `;
                }


                if (downloadBtn) {

                    downloadBtn.style.display =
                        "none";
                }
            }

        }
    );
}


// =====================================================
// DOWNLOAD QR
// =====================================================

function downloadQR() {

    if (!qrContainer) {
        return;
    }


    const canvas =
        qrContainer.querySelector(
            "canvas"
        );


    const image =
        qrContainer.querySelector(
            "img"
        );


    if (!canvas && !image) {

        alert(
            "Generate a QR code first."
        );

        return;
    }


    // Download sound
    playDownloadSound();


    const link =
        document.createElement("a");


    if (canvas) {

        try {

            link.href =
                canvas.toDataURL(
                    "image/png"
                );

        } catch (error) {

            console.error(
                "Canvas download error:",
                error
            );

            return;
        }

    } else {

        link.href =
            image.src;
    }


    // Old filename style
    const fileName =
        (
            currentQRText ||
            "BB_QR"
        )
            .replace(
                /[^a-z0-9]/gi,
                "_"
            )
            .substring(
                0,
                50
            );


    link.download =
        fileName + ".png";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );
}


// =====================================================
// DOWNLOAD BUTTON
// =====================================================

if (downloadBtn) {

    downloadBtn.addEventListener(
        "click",
        function () {

            downloadQR();

        }
    );
}


// =====================================================
// HISTORY
// =====================================================

function addToHistory(value) {

    if (!value) {
        return;
    }


    // Latest first
    history = [

        value,

        ...history.filter(
            function (item) {

                return item !== value;

            }
        )

    ].slice(
        0,
        10
    );


    // Save
    try {

        localStorage.setItem(
            "bbQrHistory",
            JSON.stringify(history)
        );

    } catch (error) {

        console.log(
            "Could not save history:",
            error
        );
    }


    renderHistory();
}


// =====================================================
// RENDER HISTORY
// =====================================================

function renderHistory() {

    if (
        !historyContainer ||
        !historyList
    ) {
        return;
    }


    if (!history.length) {

        historyContainer.style.display =
            "none";

        historyList.innerHTML =
            "";

        return;
    }


    historyContainer.style.display =
        "block";


    historyList.innerHTML =
        "";


    history.forEach(
        function (value) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            item.textContent =
                value;


            item.addEventListener(
                "click",
                function () {

                    if (textInput) {

                        textInput.value =
                            value;
                    }


                    createQR(
                        value,
                        false
                    );

                }
            );


            historyList.appendChild(
                item
            );

        }
    );
}


// =====================================================
// QR TYPE BUTTONS
// =====================================================

document
    .querySelectorAll(
        ".type-btn[data-type]"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const type =
                        button.dataset.type;


                    generateRandom(
                        type
                    );

                }
            );

        }
    );


// =====================================================
// ROYAL MODE
// PRESS R
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key.toLowerCase() === "r" &&
            ![
                "INPUT",
                "TEXTAREA"
            ].includes(
                document.activeElement.tagName
            )
        ) {

            document.body.classList.toggle(
                "royal-mode"
            );

        }

    }
);


// =====================================================
// VOLCANO FIRE PARTICLE SYSTEM
// RESTORED FROM OLD VERSION
// =====================================================

let particles = [];

let animationId = null;

let isFireActive = false;

let fireCtx = null;


if (fireCanvas) {

    fireCtx =
        fireCanvas.getContext("2d");
}


function resizeCanvas() {

    if (!fireCanvas) {
        return;
    }


    fireCanvas.width =
        window.innerWidth;


    fireCanvas.height =
        window.innerHeight;
}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();


// =====================================================
// PARTICLE
// =====================================================

class Particle {

    constructor() {

        this.x =
            Math.random() *
            fireCanvas.width;


        this.y = -20;


        this.vx =
            (Math.random() - 0.5) *
            3;


        this.vy =
            Math.random() * 4 +
            3;


        this.size =
            Math.random() * 8 +
            4;


        this.color =
            `hsl(${Math.random() * 40 + 10}, 100%, 50%)`;


        this.life = 150;
    }


    update() {

        this.x +=
            this.vx;


        this.y +=
            this.vy;


        this.life -= 1;


        this.size *=
            0.98;
    }


    draw() {

        if (!fireCtx) {
            return;
        }


        fireCtx.beginPath();


        fireCtx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );


        fireCtx.fillStyle =
            this.color;


        fireCtx.globalAlpha =
            this.life / 100;


        fireCtx.fill();
    }
}


// =====================================================
// INIT FIRE
// =====================================================

function initFire() {

    if (
        !fireCanvas ||
        !fireCtx
    ) {

        return;
    }


    if (isFireActive) {
        return;
    }


    isFireActive =
        true;


    animateFire();
}


// =====================================================
// ANIMATE FIRE
// =====================================================

function animateFire() {

    if (
        !isFireActive ||
        !fireCanvas ||
        !fireCtx
    ) {

        return;
    }


    fireCtx.clearRect(
        0,
        0,
        fireCanvas.width,
        fireCanvas.height
    );


    fireCtx.globalCompositeOperation =
        "lighter";


    if (
        particles.length < 400
    ) {

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            particles.push(
                new Particle()
            );
        }
    }


    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        particles[i].update();

        particles[i].draw();


        if (
            particles[i].life <= 0 ||
            particles[i].y >
            fireCanvas.height + 20
        ) {

            particles.splice(
                i,
                1
            );

            i--;
        }
    }


    animationId =
        requestAnimationFrame(
            animateFire
        );
}


// =====================================================
// EASTER EGG / BOSS MODE
// =====================================================

function checkEasterEgg(value) {

    if (!value) {
        return;
    }


    const lower =
        value.toLowerCase();


    const body =
        document.body;


    if (
        lower.includes("alauddin") ||
        lower.includes("boss")
    ) {

        if (
            !body.classList.contains(
                "royal-mode"
            )
        ) {

            body.classList.add(
                "royal-mode"
            );


            if (mainCard) {

                mainCard.classList.add(
                    "shake-card"
                );
            }


            // Emoji background
            if (emojiBg) {

                emojiBg.innerHTML = `

                    <div
                        class="floating-emoji"
                        style="
                            top:10%;
                            left:10%;
                        "
                    >
                        👑
                    </div>

                    <div
                        class="floating-emoji"
                        style="
                            top:20%;
                            right:15%;
                        "
                    >
                        🌟
                    </div>

                    <div
                        class="floating-emoji"
                        style="
                            bottom:15%;
                            left:20%;
                        "
                    >
                        ✨
                    </div>

                    <div
                        class="floating-emoji"
                        style="
                            bottom:30%;
                            right:10%;
                        "
                    >
                        🔥
                    </div>

                `;
            }


            // Fire
            initFire();


            // Boss sound
            playBossSound();


            if (mainCard) {

                setTimeout(
                    function () {

                        mainCard.classList.remove(
                            "shake-card"
                        );

                    },
                    1000
                );
            }
        }
    }
}


// =====================================================
// INITIALIZE HISTORY
// =====================================================

renderHistory();


// =====================================================
// DEBUG
// =====================================================

console.log(
    "================================="
);

console.log(
    "BB QR PRO LOADED"
);

console.log(
    "Login system: READY"
);

console.log(
    "Old QR formats: RESTORED"
);

console.log(
    "QR generator: READY"
);

console.log(
    "Audio system: READY"
);

console.log(
    "Royal mode: READY"
);

console.log(
    "Fire system: READY"
);

console.log(
    "Video error system: READY"
);

console.log(
    "================================="
);
