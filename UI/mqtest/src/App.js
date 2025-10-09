// app.js

// HTML for login and signup forms as template strings (copy your existing HTML strings here)
const loginHTML = `
  <h2>Login</h2>
  <form id="loginForm">
    <input name="email" placeholder="Email" type="email" required />
    <input name="password" placeholder="Password" type="password" required />
    <button type="submit">Login</button>
  </form>
  <a href="#" id="goToSignup">Don't have an account? Sign up</a>
  <p id="message"></p>
`;

const signupHTML = `
  <h2>Signup</h2>
  <form id="signupForm">
    <input name="username" placeholder="Username" required />
    <input name="email" placeholder="Email" type="email" required />
    <input name="password" placeholder="Password" type="password" required />
    <button type="submit">Sign Up</button>
  </form>
  <a href="#" id="goToLogin">Already have an account? Login</a>
  <p id="message"></p>
`;

// Inject styles (copy your CSS styles here or put in separate stylesheet)
const style = document.createElement('style');
style.textContent = `
  body {
    font-family: Arial, sans-serif;
    background: #2a2d4a;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #3a3d5f;
    padding: 30px;
    border-radius: 10px;
    width: 250px;
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
  }
  #message {
    margin-top: 10px;
    color: #ffdddd;
    text-align: center;
  }
`;
document.head.appendChild(style);

const appDiv = document.getElementById('app');

function loadLogin() {
  appDiv.innerHTML = loginHTML;
  document.getElementById('goToSignup').addEventListener('click', e => {
    e.preventDefault();
    loadSignup();
  });

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch("/login", {
      method: "POST",
      body: formData,
    });
    const text = await res.text();
    document.getElementById('message').innerText = text;
    if (res.ok && text.includes("Welcome")) {
      // Redirect or do something after successful login
    }
  });
}

function loadSignup() {
  appDiv.innerHTML = signupHTML;
  document.getElementById('goToLogin').addEventListener('click', e => {
    e.preventDefault();
    loadLogin();
  });

  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch("/signup", {
      method: "POST",
      body: formData,
    });
    const text = await res.text();
    document.getElementById('message').innerText = text;
    if (res.ok && text.includes("successful")) {
      loadLogin();
    }
  });
}

// Start with login page
loadLogin();
