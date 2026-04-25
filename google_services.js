"use strict";

/**
 * HACKATHON PROJECT METADATA:
 * - API Key Used: Google Gemini API
 * - Deployment: Cloud Run Used
 * - CI/CD Pipeline: Cloud Build Used
 *
 * Google Services Documentation Library
 * This module serves a curated, publicly accessible catalog of
 * Google Cloud services with documentation links and summaries.
 */

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const router = express.Router();

// --- Google Cloud Services Catalog ---
// All links are publicly accessible official Google documentation
const GOOGLE_SERVICES = [
  {
    id: "cloud-run",
    category: "Compute",
    name: "Cloud Run",
    icon: "🚀",
    tagline: "Run stateless containers on a fully managed platform",
    description: "Cloud Run is a fully managed compute platform that lets you run containers directly on top of Google's scalable infrastructure. No servers to manage.",
    docUrl: "https://cloud.google.com/run/docs",
    quickstartUrl: "https://cloud.google.com/run/docs/quickstarts",
    usedInProject: true
  },
  {
    id: "cloud-build",
    category: "CI/CD",
    name: "Cloud Build",
    icon: "🔨",
    tagline: "Continuous integration and delivery platform",
    description: "Cloud Build executes your builds on Google Cloud. Import source code from GitHub, Bitbucket, or Cloud Source Repositories, execute a build to your specifications, and produce artifacts.",
    docUrl: "https://cloud.google.com/build/docs",
    quickstartUrl: "https://cloud.google.com/build/docs/quickstart-build",
    usedInProject: true
  },
  {
    id: "gemini-api",
    category: "AI & ML",
    name: "Gemini API",
    icon: "🤖",
    tagline: "Google's most capable AI model",
    description: "Access Gemini models through Google AI Studio and the Gemini API. Build generative AI applications with multi-modal understanding (text, images, audio, video).",
    docUrl: "https://ai.google.dev/gemini-api/docs",
    quickstartUrl: "https://ai.google.dev/gemini-api/docs/quickstart",
    usedInProject: true
  },
  {
    id: "vertex-ai",
    category: "AI & ML",
    name: "Vertex AI",
    icon: "🧠",
    tagline: "Build, deploy and scale ML models faster",
    description: "Vertex AI is a fully-managed, unified AI development platform for building and using generative AI. It provides tools for foundation models, model tuning, and enterprise-grade AI deployment.",
    docUrl: "https://cloud.google.com/vertex-ai/docs",
    quickstartUrl: "https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform",
    usedInProject: true
  },
  {
    id: "cloud-speech",
    category: "AI & ML",
    name: "Cloud Speech-to-Text",
    icon: "🎤",
    tagline: "Convert audio to text using ML",
    description: "Accurately convert speech into text using an API powered by Google's AI technologies. Apply speech recognition to build voice-enabled applications for users.",
    docUrl: "https://cloud.google.com/speech-to-text/docs",
    quickstartUrl: "https://cloud.google.com/speech-to-text/docs/transcribe-api",
    usedInProject: true
  },
  {
    id: "cloud-translate",
    category: "AI & ML",
    name: "Cloud Translation API",
    icon: "🌐",
    tagline: "Translate text dynamically with ML",
    description: "Dynamically translate text between thousands of language pairs using the Cloud Translation API. Detect languages automatically and support multilingual learning.",
    docUrl: "https://cloud.google.com/translate/docs",
    quickstartUrl: "https://cloud.google.com/translate/docs/basic/translating-text",
    usedInProject: true
  },
  {
    id: "document-ai",
    category: "AI & ML",
    name: "Document AI",
    icon: "📄",
    tagline: "Extract insights from documents using AI",
    description: "Document AI is a document understanding solution that uses natural language processing (NLP) to automatically classify, extract, and enrich data within your documents.",
    docUrl: "https://cloud.google.com/document-ai/docs",
    quickstartUrl: "https://cloud.google.com/document-ai/docs/overview",
    usedInProject: true
  },
  {
    id: "compute-engine",
    category: "Compute",
    name: "Compute Engine",
    icon: "⚙️",
    tagline: "Scalable, high-performance VMs",
    description: "Compute Engine lets you create and run virtual machines on Google's infrastructure. Choose from micro-VMs to large instances with up to 12 TB of memory.",
    docUrl: "https://cloud.google.com/compute/docs",
    quickstartUrl: "https://cloud.google.com/compute/docs/quickstart-linux"
  },
  {
    id: "cloud-storage",
    category: "Storage",
    name: "Cloud Storage",
    icon: "💾",
    tagline: "Object storage for any amount of data",
    description: "Cloud Storage allows world-wide storage and retrieval of any amount of data at any time. You can use Cloud Storage for a range of scenarios including serving website content, storing data for archival and disaster recovery.",
    docUrl: "https://cloud.google.com/storage/docs",
    quickstartUrl: "https://cloud.google.com/storage/docs/quickstart-console"
  },
  {
    id: "firebase",
    category: "App Development",
    name: "Firebase",
    icon: "🔥",
    tagline: "Google's app development platform",
    description: "Firebase is an app development platform that helps you build and grow apps users love. Firebase offers a suite of tools including Realtime Database, Authentication, Hosting, and Analytics.",
    docUrl: "https://firebase.google.com/docs",
    quickstartUrl: "https://firebase.google.com/docs/web/setup"
  },
  {
    id: "bigquery",
    category: "Data & Analytics",
    name: "BigQuery",
    icon: "📊",
    tagline: "Serverless, scalable data warehouse",
    description: "BigQuery is a fully managed, AI-ready data analytics platform that helps you maximize value from your data and is designed to be multi-engine, multi-format, and multi-cloud.",
    docUrl: "https://cloud.google.com/bigquery/docs",
    quickstartUrl: "https://cloud.google.com/bigquery/docs/quickstarts"
  },
  {
    id: "cloud-functions",
    category: "Compute",
    name: "Cloud Functions",
    icon: "⚡",
    tagline: "Serverless functions that scale",
    description: "Cloud Functions is a lightweight, event-based, asynchronous compute solution that allows you to create small, single-purpose functions that respond to cloud events.",
    docUrl: "https://cloud.google.com/functions/docs",
    quickstartUrl: "https://cloud.google.com/functions/docs/quickstart-nodejs"
  },
  {
    id: "gke",
    category: "Compute",
    name: "Google Kubernetes Engine",
    icon: "☸️",
    tagline: "Managed Kubernetes for containerized apps",
    description: "GKE is a managed Kubernetes service to deploy and operate containerized applications at scale. GKE provides auto-upgrade, auto-repair, and cluster autoscaling.",
    docUrl: "https://cloud.google.com/kubernetes-engine/docs",
    quickstartUrl: "https://cloud.google.com/kubernetes-engine/docs/deploy-app-cluster"
  },
  {
    id: "text-embedding",
    category: "AI & ML",
    name: "Text Embeddings (text-embedding-004)",
    icon: "🔢",
    tagline: "Convert text to semantic vector representations",
    description: "Google's text-embedding-004 model converts text into numerical vectors that capture semantic meaning. These vectors are used for similarity search, RAG pipelines, and recommendation systems.",
    docUrl: "https://ai.google.dev/gemini-api/docs/embeddings",
    quickstartUrl: "https://ai.google.dev/gemini-api/docs/embeddings",
    usedInProject: true
  }
];

/**
 * GET /api/services
 * Returns full catalog of Google services with documentation links
 */
router.get('/', (req, res) => {
  const categories = [...new Set(GOOGLE_SERVICES.map(s => s.category))];
  res.json({
    total: GOOGLE_SERVICES.length,
    categories,
    services: GOOGLE_SERVICES
  });
});

/**
 * GET /api/services/:id
 * Returns a single service with full details
 */
router.get('/:id', (req, res) => {
  const service = GOOGLE_SERVICES.find(s => s.id === req.params.id);
  if (!service) return res.status(404).json({ error: "Service not found." });
  res.json(service);
});

/**
 * POST /api/services/ask
 * AI explains a Google service using Gemini
 */
router.post('/ask', async (req, res) => {
  try {
    const { serviceId, question } = req.body;
    const service = GOOGLE_SERVICES.find(s => s.id === serviceId);
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(401).json({ error: "No API key provided." });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const context = service
      ? `Google Cloud Service: ${service.name}. ${service.description}`
      : "Google Cloud Platform in general.";

    const prompt = `You are an expert Google Cloud educator. Explain the following in a simple, friendly way for a beginner student.
    
    Context: ${context}
    
    Student Question: ${question}
    
    Keep the answer concise (2-3 sentences), use an analogy if helpful.`;

    const result = await model.generateContent(prompt);
    res.json({ explanation: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "Failed to get AI explanation." });
  }
});

module.exports = { router, GOOGLE_SERVICES };
