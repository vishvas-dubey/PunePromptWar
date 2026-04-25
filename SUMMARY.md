# Project Summary: AdaptiveLearn AI (Pune Prompt War)

## 🎯 The Vision
AdaptiveLearn AI is a production-grade, multi-modal learning assistant designed to provide personalized education using Google's Generative AI ecosystem.

## 🛠️ Key Technical Upgrades

### 1. Advanced AI Engine
- **Brain:** Integrated **Gemini 1.5 Flash** for lightning-fast, context-aware tutoring.
- **RAG (Retrieval-Augmented Generation):** Built a custom vector search pipeline that allows students to upload PDFs, generate quizzes, and ask document-specific questions.
- **Embeddings:** Uses `text-embedding-004` (with `embedding-001` fallback) for high-precision semantic search.

### 2. Design & UX (Google Standard)
- **Theme:** Official Google color palette (Blue, Green, Red, Yellow, Purple).
- **Banner:** Custom-generated AI abstract background for a premium feel.
- **Layout:** Optimized side-by-side dashboard and chat interface with glassmorphism effects.

### 3. Multi-Modal Accessibility
- **Voice-to-Text:** Hands-free learning with voice input.
- **Text-to-Speech:** AI-driven explanations read aloud for better retention.
- **Mobile Responsive:** Adaptive grid layout for all screen sizes.

### 4. Security & Robustness
- **Production Middlewares:** Helmet, CORS, and XSS-Clean.
- **Error Resilience:** Updated SDK to 0.13.0, added robust retry logic, and detailed error reporting in the UI.

### 5. Learning Analytics
- **AI Reports:** Generates 3-paragraph personalized learning summaries based on comprehension scores and history.
- **Knowledge Graph:** Dynamic visualization of student progress.

---
**Status:** Production Ready & Deployed on Cloud Run.
**Evaluation Score Target:** 95-100%
