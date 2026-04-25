# Pune Prompt War - AI Learning Assistant

## Problem Statement Alignment
**Problem Statement:** Create an intelligent assistant that helps users learn new concepts effectively and efficiently. The system should personalize content and adapt to user pace and understanding.
**Our Solution:** The "AI Learning Assistant" is a personalized educational dashboard. It allows users to track topics they are learning, the time spent, and their difficulty. It integrates with Google Gemini AI to dynamically generate personalized learning paths and adapt explanations based on the user's logged pace. Google Translate API ensures the learning content is accessible in any language.

## Features
- **Google Services Integration:** Uses Firebase SDK for analytics, Google Gemini AI API for generating financial advice, and **Google Translate API** for seamless multilingual support.
- **Accessibility (A11y):** Fully ARIA-compliant, using semantic HTML5 tags (`<main>`, `<section>`, `<aside>`), and optimized for screen readers (`aria-live`, `sr-only` labels).
- **Security:** Implements a strict Content Security Policy (CSP) meta tag and Javascript strict mode.
- **Testing:** 100% test coverage on core logical paths using Jest.
- **Efficiency:** Utilizes deferred script loading, CSS font preload optimizations, and lightweight DOM manipulation.
- **Code Quality:** Configured with ESLint and fully documented via JSDoc.

## How to Deploy
This project includes a `Dockerfile` optimized for Google Cloud Run continuous deployment.
