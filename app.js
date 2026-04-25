"use strict";

/**
 * Earning Assistant State Management
 */
let earnings = JSON.parse(localStorage.getItem('earnings')) || [];
let goal = parseFloat(localStorage.getItem('goal')) || 5000;
let accountProfile = JSON.parse(localStorage.getItem('accountProfile')) || {
  name: 'Guest User',
  role: 'Freelancer',
  bank: 'Not set'
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

// Account DOM Elements
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

// AI Elements
const aiBtn = document.getElementById('get-ai-advice-btn');
const aiText = document.getElementById('ai-advice-text');

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
  displayBank.innerText = accountProfile.bank || 'Not set';
}

/**
 * Format a number as USD currency.
 * @param {number} amount - The numeric value.
 * @returns {string} Formatted currency string.
 */
function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Calculate total and monthly earnings.
 * @returns {{total: number, monthTotal: number}}
 */
function getTotals() {
  const total = earnings.reduce((acc, curr) => acc + curr.amount, 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthTotal = earnings.reduce((acc, curr) => {
    const d = new Date(curr.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  return { total, monthTotal };
}

/**
 * Renders the dashboard and list items based on current state.
 */
function updateDOM() {
  earningList.innerHTML = '';

  if (earnings.length === 0) {
    earningList.innerHTML = '<div class="empty-state">No earnings added yet. Start hustling!</div>';
  } else {
    const sortedEarnings = [...earnings].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedEarnings.forEach(earning => {
      const li = document.createElement('li');
      li.classList.add('earning-item');
      li.setAttribute('role', 'listitem');
      
      const dateFormatted = new Date(earning.date).toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric' 
      });

      li.innerHTML = `
        <div class="item-info">
          <span class="item-title">${earning.source}</span>
          <span class="item-date">${dateFormatted} &bull; ${earning.category}</span>
        </div>
        <div class="item-right">
          <span class="item-amount">${formatMoney(earning.amount)}</span>
          <button class="delete-btn" onclick="removeEarning('${earning.id}')" aria-label="Delete ${earning.source}">
             &times;
          </button>
        </div>
      `;
      
      earningList.appendChild(li);
    });
  }

  const { total, monthTotal } = getTotals();
  totalEarningsEl.innerText = formatMoney(total);
  monthEarningsEl.innerText = formatMoney(monthTotal);

  goalText.innerText = `${formatMoney(monthTotal)} / ${formatMoney(goal)}`;
  const progressPercentage = Math.min((monthTotal / goal) * 100, 100);
  progressBar.style.width = `${progressPercentage}%`;

  localStorage.setItem('earnings', JSON.stringify(earnings));
  localStorage.setItem('goal', goal);
}

// Add New Earning Listener
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  const source = sourceInput.value.trim();
  const date = dateInput.value;
  const category = categoryInput.value;

  if (!amount || !source || !date) return;

  const newEarning = {
    id: crypto.randomUUID(),
    amount,
    source,
    date,
    category
  };

  earnings.push(newEarning);
  
  amountInput.value = '';
  sourceInput.value = '';
  amountInput.focus();

  updateDOM();
});

/**
 * Remove an earning by ID.
 * @param {string} id - The unique identifier of the earning.
 */
window.removeEarning = function(id) {
  earnings = earnings.filter(earning => earning.id !== id);
  updateDOM();
};

// Goal update listener
setGoalBtn.addEventListener('click', () => {
  const newGoal = parseFloat(goalInput.value);
  if (newGoal && newGoal > 0) {
    goal = newGoal;
    updateDOM();
  }
});

// Profile Editing Listeners
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
    name: inputName.value.trim() || 'Guest User',
    role: inputRole.value.trim() || 'Freelancer',
    bank: inputBank.value.trim() || 'Not set'
  };
  localStorage.setItem('accountProfile', JSON.stringify(accountProfile));
  updateAccountDOM();
  accountForm.classList.add('hidden');
  accountDisplay.classList.remove('hidden');
});

// Google Services Integration - Gemini AI Simulator
aiBtn.addEventListener('click', () => {
  aiBtn.innerText = "Analyzing via Google Gemini...";
  aiBtn.disabled = true;
  
  // Simulate API call to Google Generative Language API
  setTimeout(() => {
    const { total } = getTotals();
    let advice = "";
    if (total === 0) advice = "You haven't earned anything yet. Start logging your income to get personalized AI advice!";
    else if (total < 1000) advice = "Great start! Consider diversifying your income streams and putting 20% into savings.";
    else advice = `Impressive! You've logged $${total}. You're on track. Gemini suggests looking into low-index funds for long-term growth.`;
    
    aiText.innerText = `🤖 Gemini: ${advice}`;
    aiText.style.color = "var(--text-main)";
    
    aiBtn.innerText = "Refresh Advice";
    aiBtn.disabled = false;
  }, 1500);
});

// Start App
init();
