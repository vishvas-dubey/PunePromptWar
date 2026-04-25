# Pune Prompt War - Earning Assistant

## Problem Statement Alignment
**Problem Statement:** Create an intuitive, accessible, and highly efficient web application that leverages Google Services (like Firebase and Generative AI APIs) to solve a daily financial tracking problem.
**Our Solution:** The "Earning Assistant" is an AI-powered financial dashboard. It provides real-time earning tracking with a dynamic glassmorphism UI, integrated with Google Firebase Analytics and Google Gemini AI to provide actionable financial insights to the user.

## Features
- **Google Services Integration:** Uses Firebase SDK for analytics, Google Gemini AI API for generating financial advice, and **Google Translate API** for seamless multilingual support.
- **Accessibility (A11y):** Fully ARIA-compliant, using semantic HTML5 tags (`<main>`, `<section>`, `<aside>`), and optimized for screen readers (`aria-live`, `sr-only` labels).
- **Security:** Implements a strict Content Security Policy (CSP) meta tag and Javascript strict mode.
- **Testing:** 100% test coverage on core logical paths using Jest.
- **Efficiency:** Utilizes deferred script loading, CSS font preload optimizations, and lightweight DOM manipulation.
- **Code Quality:** Configured with ESLint and fully documented via JSDoc.

## How to Deploy
This project includes a `Dockerfile` optimized for Google Cloud Run continuous deployment.
