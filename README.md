# 🤖 KnowledgeBot

A modern, dark-themed **knowledge-based chatbot** built with **only HTML, CSS, and vanilla JavaScript**. It answers questions from a predefined knowledge base and simulates a **mini RAG (Retrieval Augmented Generation) system** — all running entirely in your browser.

> No npm. No pip. No frameworks. No external APIs. Just open `index.html`.

---

## 📖 Project Overview

KnowledgeBot is a lightweight, fully client-side chatbot. It stores a curated knowledge base of AI concepts directly in JavaScript and uses a lightweight semantic-matching algorithm to find the best answer to a user's question. If no confident match is found, it gracefully tells the user it doesn't know yet.

It is intentionally **beginner friendly** and **well commented**, making it a great learning project for understanding how retrieval-based chatbots work under the hood.

---

## ✨ Features

- 🎨 **Attractive modern UI** — dark theme, gradient accents, glassmorphism panels
- 💬 **Chat interface** — input box, send button, user messages on the right, bot messages on the left
- 🫧 **Rounded chat bubbles** with smooth slide-in animations
- 📱 **Fully responsive** — collapsible sidebar on mobile
- ⏱️ **Timestamps** on every message
- ⌨️ **Typing indicator** while the bot "thinks"
- 💡 **Suggested questions** (randomized) for quick starts
- 🧹 **Clear chat** button to reset the conversation
- 📊 **Knowledge statistics panel** (entries, keywords, questions asked, answered)
- 🎯 **Confidence badges** (High / Medium / Low) on bot answers
- 🧠 **25+ knowledge entries** covering core AI topics
- 🔒 **100% offline** — nothing leaves your browser

---

## 📸 Screenshots

![KnowledgeBot interface](screenshots/knowledgebot-ui.png)

> _The dark-themed chat UI with the knowledge stats panel, suggested questions, and typing indicator._

---

## ⚙️ How It Works

KnowledgeBot follows a simple retrieval pipeline for every question:

```
User Question
      ↓
Normalize text   (lowercase, remove punctuation, collapse spaces)
      ↓
Tokenize         (split into words, remove common stop words)
      ↓
Keyword matching (compare against each entry's question + keywords)
      ↓
Similarity score (blend of Jaccard overlap + query recall)
      ↓
Return best answer  (if score ≥ confidence threshold)
      ↓
Fallback message    (if confidence is too low)
```

### The matching algorithm

1. **Normalize** — The user's text is lowercased, stripped of punctuation, and whitespace is collapsed.
2. **Tokenize** — The text is split into words, and common stop words (`what`, `is`, `the`, …) are removed to reduce noise.
3. **Score each entry** — For every knowledge entry, the bot measures how many user tokens overlap with the entry's question words and keywords. It blends two signals:
   - **Jaccard similarity** — shared tokens ÷ combined vocabulary
   - **Recall** — how much of the user's query was covered
4. **Pick the best** — The highest-scoring entry wins. If its score is below the confidence threshold, the bot returns a friendly fallback message.

---

## 🧠 How This Chatbot Simulates a Mini RAG System

A real **RAG (Retrieval Augmented Generation)** system has three core stages. KnowledgeBot mirrors each of them in a simplified, dependency-free way:

| RAG Stage | Real-world version | KnowledgeBot version |
| --------- | ------------------ | -------------------- |
| **Knowledge Base** | Documents stored as embeddings in a vector database | An array of question/answer/keyword objects in `script.js` |
| **Matching / Retrieval** | Embed the query and run a vector similarity search (e.g. cosine similarity) | Tokenize the query and compute a keyword-overlap similarity score |
| **Retrieval** | Fetch the top-k most relevant chunks | Select the single highest-scoring knowledge entry |
| **Response Generation** | An LLM composes an answer from the retrieved context | Return the stored answer for the best-matching entry (with a confidence badge) |

**In short:**

```
Knowledge Base  →  Matching  →  Retrieval  →  Response Generation
```

This makes KnowledgeBot a perfect, transparent illustration of *why* RAG works — it retrieves relevant knowledge first, then responds based on that knowledge instead of guessing. The same idea, scaled up with embeddings and an LLM, becomes a production RAG application.

---

## 📁 Project Structure

```
zyorabyte_chatbot/
├── index.html      # Markup & app shell
├── style.css       # Dark theme, layout, animations, responsive design
├── script.js       # Knowledge base + retrieval logic + UI rendering
└── README.md       # You are here
```

---

## 🚀 Getting Started

No build step or installation required.

1. Download or clone this repository.
2. Open `index.html` in any modern web browser.
3. Start chatting!

```bash
# Optionally serve it locally (any static server works)
# Python:
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 🌐 Deploying to GitHub Pages

1. Push the project to a GitHub repository.
2. Go to your repo → **Settings** → **Pages**.
3. Under **Build and deployment**, set:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` (or `master`) and folder `/ (root)`
4. Click **Save**.
5. Wait a moment, then visit:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

Because everything is static and dependency-free, it works on GitHub Pages instantly. ✅

---

## 🔮 Future Improvements

- 🔍 Upgrade matching to real embeddings (e.g. TF-IDF or a small in-browser model)
- 💾 Persist chat history with `localStorage`
- 🗣️ Add voice input (Web Speech API) and text-to-speech replies
- 🌗 Light/dark theme toggle
- ✏️ Let users add their own knowledge entries from the UI
- 🌍 Multi-language support
- 📤 Export conversation as text or PDF

---

## 📝 License

Free to use for learning and personal projects.

---

Built with ❤️ using nothing but **HTML, CSS, and JavaScript**.
