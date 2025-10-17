// auth.js
(function() {
  // --- Create style element for inline CSS ---
  const style = document.createElement('style');
  style.textContent = `
    :root{
      --accent:#4caf50;
      --accent-2:#21a1f3;
      --bg1:#0f1724;
      --bg2:#11243a;
      --card: rgba(58,61,95,0.95);
      --muted:#bfc7d6;
    }
    html,body{height:100%;margin:0;font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
    body {
      background: linear-gradient(-45deg, #0f1724, #11243a, #16324a, #0b1220);
      background-size: 400% 400%;
      animation: gradientMove 18s ease infinite;
      color: white;
      overflow: hidden;
      margin:0;
      cursor:none;
    }
    @keyframes gradientMove {
      0% {background-position: 0% 50%}
      50% {background-position: 50% 100%}
      100% {background-position: 0% 50%}
    }
    .auth-page {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      overflow:hidden;
    }
    .container {
      width: min(960px, 95%);
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 36px;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    .hero {padding:36px;color:#f7fbff;}
    .hero h1{font-size:2.25rem;margin:0 0 12px;}
    .hero p{color:var(--muted);font-size:1rem;line-height:1.5;margin:0 0 20px;}
    .features {display:flex;gap:12px;flex-wrap:wrap;}
    .pill {background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:999px;font-size:0.9rem;color:var(--muted);}
    .card {background:var(--card);padding:26px;border-radius:12px;box-shadow:0 10px 30px rgba(2,6,23,0.6);position:relative;overflow:visible;}
    .toggle {display:flex;gap:8px;margin-bottom:12px;}
    .toggle button {flex:1;padding:10px 14px;border-radius:8px;border:none;background:transparent;color:var(--muted);cursor:pointer;font-weight:600;}
    .toggle button.active {background: linear-gradient(90deg, var(--accent),var(--accent-2));color:white;box-shadow:0 6px 18px rgba(14,165,90,0.18);}
    .forms-viewport {width:100%;height:auto;overflow:hidden;position:relative;}
    .forms {display:flex;gap:24px;width:200%;transition: transform .5s cubic-bezier(.2,.9,.2,1);}
    form.auth {width:50%;min-width:0;display:flex;flex-direction:column;gap:12px;}
    .field {position:relative;}
    input[type="text"],input[type="email"],input[type="password"] {
      width:100%;padding:14px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#fff;border-radius:8px;font-size:0.95rem;
    }
    label.floating {position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:0.9rem;pointer-events:none;transition: all 0.18s ease;padding:0 6px;}
    input:focus + label.floating, input:not(:placeholder-shown) + label.floating {top:-10px;font-size:0.78rem;color:var(--accent);transform:none;}
    .row {display:flex;gap:10px;}
    .small {font-size:0.85rem;color:var(--muted);}
    .action-btn {padding:12px 14px;border-radius:8px;border:none;background:darkcyan;color:white;font-weight:700;cursor:pointer;box-shadow:0 8px 18px rgba(16,185,129,0.12);}
    .action-btn:hover {background-color:#bfc7d6;color:linear-gradient(90deg,var(--accent),var(--accent-2));}
    .secondary {background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted);padding:10px 12px;border-radius:8px;cursor:pointer;}
    .pwd-meter {height:8px;border-radius:6px;background:rgba(255,255,255,0.06);overflow:hidden;}
    .pwd-meter > i {display:block;height:100%;width:0%;transition: width .25s;}
    .pwd-text {font-size:0.82rem;color:var(--muted);margin-top:6px;}
    .bg-canvas {position:fixed;inset:0;z-index:0;pointer-events:none;}
    @media (max-width:880px) {
      .container{grid-template-columns:1fr;padding:24px;gap:20px;}
      .forms{width:100%;}
      form.auth{width:100%;}
    }
  `;
  document.head.appendChild(style);

  // --- Create main wrapper ---
  const wrapper = document.createElement('div');
  wrapper.className = 'auth-page';
  document.body.appendChild(wrapper);

  // --- Create canvas ---
  const canvas = document.createElement('canvas');
  canvas.className = 'bg-canvas';
  canvas.id = 'bgCanvas';
  wrapper.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // --- Create container ---
  const container = document.createElement('div');
  container.className = 'container';
  wrapper.appendChild(container);

  // --- Hero section ---
  const hero = document.createElement('div');
  hero.className = 'hero';
  hero.innerHTML = `
    <h1 id="main-title">MathQuest — Master Math the fun way</h1>
    <p>Adaptive, gamified math practice aligned to local syllabuses. Track progress, earn badges and build real understanding.</p>
    <div class="features" aria-hidden="true">
      <div class="pill">Gamified</div>
      <div class="pill">Adaptive</div>
      <div class="pill">Offline mode</div>
      <div class="pill">Teacher tools</div>
    </div>
  `;
  container.appendChild(hero);

  // --- Card section ---
  const card = document.createElement('div');
  card.className = 'card';
  container.appendChild(card);

  // Toggle buttons
  const toggle = document.createElement('div');
  toggle.className = 'toggle';
  toggle.innerHTML = `
    <button id="t-login" class="active" aria-selected="true">Login</button>
    <button id="t-signup" aria-selected="false">Sign up</button>
  `;
  card.appendChild(toggle);

  // Forms viewport
  const formsViewport = document.createElement('div');
  formsViewport.className = 'forms-viewport';
  card.appendChild(formsViewport);

  const forms = document.createElement('div');
  forms.className = 'forms';
  forms.id = 'forms';
  formsViewport.appendChild(forms);

  // --- Login form ---
  const loginForm = document.createElement('form');
  loginForm.className = 'auth';
  loginForm.id = 'loginForm';
  loginForm.setAttribute('autocomplete','on');
  loginForm.setAttribute('novalidate','true');
  loginForm.innerHTML = `
    <div class="field">
      <input type="email" id="loginEmail" name="email" placeholder=" " required>
      <label class="floating" for="loginEmail">Email</label>
    </div>
    <div class="field">
      <input type="password" id="loginPassword" name="password" placeholder=" " required>
      <label class="floating" for="loginPassword">Password</label>
    </div>
    <div class="row" style="justify-content:space-between;align-items:center;">
      <button type="submit" class="action-btn">Log in</button>
      <button type="button" class="secondary" id="forgotBtn">Forgot?</button>
    </div>
    <div class="small">Or login with</div>
    <div class="row" style="margin-top:6px;">
      <button class="secondary" type="button">Google</button>
      <button class="secondary" type="button">Microsoft</button>
      <button class="secondary" type="button">Apple</button>
    </div>
  `;
  forms.appendChild(loginForm);

  // --- Signup form ---
  const signupForm = document.createElement('form');
  signupForm.className = 'auth';
  signupForm.id = 'signupForm';
  signupForm.setAttribute('autocomplete','on');
  signupForm.setAttribute('novalidate','true');
  signupForm.innerHTML = `
    <div class="field">
      <input type="text" id="suName" name="username" placeholder=" " required>
      <label class="floating" for="suName">Username</label>
    </div>
    <div class="field">
      <input type="email" id="suEmail" name="email" placeholder=" " required>
      <label class="floating" for="suEmail">Email</label>
    </div>
    <div class="field">
      <input type="password" id="suPassword" name="password" placeholder=" " required>
      <label class="floating" for="suPassword">Password</label>
    </div>
    <div class="pwd-meter" aria-hidden="true"><i id="pwdBar"></i></div>
    <div class="pwd-text" id="pwdText">Use 8+ characters, a number and a symbol</div>
    <div class="row" style="justify-content:space-between;align-items:center;">
      <button type="submit" class="action-btn">Create account</button>
      <button type="button" class="secondary" id="toLogin">Back</button>
    </div>
    <div class="small" style="margin-top:6px">By signing up you agree to our terms.</div>
  `;
  forms.appendChild(signupForm);

  // --- Toggle logic ---
  const tLogin = document.getElementById('t-login');
  const tSignup = document.getElementById('t-signup');

  function showLogin() {
    tLogin.classList.add('active');
    tSignup.classList.remove('active');
    tLogin.setAttribute('aria-selected','true');
    tSignup.setAttribute('aria-selected','false');
    forms.style.transform = 'translateX(0%)';
  }
  function showSignup() {
    tSignup.classList.add('active');
    tLogin.classList.remove('active');
    tSignup.setAttribute('aria-selected','true');
    tLogin.setAttribute('aria-selected','false');
    forms.style.transform = 'translateX(-50%)';
  }

})
