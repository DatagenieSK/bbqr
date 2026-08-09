// =====================================================
// BB QR PRO
// COMPLETE FIXED JAVASCRIPT
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



// =====================================================
// VARIABLES
// =====================================================

let currentQRText = "";


// Get saved history

let history = [];

try {

    history =
        JSON.parse(
            localStorage.getItem(
                "bbQrHistory"
            ) || "[]"
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
// LOGIN FUNCTION
// =====================================================

function checkLogin() {


    // Get employee code

    const code =
        empCodeInput.value
        .trim()
        .toUpperCase();



    // =================================================
    // EMPTY CODE
    // =================================================

    if (!code) {

        showLoginError(
            "Please enter Employee Code."
        );

        return;

    }



    // =================================================
    // CORRECT CODE
    // =================================================

    if (
        validEmpCodes.includes(code)
    ) {


        // Hide error

        loginError.style.display =
            "none";



        // Make sure wrong-code video
        // is hidden

        stopErrorVideo();



        // Fade login screen

        loginScreen.style.opacity =
            "0";



        // Open generator

        setTimeout(function() {


            loginScreen.style.display =
                "none";


            mainCard.style.display =
                "block";


        }, 500);


        return;

    }



    // =================================================
    // WRONG CODE
    // =================================================

    showLoginError(
        "Invalid Employee Code. Try again."
    );


    playErrorVideo();

}



// =====================================================
// SHOW LOGIN ERROR
// =====================================================

function showLoginError(message) {


    loginError.textContent =
        message;


    loginError.style.display =
        "block";



    // Shake login card

    const loginCard =
        loginScreen.querySelector(
            ".card"
        );


    if (loginCard) {


        loginCard.classList.remove(
            "shake-card"
        );


        // Restart animation

        void loginCard.offsetWidth;


        loginCard.classList.add(
            "shake-card"
        );


        setTimeout(function() {

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



    // Show video

    errorVideo.style.display =
        "block";



    // Bring video to front

    errorVideo.style.zIndex =
        "10000";



    // Start from beginning

    try {

        errorVideo.currentTime =
            0;

    } catch (error) {

        console.log(
            "Could not reset video:",
            error
        );

    }



    // Play

    const playPromise =
        errorVideo.play();


    if (
        playPromise !== undefined
    ) {

        playPromise.catch(
            function(error) {

                console.log(
                    "Video playback error:",
                    error
                );

            }
        );

    }



    // Hide when video ends

    errorVideo.onended =
        function() {

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


    errorVideo.style.display =
        "none";


    try {

        errorVideo.currentTime =
            0;

    } catch (error) {

        console.log(error);

    }

}



// =====================================================
// LOGIN BUTTON
// =====================================================

loginBtn.addEventListener(
    "click",
    function() {

        checkLogin();

    }
);



// =====================================================
// ENTER KEY LOGIN
// =====================================================

empCodeInput.addEventListener(
    "keydown",
    function(event) {


        if (
            event.key === "Enter"
        ) {

            checkLogin();

        }

    }
);



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
// GENERATE RANDOM CODE
// =====================================================

function generateRandom(type) {


    let value = "";



    switch (type) {


        // =============================================
        // BB NOW
        // =============================================

        case "BBNOW":

            value =
                "BB" +
                randomDigits(9);

            break;



        // =============================================
        // MEDIUM PBM
        // =============================================

        case "MED":

            value =
                "PBM" +
                randomDigits(10);

            break;



        // =============================================
        // HED
        // =============================================

        case "HED":

            value =
                "PBHM" +
                randomDigits(10);

            break;



        // =============================================
        // SMALL
        // =============================================

        case "SMALL":

            value =
                "PBS" +
                randomDigits(10);

            break;



        // =============================================
        // LARGE
        // =============================================

        case "LARGE":

            value =
                "PBL" +
                randomDigits(10);

            break;



        // =============================================
        // SLOT
        // =============================================

        case "SLOT":

            value =
                "BN" +
                randomDigits(2) +
                "-PO" +
                randomDigits(2);

            break;



        // =============================================
        // GEL PAD
        // =============================================

        case "GEL":

            value =
                "PCM-BLU-" +
                randomDigits(6);

            break;



        // =============================================
        // INSULATED
        // =============================================

        case "IN":

            value =
                "GP-IN-" +
                randomDigits(6);

            break;



        // =============================================
        // BULK
        // =============================================

        case "BL":

            value =
                "GP-KL-" +
                randomDigits(6);

            break;



        // =============================================
        // DISPATCH
        // =============================================

        case "DS":

            value =
                "Z-03-E-3";

            break;



        // =============================================
        // SOFT BIN
        // =============================================

        case "SOFTBIN":

            value =
                "SOFT-BIN-FL-" +
                randomDigits(2);

            break;



        // =============================================
        // SB IFC
        // =============================================

        case "SBIFC":

            value =
                "SB_IFC_" +
                randomDigits(6);

            break;



        // =============================================
        // UNKNOWN TYPE
        // =============================================

        default:

            console.error(
                "Unknown QR type:",
                type
            );

            return;

    }



    // Put code inside input

    textInput.value =
        value;



    // Generate QR

    createQR(value);

}



// =====================================================
// CREATE QR CODE
// =====================================================

function createQR(value) {


    // Empty value

    if (!value) {

        return;

    }



    // =================================================
    // CHECK QR LIBRARY
    // =================================================

    if (
        typeof QRCode === "undefined"
    ) {


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


        console.error(
            "QRCode library is not loaded."
        );


        return;

    }



    // Save current QR text

    currentQRText =
        value;



    // Remove old QR

    qrContainer.innerHTML =
        "";



    // =================================================
    // CREATE QR
    // =================================================

    try {


        new QRCode(

            qrContainer,

            {

                text: value,

                width: 180,

                height: 180,

                colorDark:
                    "#000000",

                colorLight:
                    "#ffffff",

                correctLevel:
                    QRCode.CorrectLevel.H

            }

        );


    } catch (error) {


        console.error(
            "QR generation failed:",
            error
        );


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


        return;

    }



    // Show download button

    downloadBtn.style.display =
        "block";



    // Save history

    addToHistory(value);

}



// =====================================================
// MANUAL TEXT QR
// =====================================================

textInput.addEventListener(
    "keydown",
    function(event) {


        if (
            event.key === "Enter"
        ) {


            const value =
                textInput.value.trim();


            if (value) {

                createQR(value);

            }

        }

    }
);



// =====================================================
// DOWNLOAD QR
// =====================================================

function downloadQR() {


    // Find canvas

    const canvas =
        qrContainer.querySelector(
            "canvas"
        );


    // Find image

    const image =
        qrContainer.querySelector(
            "img"
        );



    // No QR

    if (
        !canvas &&
        !image
    ) {

        alert(
            "Generate a QR code first."
        );

        return;

    }



    // Create download link

    const link =
        document.createElement("a");



    // Canvas available

    if (canvas) {

        link.href =
            canvas.toDataURL(
                "image/png"
            );

    }


    // Image available

    else {

        link.href =
            image.src;

    }



    // File name

    link.download =
        (
            currentQRText ||
            "BB_QR"
        ) + ".png";



    // Trigger download

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

downloadBtn.addEventListener(
    "click",
    function() {

        downloadQR();

    }
);



// =====================================================
// ADD HISTORY
// =====================================================

function addToHistory(value) {


    // Put latest item first

    history = [

        value,

        ...history.filter(
            function(item) {

                return item !== value;

            }
        )

    ].slice(0, 10);



    // Save browser storage

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



    // Update UI

    renderHistory();

}



// =====================================================
// RENDER HISTORY
// =====================================================

function renderHistory() {


    // No history

    if (
        !history.length
    ) {


        historyContainer.style.display =
            "none";


        historyList.innerHTML =
            "";


        return;

    }



    // Show history

    historyContainer.style.display =
        "block";


    historyList.innerHTML =
        "";



    // Create each history item

    history.forEach(
        function(value) {


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            item.textContent =
                value;



            // Click history item

            item.addEventListener(
                "click",
                function() {


                    textInput.value =
                        value;


                    createQR(value);

                }
            );



            historyList.appendChild(
                item
            );

        }
    );

}



// =====================================================
// QR BUTTONS
// =====================================================

document
    .querySelectorAll(
        ".type-btn[data-type]"
    )
    .forEach(
        function(button) {


            button.addEventListener(
                "click",
                function() {


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
// Press R
// =====================================================

document.addEventListener(
    "keydown",
    function(event) {


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
    "QR generator: READY"
);

console.log(
    "Video error system: READY"
);

console.log(
    "================================="
);