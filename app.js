"use strict";

/**
 * AI Learning Assistant State Management
 */
// Use new localstorage keys to avoid clashes with the old "Earning Assistant"
let topics = JSON.parse(localStorage.getItem('learning_topics')) || [];
let goal = parseFloat(localStorage.getItem('learning_goal')) || 10;
let accountProfile = JSON.parse(localStorage.getItem('learner_profile')) || {
  name: 'Learner',
  role: 'Student',
  bank: 'Beginner'
};

// DOM Elements
const form = document.getElementById('earning-form');
const amountInput = document.getElementById('amount');
const sourceInput = document.getElementById('source');
const dateInput = document.getElementById('date');
const categoryInput = document.getElementById('category');

const earningList = document.getElementById('earning-list');
const totalEarningsEl = document.getElementById('total-earnings');
const monthEarningsEl = document.getElementById('month-earnings');

const goalInput = document.getElementById('goal-input');
const setGoalBtn = document.getElementById('set-goal-btn');
const goalText = document.getElementById('goal-text');
const progressBar = document.getElementById('progress-bar');

const accountDisplay = document.getElementById('account-display');
const accountForm = document.getElementById('account-form');
const displayName = document.getElementById('display-name');
const displayRole = document.getElementById('display-role');
const displayBank = document.getElementById('display-bank');

const editAccountBtn = document.getElementById('edit-account-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const inputName = document.getElementById('input-name');
const inputRole = document.getElementById('input-role');
const inputBank = document.getElementById('input-bank');

const aiBtn = document.getElementById('get-ai-advice-btn');
const aiText = document.getElementById('ai-advice-text');

// Chatbot DOM
const chatContainer = document.getElementById('chatbot-container');
const chatHeader = document.getElementById('chatbot-header');
const chatMessages = document.getElementById('chatbot-messages');
const chatForm = document.getElementById('chatbot-form');
const chatInput = document.getElementById('chatbot-input-field');

/**
 * Initialize application state and DOM.
 */
function init() {
  dateInput.valueAsDate = new Date();
  goalInput.value = goal;
  updateAccountDOM();
  updateDOM();
}

/**
 * Update the User Profile DOM section.
 */
function updateAccountDOM() {
  displayName.innerText = accountProfile.name;
  displayRole.innerText = accountProfile.role;
  displayBank.innerText = accountProfile.bank || 'Beginner';
}

function formatHours(amount) {
  return amount + 'h';
}

function getTotals() {
  const total = topics.reduce((acc, curr) => acc + curr.amount, 0);
  const count = topics.length;
  
  return { total, count };
}

function updateDOM() {
  earningList.innerHTML = '';

  if (topics.length === 0) {
    earningList.innerHTML = '<div class="empty-state">No concepts added yet. Start learning!</div>';
  } else {
    const sortedTopics = [...topics].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedTopics.forEach(topic => {
      const li = document.createElement('li');
      li.classList.add('earning-item');
      li.setAttribute('role', 'listitem');
      
      const dateFormatted = new Date(topic.date).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric' 
      });

      li.innerHTML = `
        <div class="item-info">
          <span class="item-title">${topic.source}</span>
          <span class="item-date">${dateFormatted} &bull; ${topic.category}</span>
        </div>
        <div class="item-right">
          <span class="item-amount">${formatHours(topic.amount)}</span>
          <button class="delete-btn" onclick="removeTopic('${topic.id}')" aria-label="Delete ${topic.source}">
             &times;
          </button>
        </div>
      `;
      earningList.appendChild(li);
    });
  }

  const { total, count } = getTotals();
  totalEarningsEl.innerText = formatHours(total);
  monthEarningsEl.innerText = count.toString(); // Display count instead of month total

  goalText.innerText = `${formatHours(total)} / ${formatHours(goal)}`;
  const progressPercentage = Math.min((total / goal) * 100, 100);
  progressBar.style.width = `${progressPercentage}%`;

  localStorage.setItem('learning_topics', JSON.stringify(topics));
  localStorage.setItem('learning_goal', goal);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);
  const source = sourceInput.value.trim();
  const date = dateInput.value;
  const category = categoryInput.value;

  if (!amount || !source || !date) return;

  const newTopic = {
    id: crypto.randomUUID(),
    amount,
    source,
    date,
    category
  };

  topics.push(newTopic);
  amountInput.value = '';
  sourceInput.value = '';
  amountInput.focus();
  updateDOM();
});

window.removeTopic = function(id) {
  topics = topics.filter(t => t.id !== id);
  updateDOM();
};

setGoalBtn.addEventListener('click', () => {
  const newGoal = parseFloat(goalInput.value);
  if (newGoal && newGoal > 0) {
    goal = newGoal;
    updateDOM();
  }
});

editAccountBtn.addEventListener('click', () => {
  accountDisplay.classList.add('hidden');
  accountForm.classList.remove('hidden');
  inputName.value = accountProfile.name;
  inputRole.value = accountProfile.role;
  inputBank.value = accountProfile.bank === 'Not set' ? '' : accountProfile.bank;
});

cancelEditBtn.addEventListener('click', () => {
  accountForm.classList.add('hidden');
  accountDisplay.classList.remove('hidden');
});

accountForm.addEventListener('submit', (e) => {
  e.preventDefault();
  accountProfile = {
    name: inputName.value.trim() || 'Learner',
    role: inputRole.value.trim() || 'Student',
    bank: inputBank.value.trim() || 'Beginner'
  };
  localStorage.setItem('learner_profile', JSON.stringify(accountProfile));
  updateAccountDOM();
  accountForm.classList.add('hidden');
  accountDisplay.classList.remove('hidden');
});

// Simulate AI Study Plan
aiBtn.addEventListener('click', () => {
  aiBtn.innerText = "Analyzing via Google Gemini...";
  aiBtn.disabled = true;
  
  setTimeout(() => {
    const { total } = getTotals();
    let advice = "";
    if (total === 0) advice = "You haven't logged any study hours yet. Pick a small concept and start with 30 minutes!";
    else if (total < 5) advice = `Great start with ${total} hours! Based on your pace, Gemini suggests trying the Feynman technique.`;
    else advice = `Impressive dedication! You've logged ${total} hours. Gemini recommends building a small project to apply what you've learned.`;
    
    aiText.innerText = `🤖 Gemini: ${advice}`;
    aiText.style.color = "var(--text-main)";
    
    aiBtn.innerText = "Refresh Study Plan";
    aiBtn.disabled = false;
  }, 1500);
});

// Chatbot Logic
chatHeader.addEventListener('click', () => {
  chatContainer.classList.toggle('collapsed');
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  
  // Add User Msg
  const userDiv = document.createElement('div');
  userDiv.className = 'msg user';
  userDiv.innerText = text;
  chatMessages.appendChild(userDiv);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Add AI Reply after delay
  setTimeout(() => {
    const aiDiv = document.createElement('div');
    aiDiv.className = 'msg ai';
    
    // Simulate smart responses based on input
    if(text.toLowerCase().includes('react')) aiDiv.innerText = "React is great! Make sure you understand the difference between useEffect and useMemo.";
    else if(text.toLowerCase().includes('help')) aiDiv.innerText = "I can help you break down complex concepts into simple analogies. What are you studying?";
    else aiDiv.innerText = "That's an interesting topic! Would you like me to generate a 5-step learning path for it?";
    
    chatMessages.appendChild(aiDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 1000);
});

// Start App
init();
