import React, { useState } from 'react';
import './auth.css'; // you’ll create this next

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'

  return (
    <div className="auth-page">
      <div className="container">
        <div className="hero">
          <h1>MathQuest — Master Math the Fun Way</h1>
          <p>
            Adaptive, gamified math practice aligned to local syllabuses.
            Track progress, earn badges, and build real understanding.
          </p>
          <div className="features">
            <div className="pill">Gamified</div>
            <div className="pill">Adaptive</div>
            <div className="pill">Offline mode</div>
            <div className="pill">Teacher tools</div>
          </div>
        </div>

        <div className="card">
          <div className="toggle">
            <button
              onClick={() => setMode('login')}
              className={mode === 'login' ? 'active' : ''}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={mode === 'signup' ? 'active' : ''}
            >
              Sign up
            </button>
          </div>

          <div className="forms-viewport">
            <div
              className="forms"
              style={{
                transform: mode === 'login' ? 'translateX(0%)' : 'translateX(-50%)',
              }}
            >
              {/* LOGIN FORM */}
              <form className="auth" id="loginForm">
                <div className="field">
                  <input type="email" id="loginEmail" placeholder=" " required />
                  <label className="floating" htmlFor="loginEmail">Email</label>
                </div>
                <div className="field">
                  <input type="password" id="loginPassword" placeholder=" " required />
                  <label className="floating" htmlFor="loginPassword">Password</label>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <button type="submit" className="action-btn">Log in</button>
                  <button type="button" className="secondary">Forgot?</button>
                </div>
                <div className="small">Or login with</div>
                <div className="row" style={{ marginTop: '6px' }}>
                  <button className="secondary" type="button">Google</button>
                  <button className="secondary" type="button">Microsoft</button>
                  <button className="secondary" type="button">Apple</button>
                </div>
              </form>

              {/* SIGNUP FORM */}
              <form className="auth" id="signupForm">
                <div className="field">
                  <input type="text" id="suName" placeholder=" " required />
                  <label className="floating" htmlFor="suName">Username</label>
                </div>
                <div className="field">
                  <input type="email" id="suEmail" placeholder=" " required />
                  <label className="floating" htmlFor="suEmail">Email</label>
                </div>
                <div className="field">
                  <input type="password" id="suPassword" placeholder=" " required />
                  <label className="floating" htmlFor="suPassword">Password</label>
                </div>
                <div className="pwd-meter"><i id="pwdBar"></i></div>
                <div className="pwd-text">Use 8+ characters, a number and a symbol</div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <button type="submit" className="action-btn">Create account</button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setMode('login')}
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
