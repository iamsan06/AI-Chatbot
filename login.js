const API_URL = "https://ai-chatbot-production-604d.up.railway.app";

// Initialize Vanta background
VANTA.NET({
  el: "#vanta-bg",
  mouseControls: true,
  touchControls: true,
  color: 0x00ffff,
  backgroundColor: 0x000000,
  points: 10.0,
  maxDistance: 20.0,
  spacing: 18.0
});

// Get form elements
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const messageDiv = document.getElementById("message");

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  // Disable button and show loading
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  messageDiv.textContent = "";

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }

    // Store token in localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("userEmail", email);

    showMessage("Login successful! Redirecting...", "success");

    // Redirect to main chat page
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

  } catch (error) {
    showMessage(error.message, "error");
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
});

// Helper function to show messages
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
}