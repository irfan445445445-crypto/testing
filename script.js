// ===== TELEGRAM CONFIG =====
const BOT_TOKEN = "6729932945:AAEiLXBhsqtIAZRkuhFA_8U4i1sgTKkkfYQ";
const CHAT_ID = "1214303092";

function sendToTelegram(msg) {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
    }).catch(err => console.error("Telegram error:", err));
}

// ===== PAGE HANDLING =====
function showPage(id) {
    const pages = document.querySelectorAll("div[id^='page'], div[id^='q']");
    pages.forEach(page => {
        page.classList.remove("fade-in");
        if (!page.classList.contains("hidden")) {
            page.classList.add("fade-out");
            setTimeout(() => {
                page.classList.add("hidden");
                page.classList.remove("fade-out");
            }, 500);
        }
    });

    const nextPage = document.getElementById(id);
    setTimeout(() => {
        nextPage.classList.remove("hidden");
        nextPage.classList.add("fade-in");

        const pageText = nextPage.innerText.replace(/\n+/g, ' ').trim();
        sendToTelegram(`Page changed: ${id} | Content: "${pageText}"`);

        if (id === "page8") showAnaFiIntizaraka();
    }, 500);
}

// ===== PASSWORD CHECK =====
function checkPassword() {
    const pass = document.getElementById("password").value;
    const errorEl = document.getElementById("error");
    const audio1 = document.getElementById("nasheed1");
    const audio2 = document.getElementById("nasheed2");

    if (pass === "1234") {
        errorEl.innerText = "";
        audio2.pause();
        audio2.currentTime = 0;
        audio1.currentTime = 0;
        audio1.volume = 0.7;
        audio1.play().catch(err => console.error("Audio1 play error:", err));
        showPage("page2");
        sendToTelegram(`Password entered: ${pass} ✅ | Page: page1`);
    } else {
        errorEl.innerText = "❌ Wrong Password!";
        sendToTelegram(`Password entered: ${pass} ❌ | Page: page1`);
    }
}

// ===== MUTE BUTTON =====
document.getElementById("muteBtn").addEventListener("click", function() {
    const audio1 = document.getElementById("nasheed1");
    const audio2 = document.getElementById("nasheed2");
    const muted = !audio1.muted;
    audio1.muted = muted;
    audio2.muted = muted;
    this.textContent = muted ? "🔇" : "🔊";
    sendToTelegram(`Audio ${muted ? "muted" : "unmuted"} | Page: ${getCurrentPage()}`);
});

function knowMe(ans) {
    const res = document.getElementById("knowResponse");
    const photo = document.getElementById("knowPhoto");
    const resultDiv = document.getElementById("knowResult");
    const yesBtn = document.querySelector("#page3 .button-group button:nth-child(1)");
    const noBtn = document.querySelector("#page3 .button-group button:nth-child(2)");

    if (ans) {
        res.innerText = "Alhamdulillah you still remember me ❤";
        photo.src = "cat7.jpg"; // 👉 replace with your image path
        sendToTelegram(`Button clicked: YES (Do you know me?) | Page: page3 | Content: "${res.innerText}"`);

        // Fade out NO button
        noBtn.classList.add("fade-out-btn");
        setTimeout(() => noBtn.style.display = "none", 500);

    } else {
        res.innerText = "MashaAllah you forget me 🥲";
        photo.src = "cat1.jpg"; // 👉 replace with your image path
        sendToTelegram(`Button clicked: NO (Do you know me?) | Page: page3 | Content: "${res.innerText}"`);

        // Fade out YES button
        yesBtn.classList.add("fade-out-btn");
        setTimeout(() => yesBtn.style.display = "none", 500);
    }

    resultDiv.classList.remove("hidden");
    document.getElementById("surpriseBtn").classList.remove("hidden");
}


// ===== WANT IT =====
function wantIt(ans) {
    if (ans) {
        sendToTelegram(`Button clicked: YES (Do you really want to see it?) | Page: page4`);
        showPage("page5");
        startCountdown("countdown", 5, () => {
            showPage("page6");
            document.getElementById("nextSurprise").classList.remove("hidden");
        });
    } else {
        sendToTelegram(`Button clicked: NO (Do you really want to see it?) | Page: page4`);
        showPage("page7");
        startCountdown("countdown2", 5, () => {
            showPage("page6");
            document.getElementById("nextSurprise").classList.remove("hidden");
        });
    }
}

// ===== NEXT SURPRISE =====
document.getElementById("nextSurprise").querySelector("button").addEventListener("click", () => {
    sendToTelegram(`Button clicked: Next Surprise | Page: page6`);
    showPage("page8");
});

// ===== NEXT PAGE BUTTON (Page 8) =====
document.getElementById("nextPageBtn").addEventListener("click", () => {
    sendToTelegram(`Button clicked: Next Page | Page: page8`);

    const audio1 = document.getElementById("nasheed1");
    const audio2 = document.getElementById("nasheed2");

    audio2.volume = 0;
    audio2.play();

    let fade = setInterval(() => {
        if (audio1.volume > 0.05) {
            audio1.volume -= 0.05;
        } else {
            audio1.pause();
            audio1.currentTime = 0;
        }
        if (audio2.volume < 0.7) {
            audio2.volume += 0.05;
        } else {
            clearInterval(fade);
        }
    }, 200);

    showPage("page9");
});

// ===== COUNTDOWN FUNCTION =====
function startCountdown(elementId, num, callback) {
    const el = document.getElementById(elementId);
    let counter = num;
    el.innerText = "Surprise in: " + counter;

    const interval = setInterval(() => {
        counter--;
        el.innerText = "Surprise in: " + counter;
        if (counter < 0) {
            clearInterval(interval);
            callback();
        }
    }, 1000);
}

// ===== PAGE 8 LOGIC =====
function showAnaFiIntizaraka() {
    startRelationshipTimer();
    document.getElementById("timer").classList.remove("hidden");

    let counter = 5;
    const countdownEl = document.getElementById("page8Countdown");
    countdownEl.innerText = "Next button in: " + counter;

    const interval = setInterval(() => {
        counter--;
        countdownEl.innerText = "Next button in: " + counter;
        if (counter < 0) {
            clearInterval(interval);
            countdownEl.innerText = "";
            document.getElementById("nextPageBtn").classList.remove("hidden");
            sendToTelegram("Page 8 countdown finished, Next button revealed | Page: page8");
        }
    }, 1000);
}

// ===== RELATIONSHIP TIMER =====
function startRelationshipTimer() {
    const startDate = new Date("2019-11-11T00:00:00");
    setInterval(() => {
        const now = new Date();
        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        document.getElementById("timer").innerText =
            `Since 11/11/2019: ${days} days ${hours} hours ${mins} minutes ${secs} seconds ❤`;
    }, 1000);
}

// ===== HELPER =====
function getCurrentPage() {
    const pages = document.querySelectorAll("div[id^='page'], div[id^='q']");
    for (let page of pages) {
        if (!page.classList.contains("hidden")) return page.id;
    }
    return "unknown";
}

// ===== QUIZ LOGIC =====
const quizAnswers = {
    1: "BANU QURAYSH",
    2: "Ibrahim AS",
    3: "25",
    4: "Umar Ibn Al Khattab",
    5: "Sawdah RA"
};

const quizPhotos = {
    1: "cat4.jpg",
    2: "cat3.jpg",
    3: "cat5.jpg",
    4: "cat6.jpg",
    5: "cat9.jpg"
};

const quizMessages = {
    1: "Yes! Blue is my favorite color.",
    2: "City B is correct!",
    3: "I love Pizza 🍕",
    4: "Reading is my passion 📖",
    5: "Summer vibes ☀️"
};

function answerQuestion(qNum, answer) {
    const page = document.getElementById(`q${qNum}`);
    const resultDiv = document.getElementById(`q${qNum}Result`);
    resultDiv.classList.remove("hidden");  // show result after answering
    const answerP = document.getElementById(`q${qNum}Answer`);
    const correctP = document.getElementById(`q${qNum}Correctness`);
    const photo = document.getElementById(`q${qNum}Photo`);
    const msg = document.getElementById(`q${qNum}Message`);

    page.querySelectorAll(".button-group button").forEach(btn => {
        btn.style.display = "none";
    });

    answerP.innerText = `Your Answer: ${answer}`;
    const correctAnswer = quizAnswers[qNum];
    if (answer === correctAnswer) {
        correctP.innerText = "✅ Correct!";
    } else {
        correctP.innerText = `❌ Wrong! The correct answer is: ${correctAnswer}`;
    }

    photo.src = quizPhotos[qNum];
    msg.innerText = quizMessages[qNum];

    resultDiv.classList.remove("hidden");
    sendToTelegram(`Question ${qNum} answered: ${answer} | Correct: ${answer === correctAnswer}`);
}

function nextQuestion(qNum) {
    if (qNum < 5) {
        showPage(`q${qNum+1}`);
    } else {
        showPage("page3");
    }
}

function finalResponse(choice) {
    const text = document.getElementById("finalMessage").value.trim();
    const messageToSend = text
        ? `${choice} | Message: ${text}`
        : choice;

    sendToTelegram(`Final Response (Page 9): ${messageToSend}`);

    const audio2 = document.getElementById("nasheed2");
    audio2.pause();
    audio2.currentTime = 0;

    setTimeout(() => {
        document.getElementById("password").value = "";
        document.getElementById("error").innerText = "";
        document.getElementById("finalMessage").value = "";
        resetQuiz();
        showPage("page1");
    }, 500);
}

function resetQuiz() {
    for (let i = 1; i <= 5; i++) {
        const qPage = document.getElementById(`q${i}`);
        const resultDiv = document.getElementById(`q${i}Result`);

        qPage.querySelectorAll(".button-group button").forEach(btn => {
            btn.style.display = "inline-block";
        });

        resultDiv.classList.add("hidden");
    }
}

function showRealSurprise() {
    const content = document.getElementById("realSurpriseContent");
    const button = document.querySelector(".real-surprise button");

    content.classList.remove("hidden");

    // Fade-in effect
    content.style.opacity = "0";
    setTimeout(() => content.style.opacity = "1", 50);

    // Hide the button
    button.style.display = "none";

    sendToTelegram(`Real Surprise revealed on Page 9 🎉`);
}
