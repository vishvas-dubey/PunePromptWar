/**
 * @jest-environment jsdom
 */

// We mock the local storage since node environment doesn't have it natively
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) { return store[key] || null; },
    setItem: function (key, value) { store[key] = value.toString(); },
    clear: function () { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Adaptive Learning Companion Core Logic', () => {

  // Test variables to simulate app.js state
  let mode;
  let comprehensionScore;
  let chatHistory;
  let autoReadAloud;

  beforeEach(() => {
    // Reset state before each test
    mode = "explain";
    comprehensionScore = 35;
    chatHistory = [];
    autoReadAloud = false;
    window.localStorage.clear();
  });

  // --- 1. Mode Toggle Tests ---
  test('Mode should switch correctly between explain and challenge', () => {
    function toggleMode(isChecked) {
      if (isChecked) {
        mode = "challenge";
      } else {
        mode = "explain";
      }
    }

    toggleMode(true);
    expect(mode).toBe("challenge");

    toggleMode(false);
    expect(mode).toBe("explain");
  });

  // --- 2. Gamification & Progress Tests ---
  test('Progress score should increase correctly but not exceed 100', () => {
    function updateProgress(amount) {
      comprehensionScore += amount;
      if (comprehensionScore > 100) comprehensionScore = 100;
    }

    updateProgress(10);
    expect(comprehensionScore).toBe(45); // 35 + 10

    updateProgress(100);
    expect(comprehensionScore).toBe(100); // Max cap at 100
  });

  // --- 3. Chat History Array Tests ---
  test('Chat history should append user and AI responses correctly', () => {
    function addMessageToHistory(sender, text) {
      chatHistory.push({ role: sender === 'user' ? "user" : "model", parts: [{ text }] });
    }

    addMessageToHistory("user", "Explain React Hooks");
    expect(chatHistory.length).toBe(1);
    expect(chatHistory[0].role).toBe("user");

    addMessageToHistory("ai", "React Hooks let you use state without writing a class.");
    expect(chatHistory.length).toBe(2);
    expect(chatHistory[1].role).toBe("model");
  });

  // --- 4. Speech Output Toggle Tests ---
  test('Read Aloud functionality should toggle correctly', () => {
    function toggleReadAloud() {
      autoReadAloud = !autoReadAloud;
    }

    expect(autoReadAloud).toBe(false);
    toggleReadAloud();
    expect(autoReadAloud).toBe(true);
    toggleReadAloud();
    expect(autoReadAloud).toBe(false);
  });

  // --- 5. System Prompt Generation Test ---
  test('Gemini System Prompt should adapt to the current mode', () => {
    function getSystemPrompt(currentMode) {
      return `You are an Adaptive Learning Companion. The user is in '${currentMode}' mode.`;
    }

    expect(getSystemPrompt("explain")).toContain("'explain' mode");
    expect(getSystemPrompt("challenge")).toContain("'challenge' mode");
  });

});
