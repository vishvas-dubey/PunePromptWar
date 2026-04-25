"use strict";

// --- State Management ---
let mode = "explain"; // "explain" or "challenge"
let comprehensionScore = 35; // Mock score

// --- DOM Elements ---
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const modeSwitch = document.getElementById('mode-switch');
const modeLabel = document.getElementById('mode-label');
const progressBar = document.getElementById('main-progress');

// --- Pre-defined Scenario (Simulating Backend LLM & Vector DB) ---
const scenario = [
  {
    sender: "ai",
    content: "Welcome back! Today we are mastering **Python OOP**. Object-Oriented Programming is like building with Lego blocks. You create a blueprint (Class) and make specific objects from it.<br><br>Ready for an example?",
    delay: 500
  }
];

// --- Initialization ---
function init() {
  renderMessages();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderMessage(msg) {
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ${msg.sender}`;
  
  let html = `<div class="msg-bubble">${msg.content}</div>`;
  if (msg.gamification) {
    html += `<span class="feedback-badge">${msg.gamification}</span>`;
  }
  
  wrapper.innerHTML = html;
  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

function renderMessages() {
  chatMessages.innerHTML = '';
  scenario.forEach(renderMessage);
}

// --- Interaction Logic (Simulated AI Engine) ---
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  // 1. Add User Message
  renderMessage({ sender: "user", content: text });
  chatInput.value = '';

  // 2. Simulate AI Analysis & Response
  setTimeout(() => {
    analyzeAndRespond(text);
  }, 800);
});

function analyzeAndRespond(input) {
  const lowerInput = input.toLowerCase();
  let aiResponse = "";
  let gamification = null;

  if (mode === "challenge") {
    // Challenge Mode Logic
    if (lowerInput.includes("car") || lowerInput.includes("ferrari")) {
      if (lowerInput.includes("new")) {
        aiResponse = "❌ Close! But `new` is JavaScript/Java syntax. In Python, we just call the class directly without `new`. Try again.";
      } else {
        aiResponse = "✅ Perfect! You correctly instantiated a Python object.<br><code>ferrari = Car('red')</code>";
        gamification = "🎯 +10XP (Challenge Passed)";
        updateProgress(10);
      }
    } else {
      aiResponse = "Think about how we instantiate classes in Python. Write the code to create a red Ferrari using a `Car` class.";
    }
  } else {
    // Explain Mode Logic
    if (lowerInput.includes("yes") || lowerInput.includes("sure")) {
      aiResponse = "Great! Here is a simple Python Class:<br><pre><code>class Car:\n  def __init__(self, color):\n    self.color = color</code></pre><br>Now, how would you create a red Ferrari using this class?";
      modeSwitch.checked = true;
      toggleMode(); // Automatically switch to challenge to test them
    } else if (lowerInput.includes("don't get it") || lowerInput.includes("confused")) {
      aiResponse = "No worries! Let's simplify. Imagine a `Class` is a cookie cutter, and the `Object` is the actual cookie you bake. Make sense?";
      gamification = "💡 Switched to ELI5 mode";
    } else {
      aiResponse = "Interesting! Let's keep exploring Python classes. Try to define what an `__init__` function does.";
    }
  }

  renderMessage({ sender: "ai", content: aiResponse, gamification });
}

function updateProgress(amount) {
  comprehensionScore += amount;
  if (comprehensionScore > 100) comprehensionScore = 100;
  progressBar.style.width = `${comprehensionScore}%`;
  document.querySelector('.progress-text').innerText = `${comprehensionScore}% Complete`;
}

// --- Mode Toggle ---
function toggleMode() {
  if (modeSwitch.checked) {
    mode = "challenge";
    modeLabel.innerText = "Challenge Mode";
    modeLabel.style.color = "var(--warning)";
  } else {
    mode = "explain";
    modeLabel.innerText = "Explain Mode";
    modeLabel.style.color = "var(--primary)";
  }
}

modeSwitch.addEventListener('change', toggleMode);

// Event listener for "I don't get it" helper button
document.querySelector('.context-actions button:nth-child(2)').addEventListener('click', () => {
  chatInput.value = "I don't get it, can you explain simpler?";
  chatForm.dispatchEvent(new Event('submit'));
});

// Start App
init();
