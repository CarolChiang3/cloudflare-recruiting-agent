# Cloudflare AI Talent Rubric & Calibration Agent

An AI-powered recruitment assistant built on the **Cloudflare Agents SDK**, designed for Technical Talent Acquisition Business Partners. It helps calibrate candidate rubrics, analyze technical profiles against job specifications, and generate tailored outbound reachout messages.

## Features
- **LLM**: Powered by `@cf/meta/llama-3.3-70b-instruct` on **Cloudflare Workers AI**.
- **Agent Workflow & State**: Built using Cloudflare's stateful **Agent** framework (backed by Durable Objects / SQLite storage) to maintain conversation context and evaluation history.
- **Interactive UI**: Clean, responsive web interface served directly via Cloudflare Workers.
- **Talent Operations Focus**: Evaluates engineering depth (Distributed Systems, Cloudflare Tech Stack, Sourcing rubrics) and Drafts high-converting candidate outreach.

---

## Architecture Components

| Component | Cloudflare Feature | Implementation |
| :--- | :--- | :--- |
| **LLM Inference** | Workers AI | `env.AI.run('@cf/meta/llama-3.3-70b-instruct', ...)` |
| **Agent / Workflow** | Agents SDK / Durable Objects | Stateful Agent class extending `Agent` from `agents-sdk` |
| **Memory / State** | Agent Storage (SQL / KV State) | `this.setState()` to persist chat history and evaluation scores |
| **User Input & UI** | Cloudflare Worker Web Endpoint | Interactive Chat UI with quick prompts |

---

## Quickstart

### 1. Prerequisites
- Node.js (v18+)
- Cloudflare account with Workers AI enabled

### 2. Install Dependencies
```bash
npm install
```

### 3. Local Development
```bash
npm run dev
```

### 4. Deploy to Cloudflare
```bash
npx wrangler deploy
```

---

## AI Prompt History (Submission Requirement)
As required by the assignment guidelines, the complete AI generation and prompt engineering history used to architect and code this agent is documented in [`PROMPTS.md`](./PROMPTS.md).
