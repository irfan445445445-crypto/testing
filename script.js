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
  const audio = document.getElementById("nasheed");

  if (pass === "1234") {
    audio.volume = 0.7;
    audio.play();
    showPage("page2");
    sendToTelegram(`Password entered: ${pass} ✅ | Page: page1`);
  } else {
    document.getElementById("error").innerText = "❌ Wrong Password!";
    sendToTelegram(`Password entered: ${pass} ❌ | Page: page1`);
  }
}

// ===== MUTE BUTTON =====
document.getElementById("muteBtn").addEventListener("click", function() {
  const audio = document.getElementById("nasheed");
  if (audio.muted) {
    audio.muted = false;
    this.textContent = "🔊";
    sendToTelegram(`Audio unmuted | Page: ${getCurrentPage()}`);
  } else {
    audio.muted = true;
    this.textContent = "🔇";
    sendToTelegram(`Audio muted | Page: ${getCurrentPage()}`);
  }
});

// ===== KNOW ME RESPONSE =====
function knowMe(ans) {
  const res = document.getElementById("knowResponse");
  if (ans) {
    res.innerText = "Alhamdulillah you still remember me ❤";
    sendToTelegram(`Button clicked: YES (Do you know me?) | Page: page3 | Content: "${res.innerText}"`);
  } else {
    res.innerText = "MashaAllah you forget me 🥲";
    sendToTelegram(`Button clicked: NO (Do you know me?) | Page: page3 | Content: "${res.innerText}"`);
  }
  document.getElementById("surpriseBtn").classList.remove("hidden");
}

// ===== SURPRISE BUTTON =====
document.getElementById("surpriseBtn").querySelector("button").addEventListener("click", () => {
  sendToTelegram(`Button clicked: 🎁 Surprise | Page: page3`);
  showPage("page4");
});

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
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
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
  1: "Blue",
  2: "City B",
  3: "Pizza",
  4: "Reading",
  5: "Summer"
};

const quizPhotos = {
  1: "photo1.jpg",
  2: "photo2.jpg",
  3: "photo3.jpg",
  4: "photo4.jpg",
  5: "photo5.jpg"
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
  const answerP = document.getElementById(`q${qNum}Answer`);
  const correctP = document.getElementById(`q${qNum}Correctness`);
  const photo = document.getElementById(`q${qNum}Photo`);
  const msg = document.getElementById(`q${qNum}Message`);

  // Hide only the answer buttons (not the Next Question button)
  page.querySelectorAll("button").forEach(btn => {
    if (!resultDiv.contains(btn)) btn.style.display = "none";
  });

  // Show result
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
    showPage("page3"); // After last question
  }
}

function finalResponse(choice) {
  const text = document.getElementById("finalMessage").value.trim();
  const messageToSend = text 
    ? `${choice} | Message: ${text}` 
    : choice;

  sendToTelegram(`Final Response (Page 9): ${messageToSend}`);

  // Stop and reset the song
  const audio = document.getElementById("nasheed");
  audio.pause();
  audio.currentTime = 0;

  // After a short delay, return to password (home) page
  setTimeout(() => {
    // Clear password field and error message
    document.getElementById("password").value = "";
    document.getElementById("error").innerText = "";
    
    showPage("page1"); 
  }, 500);
}
