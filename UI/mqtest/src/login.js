// login.js

const loginHTML = `
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background: linear-gradient(135deg, #2c5364, #203a43, #0f2027);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: Arial, sans-serif;
      color: white;
      cursor: none; /* Hide normal cursor */
    }

    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: rgba(58, 61, 95, 0.85);
      padding: 30px;
      border-radius: 10px;
      width: 250px;
      z-index: 2;
      position: relative;
    }

    input {
      padding: 10px;
      border: none;
      border-radius: 5px;
    }

    button {
      padding: 10px;
      border: none;
      background: #2196f3;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }

    button:hover {
      background: #1976d2;
    }

    a {
      color: #a1c6ff;
      text-decoration: none;
      text-align: center;
      margin-top: 10px;
      z-index: 2;
      position: relative;
    }

    #message {
      margin-top: 10px;
      color: #ffdddd;
      text-align: center;
      z-index: 2;
      position: relative;
    }

    h2 {
      z-index: 2;
      position: relative;
      text-shadow: 2px 2px 10px rgba(0,0,0,0.7);
    }

    /* Cursor styling */
    .cursor-dot, .cursor-ring {
      position: fixed;
      pointer-events: none;
      left: 0;
      top: 0;
      transform: translate(-50%, -50%);
      z-index: 9999;
    }

    .cursor-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.12);
      transition: width .12s ease, height .12s ease, opacity .12s ease;
    }

    .cursor-ring {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255,0.18);
      transform: translate(-50%, -50%);
      transition: transform .12s cubic-bezier(.2, .9, .2, 1), border-color .12s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    body.hovering .cursor-ring {
      transform: translate(-50%,-50%) scale(1.35);
      border-color: rgba(123, 211, 137, 0.95);
    }
  </style>

  <canvas id="mathCanvas"></canvas>
  <h2>Login</h2>
  <form id="loginForm">
    <input name="email" placeholder="Email" type="email" required />
    <input name="password" placeholder="Password" type="password" required />
    <button type="submit">Login</button>
  </form>
  <a href="/signup">Don't have an account? Sign up</a>
  <p id="message"></p>

  <div id="dot" class="cursor-dot"></div>
  <div id="ring" class="cursor-ring"></div>
`;

document.body.innerHTML = loginHTML;

// === FLOATING MATH BACKGROUND ===
const canvas = document.getElementById("mathCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const symbols = ["+", "-", "×", "÷", "=", "√", "π", "∞"];
const particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 30 + 20;
    this.speed = Math.random() * 2 + 1;
    this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
    this.color = "rgba(255,255,255,0.6)";
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.font = this.size + "px Arial";
    ctx.fillText(this.symbol, this.x, this.y);
  }
  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.y = canvas.height + this.size;
      this.x = Math.random() * canvas.width;
    }
    this.draw();
  }
}

for (let i = 0; i < 40; i++) {
  particles.push(new Particle());
}

function animateBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => p.update());
  requestAnimationFrame(animateBackground);
}

animateBackground();

// === CUSTOM CURSOR ===
const dot = document.getElementById('dot');
const ring = document.getElementById('ring');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX, ringY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + "px";
  dot.style.top = mouseY + "px";
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  ring.style.left = ringX + "px";
  ring.style.top = ringY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mouseleave', () => {
  dot.style.opacity = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity = '1';
  ring.style.opacity = '1';
});

// === LOGIN HANDLER ===
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const res = await fetch("http://localhost:10000/login", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    const messageEl = document.getElementById("message");
    messageEl.innerText = text;

    if (res.ok && text.includes("Welcome")) {
      localStorage.setItem("user", formData.get("email"));
      // Redirect if needed
      // window.location.href = "/dashboard.html";
    }
  } catch (err) {
    alert("❌ Network error during login");
    console.error(err);
  }
});
