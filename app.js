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
const apiKeyBtn = document.getElementById('api-key-btn');

// --- API & Chat State ---
let apiKey = localStorage.getItem('gemini_api_key') || '';
let chatHistory = [];
// --- Initialization ---
function init() {
  if (!apiKey) {
    renderMessage({ sender: "ai", content: "Hello! To make me truly dynamic and learn ANY topic, please click the 🔑 **Set API Key** button above and enter your Gemini API Key." });
  } else {
    renderMessage({ sender: "ai", content: "Hello! I am your AI Tutor connected to Gemini. What concept would you like to learn today? (e.g., Python, Gen AI, Calculus)" });
  }
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderMessage(msg) {
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ${msg.sender}`;
  
  // Basic markdown to HTML (bold and line breaks)
  let formattedContent = msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  
  let html = `<div class="msg-bubble">${formattedContent}</div>`;
  if (msg.gamification) {
    html += `<span class="feedback-badge">${msg.gamification}</span>`;
  }
  
  wrapper.innerHTML = html;
  chatMessages.appendChild(wrapper);
  scrollToBottom();
}

// --- Interaction Logic (Dynamic Gemini AI) ---
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  renderMessage({ sender: "user", content: text });
  chatHistory.push({ role: "user", parts: [{ text }] });
  chatInput.value = '';

  if (!apiKey) {
    renderMessage({ sender: "ai", content: "Please set your Gemini API key first using the button above!" });
    return;
  }

  // Show typing indicator
  const typingMsgId = 'typing-' + Date.now();
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ai`;
  wrapper.id = typingMsgId;
  wrapper.innerHTML = `<div class="msg-bubble"><em>Thinking...</em></div>`;
  chatMessages.appendChild(wrapper);
  scrollToBottom();

  try {
    const aiResponse = await callGeminiAPI(text);
    document.getElementById(typingMsgId).remove();
    
    chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
    
    // Simple gamification mock
    let gamification = null;
    if (mode === 'challenge' && (aiResponse.toLowerCase().includes('correct') || aiResponse.toLowerCase().includes('excellent'))) {
      gamification = "🎯 +10XP (Challenge Passed)";
      updateProgress(10);
    }
    
    renderMessage({ sender: "ai", content: aiResponse, gamification });
  } catch (error) {
    document.getElementById(typingMsgId).remove();
    renderMessage({ sender: "ai", content: "Error connecting to AI. Please check your API key." });
  }
});

async function callGeminiAPI(userText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  // Format history for Gemini API
  const contents = [...chatHistory];
  
  const systemPrompt = `You are an Adaptive Learning Companion. The user is in '${mode}' mode. 
  If mode is 'explain', teach them concepts clearly using analogies. 
  If mode is 'challenge', ask them questions and DO NOT give the answer directly, evaluate their responses.
  Keep responses concise (max 3 sentences). Use markdown formatting.`;

  // Inject system prompt into the first message
  if (contents.length > 0) {
     contents[contents.length - 1].parts[0].text = systemPrompt + "\n\nUser: " + userText;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents })
  });

  if (!response.ok) throw new Error("API Error");
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
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

// API Key Logic
apiKeyBtn.addEventListener('click', () => {
  const key = prompt("Enter your Google Gemini API Key (get one for free at Google AI Studio):", apiKey);
  if (key !== null) {
    apiKey = key.trim();
    localStorage.setItem('gemini_api_key', apiKey);
    chatHistory = []; // Reset history
    chatMessages.innerHTML = ''; // Clear chat
    init(); // Restart
  }
});

// Event listener for "I don't get it" helper button
document.querySelector('.context-actions button:nth-child(2)').addEventListener('click', () => {
  chatInput.value = "I don't get it, can you explain simpler?";
  chatForm.dispatchEvent(new Event('submit'));
});

// Start App
init();
