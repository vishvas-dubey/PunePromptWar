# AdaptiveLearn AI: Production-Grade Learning Companion

## 🏆 Pune Prompt War Submission
This project is an advanced, production-grade AI Learning Assistant built for the Pune Prompt War competition. It leverages Google's state-of-the-art Generative AI and Cloud infrastructure to provide a personalized, multi-modal, and adaptive educational experience.

### 🎯 Chosen Vertical: Adaptive Learning & Personalized Tutoring
We focus on creating a system that doesn't just answer questions but understands the student's context, adapts its teaching style, and manages long-term learning goals.

---

## 🚀 Key Features

### 1. Dynamic AI Chatbot (Gemini Powered)
- **Context-Aware:** Remembers conversation history and adapts explanations based on the selected mode (Explain, Quiz, or Summary).
- **RAG Implementation:** Retrieval-Augmented Generation allowing students to upload PDFs and get context-accurate answers and quizzes.

### 2. Multi-Modal Interaction
- **Voice-to-Text (Input):** Seamless voice commands for hands-free learning.
- **Text-to-Speech (Output):** AI read-aloud feature for better accessibility.

### 3. Google Cloud Services Library
- A dedicated, interactive library for students to learn about Google's infrastructure (Cloud Run, Vertex AI, GKE, etc.) with direct links to official documentation.

### 4. Advanced Learning Analytics
- **Personalized Reports:** Generates 3-paragraph learning summaries based on comprehension scores and chat history.
- **Knowledge Graph:** Visual representation of mastered vs. in-progress topics.

---

## 🛠️ Technical Architecture & Google Services

This project is built using a **production-ready Node.js/Express backend** and a **modern Glassmorphism CSS/JS frontend**.

### Google Cloud Integration:
- **Google Gemini API:** Core brain for natural language understanding and generation.
- **text-embedding-004:** Used for generating semantic vectors for the RAG pipeline.
- **Vertex AI SDK:** Integrated for enterprise-grade AI model management.
- **Cloud Speech-to-Text & Translation:** Integrated for multi-modal and multilingual capabilities.
- **Cloud Run:** Used for serverless deployment with automatic scaling.
- **Cloud Build:** CI/CD pipeline for automated testing and deployment.
- **Document AI:** Integrated for advanced PDF/Document text extraction.

---

## 🛡️ Security & Quality Focus

- **Safe Implementation:** Uses `Helmet`, `CORS`, and `XSS-clean` middleware to prevent common web vulnerabilities.
- **Rate Limiting:** Implemented `express-rate-limit` to prevent API abuse and DDoS attacks.
- **Testing:** Unit tests built with `Jest` and `Supertest` to ensure API reliability.
- **Accessibility:** Built with Semantic HTML5 and ARIA labels for screen-reader compatibility.
- **Resource Efficiency:** Chunks RAG data and uses `compression` middleware to reduce network latency.

---

## 📖 How it Works

1. **Start Learning:** Choose a topic (e.g., Python, Gen AI) and start chatting.
2. **Personalize:** Toggle the "Mode" switch to change how the AI responds.
3. **Deep Dive:** Upload a textbook PDF to the RAG pipeline to generate a custom quiz and ask specific questions about the document.
4. **Review:** Click "Generate Report" at any time to see an AI-driven analysis of your progress.
5. **Explore:** Use the Google Services panel to learn about the infrastructure powering this app.

---

## 📝 Assumptions & Notes
- The demo uses a fallback API key for stability during judging, but production deployments should use `GEMINI_API_KEY` as a secret in Cloud Run.
- The RAG pipeline simulates a vector store in-memory for speed and simplicity in the demo environment.

---
*Created with ❤️ for Pune Prompt War.*
