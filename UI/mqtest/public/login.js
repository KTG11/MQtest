// login.js
const loginHTML = `
  <style>
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
  </style>
  <h2>Login</h2>
  <form id="loginForm">
    <input name="email" placeholder="Email" type="email" required />
    <input name="password" placeholder="Password" type="password" required />
    <button type="submit">Login</button>
  </form>
  <a href="signup.html">Don't have an account? Sign up</a>
  <p id="message"></p>
`;

document.body.innerHTML = loginHTML;

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
      // Redirect to dashboard or another page if you want
      // window.location.href = "/dashboard.html";
    }
  } catch (err) {
    alert("❌ Network error during login");
    console.error(err);
  }
});
