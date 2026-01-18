const API_URL = "https://ai-chatbot-s78e.onrender.com";

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
const signupForm = document.getElementById("signupForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const messageDiv = document.getElementById("message");

// Handle signup form submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showMessage("Please fill in all fields", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters", "error");
    return;
  }

  // Disable button and show loading
  signupBtn.disabled = true;
  signupBtn.textContent = "Registering...";
  messageDiv.textContent = "";

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Registration failed");
    }

    showMessage("Registration successful! Redirecting to login...", "success");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (error) {
    showMessage(error.message, "error");
    signupBtn.disabled = false;
    signupBtn.textContent = "Register";
  }
});

// Helper function to show messages
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
}