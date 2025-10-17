import React, { useState, useEffect, useRef } from 'react';
import '../styles/auth.css';

const symbols = ['+', '−', '×', '÷', '=', '<', '>', '√', 'π', '∑', '∫', '∞', 'θ', 'α', 'β', 'γ', 'Δ', 'λ', 'μ', 'σ'];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [pwdStrength, setPwdStrength] = useState({ percent: 0, label: '', color: 'transparent' });

  const canvasRef = useRef(null);
  const layersRef = useRef([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // ---- Password strength functions ----
  const strengthScore = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const updatePwdMeter = (pwd) => {
    const s = strengthScore(pwd);
    const percent = (s / 5) * 100;
    let label = '';
    let color = '';

    if (s <= 1) { label = 'Very weak'; color = 'linear-gradient(90deg,#ff6b6b,#ff6b6b)'; }
    else if (s === 2) { label = 'Weak'; color = 'linear-gradient(90deg,#ff6b6b,#ffd54f)'; }
    else if (s === 3) { label = 'Medium'; color = 'linear-gradient(90deg,#ffd54f,#a2d149)'; }
    else if (s === 4) { label = 'Strong'; color = 'linear-gradient(90deg,#7bd389,#46c0a6)'; }
    else if (s >= 5) { label = 'Very strong'; color = 'linear-gradient(90deg,#46c0a6,#1fb2ff)'; }
    else { label = 'Use 8+ characters, a number and a symbol'; color = 'transparent'; }

    setPwdStrength({ percent, label, color });
  };

  // ---- Handle toggle ----
  const toggleLogin = () => setIsLogin(true);
  const toggleSignup = () => setIsLogin(false);

  // ---- Form handlers ----
  const handleLogin = (e) => {
    e.preventDefault();
    alert('Demo login: ' + e.target.email.value);
  };
  const handleSignup = (e) => {
    e.preventDefault();
    alert('Demo signup: ' + e.target.email.value);
    toggleLogin();
  };

  // ---- Canvas background animation ----
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const layers = [];
    for (let L = 0; L < 3; L++) {
      const arr = [];
      const count = 20 + L * 10;
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          size: (18 + Math.random() * 40) * (1 - L * 0.18),
          speed: 0.2 + Math.random() * 0.8 + L * 0.4,
          alpha: 0.12 + Math.random() * 0.4
        });
      }
      layers.push(arr);
    }
    layersRef.current = layers;

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = (mouseRef.current.x / canvas.width - 0.5) * 60;
      const cy = (mouseRef.current.y / canvas.height - 0.5) * 40;

      layersRef.current.forEach((layer, idx) => {
        layer.forEach(p => {
          p.y -= p.speed * 0.25;
          if (p.y < -60) { p.y = canvas.height + 40; p.x = Math.random() * canvas.width; }
          const ox = cx * (idx + 1) * 0.7;
          const oy = cy * (idx + 1) * 0.5;
          ctx.globalAlpha = p.alpha * 0.9;
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.font = `${p.size}px "Arial"`;
          ctx.fillText(p.symbol, p.x + ox, p.y + oy);
        });
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="auth-page">
      <canvas className="bg-canvas" ref={canvasRef}></canvas>

      <div className="container" role="main" aria-labelledby="main-title">
        <div className="hero">
          <h1 id="main-title">MathQuest — Master Math the fun way</h1>
          <p>Adaptive, gamified math practice aligned to local syllabuses. Track progress, earn badges and build real understanding.</p>
          <div className="features" aria-hidden="true">
            <div className="pill">Gamified</div>
            <div className="pill">Adaptive</div>
            <div className="pill">Offline mode</div>
            <div className="pill">Teacher tools</div>
          </div>
        </div>

        <div className="card" aria-live="polite">
          <div className="toggle" role="tablist" aria-label="Login or Signup">
            <button onClick={toggleLogin} className={isLogin ? 'active' : ''} role="tab" aria-selected={isLogin}>Login</button>
            <button onClick={toggleSignup} className={!isLogin ? 'active' : ''} role="tab" aria-selected={!isLogin}>Sign up</button>
          </div>

          <div className="forms-viewport">
            <div className="forms" style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(-50%)' }}>
              {/* LOGIN FORM */}
              <form className="auth" onSubmit={handleLogin} autoComplete="on" noValidate>
                <div className="field">
                  <input type="email" name="email" placeholder=" " required aria-label="Email" />
                  <label className="floating">Email</label>
                </div>
                <div className="field">
                  <input type="password" name="password" placeholder=" " required aria-label="Password" />
                  <label className="floating">Password</label>
                </div>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="submit" className="action-btn">Log in</button>
                  <button type="button" className="secondary">Forgot?</button>
                </div>
                <div className="small" aria-hidden="true">Or login with</div>
                <div className="row" style={{ marginTop: 6 }}>
                  <button className="secondary" type="button">Google</button>
                  <button className="secondary" type="button">Microsoft</button>
                  <button className="secondary" type="button">Apple</button>
                </div>
              </form>

              {/* SIGNUP FORM */}
              <form className="auth" onSubmit={handleSignup} autoComplete="on" noValidate>
                <div className="field">
                  <input type="text" name="username" placeholder=" " required aria-label="Username" />
                  <label className="floating">Username</label>
                </div>
                <div className="field">
                  <input type="email" name="email" placeholder=" " required aria-label="Email" />
                  <label className="floating">Email</label>
                </div>
                <div className="field">
                  <input type="password" placeholder=" " required aria-label="Password" value={password} onChange={e => { setPassword(e.target.value); updatePwdMeter(e.target.value); }} />
                  <label className="floating">Password</label>
                </div>

                <div className="pwd-meter" aria-hidden="true"><i style={{ width: `${pwdStrength.percent}%`, background: pwdStrength.color }}></i></div>
                <div className="pwd-text">{pwdStrength.label || 'Use 8+ characters, a number and a symbol'}</div>

                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="submit" className="action-btn">Create account</button>
                  <button type="button" className="secondary" onClick={toggleLogin}>Back</button>
                </div>
                <div className="small" style={{ marginTop: 6 }}>By signing up you agree to our terms.</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
