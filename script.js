/* ============================================================= */
/*  KnowledgeBot - script.js                                     */
/*  A mini RAG-style chatbot in pure vanilla JavaScript.         */
/*                                                               */
/*  Pipeline:                                                    */
/*    User Question -> Normalize -> Keyword Match ->             */
/*    Similarity Score -> Return Best Answer (or fallback)       */
/* ============================================================= */

/* ============================================================= */
/*  1. KNOWLEDGE BASE                                            */
/*  Each entry has a question, an answer, and optional keywords  */
/*  used to improve retrieval accuracy.                          */
/* ============================================================= */
const KNOWLEDGE_BASE = [
  {
    question: "What is RAG?",
    answer: "RAG stands for Retrieval Augmented Generation. It combines a retrieval system (which fetches relevant knowledge) with a language model (which generates the final answer).",
    keywords: ["rag", "retrieval", "augmented", "generation"]
  },
  {
    question: "What is an LLM?",
    answer: "LLM means Large Language Model. It is an AI model trained on huge amounts of text to understand and generate human-like language.",
    keywords: ["llm", "large", "language", "model"]
  },
  {
    question: "What is embedding?",
    answer: "An embedding converts text into numerical vectors so that machines can measure similarity and meaning between pieces of text.",
    keywords: ["embedding", "vector", "numerical", "representation"]
  },
  {
    question: "What is a vector database?",
    answer: "A vector database stores embeddings and lets you search for the most similar vectors quickly. Examples include Pinecone, Weaviate, and FAISS.",
    keywords: ["vector", "database", "pinecone", "faiss", "weaviate"]
  },
  {
    question: "What is fine-tuning?",
    answer: "Fine-tuning is the process of training an existing model further on a specific dataset so it performs better on a specialized task.",
    keywords: ["fine", "tuning", "training", "specialize"]
  },
  {
    question: "What is a prompt?",
    answer: "A prompt is the input text or instruction you give to a language model to guide the response it produces.",
    keywords: ["prompt", "input", "instruction"]
  },
  {
    question: "What is prompt engineering?",
    answer: "Prompt engineering is the practice of designing and refining prompts to get more accurate, useful, or creative responses from an AI model.",
    keywords: ["prompt", "engineering", "design", "refine"]
  },
  {
    question: "What is a token?",
    answer: "A token is a small chunk of text (a word or part of a word) that a language model processes. Models have token limits for input and output.",
    keywords: ["token", "chunk", "word", "limit"]
  },
  {
    question: "What is semantic search?",
    answer: "Semantic search finds results based on meaning rather than exact keywords, usually by comparing embeddings of the query and documents.",
    keywords: ["semantic", "search", "meaning", "similarity"]
  },
  {
    question: "What is machine learning?",
    answer: "Machine learning is a field of AI where computers learn patterns from data and make predictions without being explicitly programmed for every case.",
    keywords: ["machine", "learning", "ml", "patterns", "data"]
  },
  {
    question: "What is deep learning?",
    answer: "Deep learning is a subset of machine learning that uses multi-layered neural networks to learn complex patterns from large amounts of data.",
    keywords: ["deep", "learning", "neural", "network"]
  },
  {
    question: "What is a neural network?",
    answer: "A neural network is a computing system inspired by the human brain, made of connected nodes (neurons) that process and learn from data.",
    keywords: ["neural", "network", "neuron", "brain"]
  },
  {
    question: "What is artificial intelligence?",
    answer: "Artificial Intelligence (AI) is the simulation of human intelligence in machines that can reason, learn, and make decisions.",
    keywords: ["artificial", "intelligence", "ai"]
  },
  {
    question: "What is natural language processing?",
    answer: "Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret, and generate human language.",
    keywords: ["natural", "language", "processing", "nlp"]
  },
  {
    question: "What is a transformer?",
    answer: "A transformer is a deep learning architecture that uses attention mechanisms to process sequences. It powers most modern LLMs like GPT.",
    keywords: ["transformer", "attention", "architecture", "gpt"]
  },
  {
    question: "What is attention in deep learning?",
    answer: "Attention is a mechanism that lets a model focus on the most relevant parts of the input when producing each part of the output.",
    keywords: ["attention", "mechanism", "focus", "relevant"]
  },
  {
    question: "What is GPT?",
    answer: "GPT stands for Generative Pre-trained Transformer. It is a family of language models that generate text based on the input prompt.",
    keywords: ["gpt", "generative", "pretrained", "transformer"]
  },
  {
    question: "What is hallucination in AI?",
    answer: "Hallucination is when an AI model generates information that sounds confident but is actually false or made up. RAG helps reduce hallucinations.",
    keywords: ["hallucination", "false", "made", "incorrect"]
  },
  {
    question: "What is cosine similarity?",
    answer: "Cosine similarity measures how similar two vectors are by looking at the angle between them. A value near 1 means very similar.",
    keywords: ["cosine", "similarity", "angle", "vectors"]
  },
  {
    question: "What is a chatbot?",
    answer: "A chatbot is a software application that simulates conversation with users through text or voice, often powered by AI.",
    keywords: ["chatbot", "conversation", "bot", "assistant"]
  },
  {
    question: "What is supervised learning?",
    answer: "Supervised learning trains a model on labeled data, where each input has a known correct output the model learns to predict.",
    keywords: ["supervised", "learning", "labeled", "data"]
  },
  {
    question: "What is unsupervised learning?",
    answer: "Unsupervised learning finds patterns and structure in unlabeled data, such as grouping similar items through clustering.",
    keywords: ["unsupervised", "learning", "clustering", "unlabeled"]
  },
  {
    question: "What is reinforcement learning?",
    answer: "Reinforcement learning trains an agent to make decisions by rewarding good actions and penalizing bad ones over many trials.",
    keywords: ["reinforcement", "learning", "reward", "agent"]
  },
  {
    question: "What is overfitting?",
    answer: "Overfitting happens when a model learns the training data too well, including its noise, and performs poorly on new, unseen data.",
    keywords: ["overfitting", "training", "noise", "generalize"]
  },
  {
    question: "What is a dataset?",
    answer: "A dataset is a collection of data used to train, validate, or test machine learning models.",
    keywords: ["dataset", "data", "collection", "training"]
  },
  {
    question: "What is a context window?",
    answer: "A context window is the maximum amount of text (in tokens) a language model can consider at once when generating a response.",
    keywords: ["context", "window", "tokens", "limit"]
  },
  {
    question: "What is zero-shot learning?",
    answer: "Zero-shot learning is when a model performs a task it was never explicitly trained on, using only the instructions in the prompt.",
    keywords: ["zero", "shot", "learning", "task"]
  },
  {
    question: "What is few-shot learning?",
    answer: "Few-shot learning is when you give a model a few examples inside the prompt so it can understand and perform a new task.",
    keywords: ["few", "shot", "learning", "examples"]
  }
];

/* ============================================================= */
/*  2. CONFIGURATION                                            */
/* ============================================================= */
const CONFIG = {
  // Minimum similarity score (0-1) required to accept an answer.
  confidenceThreshold: 0.18,
  // Simulated "thinking" delay range in milliseconds.
  typingDelayMin: 600,
  typingDelayMax: 1200,
  fallbackMessage: "Sorry, I don't have knowledge about that topic yet. Try asking about RAG, LLMs, embeddings, neural networks, or other AI concepts.",
  // Common words ignored during matching to reduce noise.
  stopWords: new Set([
    "what", "is", "a", "an", "the", "of", "in", "on", "to", "and",
    "or", "for", "are", "do", "does", "how", "why", "can", "you",
    "me", "my", "i", "it", "this", "that", "about", "with", "tell"
  ])
};

/* ============================================================= */
/*  3. DOM REFERENCES                                            */
/* ============================================================= */
const dom = {
  messages: document.getElementById("messages"),
  form: document.getElementById("chatForm"),
  input: document.getElementById("userInput"),
  typing: document.getElementById("typingIndicator"),
  suggestions: document.getElementById("suggestionList"),
  clearBtn: document.getElementById("clearChatBtn"),
  menuToggle: document.getElementById("menuToggle"),
  sidebar: document.getElementById("sidebar"),
  statEntries: document.getElementById("statEntries"),
  statKeywords: document.getElementById("statKeywords"),
  statAsked: document.getElementById("statAsked"),
  statMatched: document.getElementById("statMatched")
};

/* Runtime stats counters */
const stats = {
  asked: 0,
  matched: 0
};

/* ============================================================= */
/*  4. TEXT PROCESSING HELPERS                                  */
/* ============================================================= */

/**
 * Normalize text: lowercase, strip punctuation, collapse spaces.
 * @param {string} text
 * @returns {string}
 */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .replace(/\s+/g, " ")      // collapse whitespace
    .trim();
}

/**
 * Tokenize normalized text into meaningful words (stop words removed).
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((word) => word.length > 1 && !CONFIG.stopWords.has(word));
}

/* ============================================================= */
/*  5. RETRIEVAL MECHANISM (lightweight semantic matching)      */
/* ============================================================= */

/**
 * Score a single knowledge entry against the user's tokens.
 * Combines keyword overlap with question-word overlap (Jaccard-style).
 * @param {string[]} userTokens
 * @param {object} entry
 * @returns {number} similarity score between 0 and 1
 */
function scoreEntry(userTokens, entry) {
  if (userTokens.length === 0) return 0;

  // Build the searchable token set for this entry.
  const entryTokens = new Set([
    ...tokenize(entry.question),
    ...entry.keywords.map((k) => k.toLowerCase())
  ]);

  // Count how many user tokens appear in the entry token set.
  let overlap = 0;
  for (const token of userTokens) {
    if (entryTokens.has(token)) {
      overlap += 1;
    }
  }

  // Jaccard-like similarity: shared tokens over the combined vocabulary.
  const unionSize = new Set([...userTokens, ...entryTokens]).size;
  const jaccard = overlap / unionSize;

  // Recall component: how much of the user's query was covered.
  const recall = overlap / userTokens.length;

  // Weighted blend favors covering the user's intent while
  // still rewarding precise matches.
  return jaccard * 0.5 + recall * 0.5;
}

/**
 * Find the best matching knowledge entry for a user query.
 * @param {string} query
 * @returns {{entry: object|null, score: number}}
 */
function retrieveAnswer(query) {
  const userTokens = tokenize(query);
  let best = { entry: null, score: 0 };

  for (const entry of KNOWLEDGE_BASE) {
    const score = scoreEntry(userTokens, entry);
    if (score > best.score) {
      best = { entry, score };
    }
  }

  return best;
}

/* ============================================================= */
/*  6. UI RENDERING                                             */
/* ============================================================= */

/**
 * Return a formatted HH:MM timestamp for the current time.
 * @returns {string}
 */
function getTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/**
 * Escape HTML to prevent the injection of markup from user text.
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Map a confidence score to a label + CSS modifier class.
 * @param {number} score
 * @returns {{label: string, cls: string}}
 */
function confidenceBadge(score) {
  if (score >= 0.5) return { label: "High match", cls: "confidence--high" };
  if (score >= 0.3) return { label: "Medium match", cls: "confidence--med" };
  return { label: "Low match", cls: "confidence--low" };
}

/**
 * Append a message bubble to the chat.
 * @param {string} text       message text
 * @param {"user"|"bot"} sender
 * @param {object} [options]  optional { score } for bot confidence badge
 */
function addMessage(text, sender, options = {}) {
  const row = document.createElement("div");
  row.className = `message message--${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "message__avatar";
  avatar.textContent = sender === "bot" ? "🤖" : "🧑";

  const content = document.createElement("div");
  content.className = "message__content";

  const bubble = document.createElement("div");
  bubble.className = "message__bubble";
  bubble.innerHTML = escapeHtml(text);

  const meta = document.createElement("div");
  meta.className = "message__meta";

  let metaHtml = `<span>${getTimestamp()}</span>`;
  if (sender === "bot" && typeof options.score === "number" && options.score > 0) {
    const badge = confidenceBadge(options.score);
    metaHtml += `<span class="confidence ${badge.cls}">${badge.label}</span>`;
  }
  meta.innerHTML = metaHtml;

  content.appendChild(bubble);
  content.appendChild(meta);
  row.appendChild(avatar);
  row.appendChild(content);

  dom.messages.appendChild(row);
  scrollToBottom();
}

/** Smoothly scroll the message list to the latest message. */
function scrollToBottom() {
  dom.messages.scrollTop = dom.messages.scrollHeight;
}

/** Show the animated typing indicator. */
function showTyping() {
  dom.typing.hidden = false;
  scrollToBottom();
}

/** Hide the typing indicator. */
function hideTyping() {
  dom.typing.hidden = true;
}

/* ============================================================= */
/*  7. CHAT FLOW                                                */
/* ============================================================= */

/**
 * Handle a user message: render it, run retrieval, reply.
 * @param {string} rawText
 */
function handleUserMessage(rawText) {
  const text = rawText.trim();
  if (!text) return;

  // Render the user's message immediately.
  addMessage(text, "user");
  stats.asked += 1;

  // Run retrieval BEFORE the delay so the answer is ready.
  const result = retrieveAnswer(text);

  // Simulate the bot "thinking" with a typing indicator.
  showTyping();
  const delay = randomBetween(CONFIG.typingDelayMin, CONFIG.typingDelayMax);

  setTimeout(() => {
    hideTyping();

    if (result.entry && result.score >= CONFIG.confidenceThreshold) {
      addMessage(result.entry.answer, "bot", { score: result.score });
      stats.matched += 1;
    } else {
      addMessage(CONFIG.fallbackMessage, "bot", { score: 0 });
    }

    updateStats();
  }, delay);
}

/** Return a random integer between min and max (inclusive). */
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ============================================================= */
/*  8. STATISTICS PANEL                                         */
/* ============================================================= */

/** Count the total unique keywords across the knowledge base. */
function countKeywords() {
  const all = new Set();
  KNOWLEDGE_BASE.forEach((entry) => {
    entry.keywords.forEach((k) => all.add(k.toLowerCase()));
  });
  return all.size;
}

/** Refresh the live numbers shown in the statistics panel. */
function updateStats() {
  dom.statEntries.textContent = KNOWLEDGE_BASE.length;
  dom.statKeywords.textContent = countKeywords();
  dom.statAsked.textContent = stats.asked;
  dom.statMatched.textContent = stats.matched;
}

/* ============================================================= */
/*  9. SUGGESTED QUESTIONS                                      */
/* ============================================================= */

/** Render a few random suggested-question chips in the sidebar. */
function renderSuggestions() {
  const sampleSize = 5;
  // Shuffle a copy of the knowledge base and take the first few.
  const shuffled = [...KNOWLEDGE_BASE].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, sampleSize);

  dom.suggestions.innerHTML = "";
  picks.forEach((entry) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "suggestion-chip";
    chip.textContent = entry.question;
    chip.addEventListener("click", () => {
      handleUserMessage(entry.question);
      closeSidebarOnMobile();
    });
    dom.suggestions.appendChild(chip);
  });
}

/* ============================================================= */
/*  10. CLEAR CHAT                                              */
/* ============================================================= */

/** Reset the chat back to the initial welcome state. */
function clearChat() {
  dom.messages.innerHTML = "";
  stats.asked = 0;
  stats.matched = 0;
  updateStats();
  renderSuggestions();
  showWelcome();
}

/** Display the first-load welcome message. */
function showWelcome() {
  addMessage(
    "👋 Hi! I'm KnowledgeBot. I can answer questions about AI concepts like RAG, LLMs, embeddings, neural networks, and more. Ask me anything or tap a suggested question!",
    "bot"
  );
}

/* ============================================================= */
/*  11. MOBILE SIDEBAR                                          */
/* ============================================================= */

/** Toggle the sidebar open/closed on small screens. */
function toggleSidebar() {
  dom.sidebar.classList.toggle("is-open");
  overlay.classList.toggle("is-visible");
}

/** Close the sidebar (used after picking a suggestion on mobile). */
function closeSidebarOnMobile() {
  dom.sidebar.classList.remove("is-open");
  overlay.classList.remove("is-visible");
}

// Create a dark overlay element used behind the mobile sidebar.
const overlay = document.createElement("div");
overlay.className = "overlay";
document.body.appendChild(overlay);
overlay.addEventListener("click", closeSidebarOnMobile);

/* ============================================================= */
/*  12. EVENT LISTENERS                                         */
/* ============================================================= */
dom.form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleUserMessage(dom.input.value);
  dom.input.value = "";
  dom.input.focus();
});

dom.clearBtn.addEventListener("click", clearChat);
dom.menuToggle.addEventListener("click", toggleSidebar);

/* ============================================================= */
/*  13. INITIALIZE APP                                          */
/* ============================================================= */
function init() {
  updateStats();
  renderSuggestions();
  showWelcome();
  dom.input.focus();
}

init();
