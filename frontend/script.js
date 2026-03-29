// ================= BACKEND CONFIG =================

const API_BASE = "http://127.0.0.1:8000";

// ================= DEFAULT CONFIG =================

const defaultConfig = {
  hero_title: 'AI-Powered Personalized Legal Assistant',
  hero_subtitle:
    'Understand laws and legal rights in simple, human language. Get instant, personalized legal guidance powered by advanced AI.'
};

let config = { ...defaultConfig };
let explanationLevel = 'basic';

// ================= PAGE LOAD INIT =================

document.addEventListener("DOMContentLoaded", function () {

  protectAskPage();     // 🔥 Direct URL protection
  checkLoginState();    // 🔥 Login/Logout toggle
  updateUI();
  createParticles();
});

// ================= PAGE PROTECTION =================

function protectAskPage() {
  if (window.location.pathname.includes("ask.html")) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      alert("Please login first");
      window.location.href = "index.html";
    }
  }
}

// ================= UPDATE UI =================

function updateUI() {
  const titleEl = document.getElementById('heroTitle');
  const subtitleEl = document.getElementById('heroSubtitle');

  if (titleEl) {
    const title = config.hero_title || defaultConfig.hero_title;
    const words = title.split(' ');
    const mid = Math.ceil(words.length / 2);
    const first = words.slice(0, mid).join(' ');
    const second = words.slice(mid).join(' ');

    titleEl.innerHTML = `
      <span class="bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent">${first}</span>
      <br>
      <span class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">${second}</span>
    `;
  }

  if (subtitleEl) {
    subtitleEl.textContent =
      config.hero_subtitle || defaultConfig.hero_subtitle;
  }
}

// ================= PARTICLES =================

function createParticles() {
  const network = document.getElementById('neuralNetwork');
  if (!network) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    network.appendChild(p);
  }
}

// ================= LOGIN SYSTEM =================

let overlay = document.getElementById('overlay');
let loginBtn = document.getElementById('loginBtn');
let signupBtn = document.getElementById('signupBtn');
let closeModal = document.getElementById('closeModal');
let loginForm = document.getElementById('loginForm');
let signupForm = document.getElementById('signupForm');

// Login State Check
function checkLoginState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (loginBtn) {
    loginBtn.innerText = isLoggedIn === "true" ? "Logout" : "Login";
  }
}

// Login / Logout Button Click
loginBtn?.addEventListener('click', () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    logoutUser();
  } else {
    overlay?.classList.remove('hidden');
    loginForm?.classList.remove('hidden');
    signupForm?.classList.add('hidden');
  }
});

// Signup Open
signupBtn?.addEventListener('click', () => {
  overlay?.classList.remove('hidden');
  signupForm?.classList.remove('hidden');
  loginForm?.classList.add('hidden');
});

// Close Modal
closeModal?.addEventListener('click', () => {
  overlay?.classList.add('hidden');
});

// Overlay click close
overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.add('hidden');
});

// Login Submit
loginForm?.addEventListener('submit', async function (e) {

  e.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  try {

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await res.json();

    if (res.ok) {

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("isLoggedIn", "true");

      overlay.classList.add("hidden");

      alert("Login Successful ✅");

      checkLoginState();

    } else {

      alert(data.detail || "Login Failed");

    }

  } catch (error) {

    alert("Server Error");

  }

});

//SignUp form
signupForm?.addEventListener('submit', async function (e) {

  e.preventDefault();

  const name = signupForm.querySelector('input[type="text"]').value;
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;
  const role = document.getElementById('signupRole')?.value || 'individual'

  try {

    const res = await fetch(`${API_BASE}/register`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        role: role
      })

    });

    const data = await res.json();

    if (res.ok) {

      alert("Signup Successful");

      signupForm.classList.add("hidden");
      loginForm.classList.remove("hidden");

    } else {

      alert(data.detail || "Signup Failed");

    }

  } catch (error) {

    alert("Server Error");

  }

});

// Logout
function logoutUser() {
  localStorage.removeItem('isLoggedIn');
  alert('Logged Out ✅');
  checkLoginState();
}

// ================= NAVBAR ASK PROTECTION =================

function openAskPage(event) {
  event.preventDefault();

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    window.location.href = "ask.html";
  } else {
    alert("Please login first");
  }
}

// ================= CHAT SYSTEM =================

const chatForm = document.getElementById('chatForm');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

chatForm?.addEventListener('submit', async function (e) {

  e.preventDefault();

  const question = chatInput.value.trim();

  if (!question) return;

  addMessage(question, "user");

  chatInput.value = "";

  const token = localStorage.getItem("token");

  if (!token) {
    addMessage("Please login first.", "ai");
    return;
  }

  try {

    const res = await fetch(`${API_BASE}/chat`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },

      body: JSON.stringify({
        query: question
      })

    });

    const data = await res.json();
    console.log(data);
    console.log("SOURCES:", data.sources);

    if (res.ok) {
      const r = data.response;

      let message = "";

/* SUMMARY */
if (r.summary) {
  message += `📌 ${r.summary}\n\n`;
}

/* ISSUE + RISK */
message += `⚖️ Issue: ${r.detected_issue}\n`;
message += `🚨 Risk Level: ${r.risk_level}\n\n`;

/* EXPLANATION */
if (r.explanation) {
  message += `📖 Explanation:\n${r.explanation}\n\n`;
}

/* ROLE NOTE */
if (r.role_note) {
  message += `👤 ${r.role_note}\n\n`;
}

/* ADVICE LIST */
if (r.advice && r.advice.length > 0) {
  message += `💡 Recommended Actions:\n`;
  r.advice.forEach(a => {
    message += `• ${a}\n`;
  });
  message += "\n";
}

/* LEGAL CITATIONS */
if (r.citations && r.citations.length > 0) {
  message += `📚 Relevant Legal Topics:\n`;
  r.citations.forEach(c => {
    message += `• ${c.title} (${c.category})\n`;
  });
}
/* 🔗 EXTERNAL SOURCES (FINAL FIX) */
if (data.sources && data.sources.length > 0) {
  message += `\n\n🔗 More Information:\n`;
  data.sources.forEach(link => {
    let label = "Legal Resource";

    if (link.includes("indiankanoon")) {
      label = `${data.predicted_category} – Indian Kanoon`;
    } 
    else if (link.includes("lawrato")) {
      label = `${data.predicted_category} – LawRato`;
    } 
    else {
      label = `${data.predicted_category} Resource`;
    }

    message += `• <a href="${link}" target="_blank" style="color:#60a5fa; text-decoration: underline;">${label}</a>\n`;
  
  });
}
      addMessage(message, "ai");
    } 
    else {
      addMessage(data.detail || "Error from server", "ai");
    }

  } catch (error) {

    addMessage("Server error. Please try again.", "ai");

  }

});


function addMessage(text, sender) {
  if (!chatMessages) return;

  const div = document.createElement('div');

  if (sender === 'user') {
    div.className = 'flex gap-3 justify-end message-in';
    div.innerHTML = `
      <div class="bg-indigo-600/30 rounded-2xl rounded-tr-none p-4 max-w-xl border border-indigo-500/20">
      <p class="text-sm text-gray-300 whitespace-pre-wrap"></p>
      </div>`;
      div.querySelector("p").innerHTML = text;
  } else {
    div.className = 'flex gap-3 message-in';
    div.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center flex-shrink-0 text-lg">⚖️</div>
      <div class="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-xl border border-white/10">
        <p class="text-sm text-gray-300 whitespace-pre-wrap">${text}</p>
      </div>`;
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}