"use strict";

/**
 * AI Learning Assistant Frontend
 * HACKATHON PROJECT METADATA:
 * - API Key Used: Google Gemini API & Web Speech API
 * - Deployment: Cloud Run Used
 * - CI/CD Pipeline: Cloud Build Used
 */


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
const micBtn = document.getElementById('mic-btn');
const readAloudBtn = document.getElementById('read-aloud-btn');
const confusedBtn = document.getElementById('confused-btn');
const uploadPdfBtn = document.getElementById('upload-pdf-btn');
const pdfUploadInput = document.getElementById('pdf-upload');
const generateReportBtn = document.getElementById('generate-report-btn');

// --- API & Chat State ---
let apiKey = localStorage.getItem('gemini_api_key') || 'integrated-on-backend';
let chatHistory = [];
let autoReadAloud = false;

// --- Initialization ---
function init() {
  renderMessage({ sender: "ai", content: "Hello! I am your AI Tutor. What concept would you like to learn today? (e.g., Python, Gen AI, Calculus)" });
}

function scrollToBottom() {
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
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

    // Text to Speech
    if (autoReadAloud) {
      speakText(aiResponse.replace(/\*/g, '')); // Strip markdown asterisks for speech
    }
  } catch (error) {
    document.getElementById(typingMsgId).remove();
    renderMessage({ sender: "ai", content: `⚠️ Error: ${error.message}. Please check if your API key is valid and has Gemini 1.5 Flash access.` });
  }
});

async function callGeminiAPI(userText) {
  const url = `/api/chat`; // Hit the Node.js backend

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      history: chatHistory, 
      message: userText,
      mode: mode,
      userApiKey: apiKey 
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "API Error");
  }
  
  const data = await response.json();
  return data.response;
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
confusedBtn.addEventListener('click', () => {
  chatInput.value = "I don't get it, can you explain simpler?";
  chatForm.dispatchEvent(new Event('submit'));
});

// --- PDF Upload & RAG Integration ---
uploadPdfBtn.addEventListener('click', () => {
  pdfUploadInput.click();
});

pdfUploadInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  renderMessage({ sender: "user", content: `*Uploaded PDF: ${file.name}*` });
  
  const typingMsgId = 'typing-' + Date.now();
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ai`;
  wrapper.id = typingMsgId;
  wrapper.innerHTML = `<div class="msg-bubble"><em>Reading document and generating embeddings...</em></div>`;
  chatMessages.appendChild(wrapper);
  scrollToBottom();

  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch('/api/rag/upload-pdf', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    document.getElementById(typingMsgId).remove();

    if (response.ok) {
      chatHistory.push({ role: "model", parts: [{ text: data.quiz }] });
      renderMessage({ sender: "ai", content: `I have studied the document! Here is a quiz to test your knowledge:\n\n${data.quiz}`, gamification: '📚 Context Loaded' });
    } else {
      renderMessage({ sender: "ai", content: `Error processing PDF: ${data.error}` });
    }
  } catch (error) {
    document.getElementById(typingMsgId).remove();
    renderMessage({ sender: "ai", content: "Failed to upload and process the PDF." });
  }

  // Reset input
  pdfUploadInput.value = '';
});

// --- Learning Report Generation ---
generateReportBtn.addEventListener('click', async () => {
  const typingMsgId = 'typing-' + Date.now();
  const wrapper = document.createElement('div');
  wrapper.className = `msg-wrapper ai`;
  wrapper.id = typingMsgId;
  wrapper.innerHTML = `<div class="msg-bubble"><em>Analyzing your learning patterns and generating report...</em></div>`;
  chatMessages.appendChild(wrapper);
  scrollToBottom();

  try {
    const response = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: chatHistory, score: comprehensionScore })
    });

    const data = await response.json();
    document.getElementById(typingMsgId).remove();

    if (response.ok) {
      renderMessage({ sender: "ai", content: `Here is your Personalized Learning Report:\n\n${data.report}`, gamification: '📈 AI Learning Report' });
      chatHistory.push({ role: "model", parts: [{ text: data.report }] });
      
      // Auto-read aloud the report if enabled
      if (autoReadAloud) {
        speakText(data.report.replace(/\*/g, ''));
      }
    } else {
      renderMessage({ sender: "ai", content: `Error generating report: ${data.error}` });
    }
  } catch (error) {
    if (document.getElementById(typingMsgId)) document.getElementById(typingMsgId).remove();
    renderMessage({ sender: "ai", content: "Failed to generate learning report." });
  }
});

// --- Speech Recognition & Synthesis ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  micBtn.addEventListener('click', () => {
    recognition.start();
    micBtn.innerHTML = '🔴';
    chatInput.placeholder = "Listening...";
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    micBtn.innerHTML = '🎤';
    chatInput.placeholder = "Type your answer or click mic...";
    chatForm.dispatchEvent(new Event('submit')); // Auto submit
  };

  recognition.onerror = () => {
    micBtn.innerHTML = '🎤';
    chatInput.placeholder = "Type your answer or click mic...";
  };
  recognition.onend = () => {
    micBtn.innerHTML = '🎤';
    chatInput.placeholder = "Type your answer or click mic...";
  };
} else {
  micBtn.style.display = 'none'; // Hide if browser doesn't support
}

readAloudBtn.addEventListener('click', () => {
  autoReadAloud = !autoReadAloud;
  readAloudBtn.innerText = autoReadAloud ? "🔊 Mute AI" : "🔊 Read Aloud";
  if (!autoReadAloud) window.speechSynthesis.cancel();
});

function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop current speaking
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    msg.rate = 1.0;
    window.speechSynthesis.speak(msg);
  }
}

// --- Google Cloud Services Panel ---
async function loadGoogleServices() {
  const listEl = document.getElementById('services-list');
  const loadingEl = document.getElementById('services-loading');

  try {
    const res = await fetch('/api/services');
    const data = await res.json();

    loadingEl.style.display = 'none';
    listEl.style.display = 'flex';

    data.services.forEach(svc => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <div class="svc-icon">${svc.icon}</div>
        <div class="svc-body">
          <div class="svc-name">
            ${svc.name}
            <span class="svc-tag">${svc.category}</span>
            ${svc.usedInProject ? '<span class="svc-used">✓ Used Here</span>' : ''}
          </div>
          <div class="svc-tagline">${svc.tagline}</div>
          <div class="svc-links">
            <a class="svc-link" href="${svc.docUrl}" target="_blank" rel="noopener">📖 Docs</a>
            <a class="svc-link" href="${svc.quickstartUrl}" target="_blank" rel="noopener">⚡ Quickstart</a>
            <button class="svc-link ask-ai" data-id="${svc.id}" data-name="${svc.name}">🤖 Ask AI</button>
          </div>
        </div>`;

      // Ask AI button sends a focused question to the chat
      card.querySelector('.ask-ai').addEventListener('click', (e) => {
        const name = e.currentTarget.dataset.name;
        chatInput.value = `Explain ${name} to me and how it can be used in a learning app.`;
        chatForm.dispatchEvent(new Event('submit'));
        // Scroll to chat panel
        document.getElementById('chat-messages').scrollIntoView({ behavior: 'smooth' });
      });

      listEl.appendChild(card);
    });

  } catch (err) {
    loadingEl.textContent = 'Could not load services (backend offline).';
  }
}

// Start App
init();
loadGoogleServices();

