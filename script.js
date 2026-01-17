const API_URL = "https://ai-chatbot-production-604d.up.railway.app";

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // DOM Elements
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menuBtn");
  const menuBtnChat = document.getElementById("menuBtnChat");
  const topMenu = document.getElementById("topMenu");
  const historyList = document.getElementById("historyList");
  const newChatBtn = document.getElementById("newChatBtn");

  const landing = document.getElementById("landing");
  const chatPage = document.getElementById("chat-page");

  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("sendBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Always start at landing page for new sessions
  landing.classList.add("active");
  topMenu.classList.add("show");

  // Initialize Vanta background after setting up the page
  setTimeout(() => {
    VANTA.NET({
      el: "#vanta-bg",
      color: 0x00ffff,
      backgroundColor: 0x000000,
      points: 10.0,
      spacing: 18.0,
      showDots: true
    });
  }, 100);

  // Load chat history on page load
  loadHistory();

  // Sidebar toggle
  menuBtn.onclick = () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    topMenu.style.display = "none";
  };

  menuBtnChat.onclick = () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  };

  overlay.onclick = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    topMenu.style.display = "block";
  };

  // New chat button
  newChatBtn.onclick = () => {
    chatMessages.innerHTML = "";
    chatPage.classList.remove("active");
    landing.classList.add("active");
    topMenu.classList.add("show");
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    searchInput.value = "";
  };

  // Search from landing page
  searchBtn.onclick = () => {
    const text = searchInput.value.trim();
    if (!text) return;

    landing.classList.remove("active");
    chatPage.classList.add("active");
    topMenu.classList.remove("show");

    addMessage(text, "user");
    sendChatMessage(text);
  };

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
  });

  // Send message from chat page
  sendBtn.onclick = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";
    sendChatMessage(text);
  };

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });

  // Logout
  logoutBtn.onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
  };

  // Add message to chat
  function addMessage(text, role) {
    const div = document.createElement("div");
    div.className = `message ${role}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Send chat message to backend
  async function sendChatMessage(text) {
    // Show loading indicator
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading";
    loadingDiv.textContent = "Thinking...";
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });

      loadingDiv.remove();

      if (!response.ok) {
        if (response.status === 401) {
          addMessage("Session expired. Please login again.", "bot");
          setTimeout(() => {
            localStorage.removeItem("token");
            window.location.href = "login.html";
          }, 1500);
          return;
        }
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      addMessage(data.reply, "bot");

    } catch (err) {
      loadingDiv.remove();
      addMessage("Error: " + err.message, "bot");
    }
  }

  // Load chat history from backend
  async function loadHistory() {
    try {
      const response = await fetch(`${API_URL}/history`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to load history");
      }

      const data = await response.json();
      displayHistory(data.history);

    } catch (err) {
      console.error("Error loading history:", err);
      historyList.innerHTML = '<div class="empty-history">No chat history</div>';
    }
  }

  // Display history in sidebar
  function displayHistory(history) {
    if (!history || history.length === 0) {
      historyList.innerHTML = '<div class="empty-history">No chat history yet</div>';
      return;
    }

    // Group messages into conversations (every user-assistant pair)
    const conversations = [];
    for (let i = 0; i < history.length; i += 2) {
      if (history[i] && history[i].role === "user") {
        conversations.push({
          preview: history[i].content,
          messages: [history[i], history[i + 1]].filter(Boolean)
        });
      }
    }

    historyList.innerHTML = "";
    
    if (conversations.length === 0) {
      historyList.innerHTML = '<div class="empty-history">No chat history yet</div>';
      return;
    }

    // Display last 10 conversations
    conversations.slice(-10).reverse().forEach((conv, index) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.textContent = conv.preview.substring(0, 50) + (conv.preview.length > 50 ? "..." : "");
      
      div.onclick = () => {
        loadConversation(conv.messages);
        document.querySelectorAll(".history-item").forEach(item => item.classList.remove("active"));
        div.classList.add("active");
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
      };

      historyList.appendChild(div);
    });
  }

  // Load a specific conversation
  function loadConversation(messages) {
    chatMessages.innerHTML = "";
    landing.classList.remove("active");
    chatPage.classList.add("active");

    messages.forEach(msg => {
      addMessage(msg.content, msg.role === "user" ? "user" : "bot");
    });
  }
});