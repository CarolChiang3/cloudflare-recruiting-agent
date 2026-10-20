import { Agent, type AgentContext } from "agents-sdk";

export interface Env {
  AI: any;
  RecruitingAgent: DurableObjectNamespace;
}

interface ChatState {
  history: Array<{ role: "system" | "user" | "assistant"; content: string }>;
}

export class RecruitingAgent extends Agent<Env, ChatState> {
  initialState: ChatState = {
    history: [
      {
        role: "system",
        content: `You are the Cloudflare APAC Senior Talent Acquisition AI Partner.
Your goal is to assist technical recruiters and hiring managers in:
1. Calibrating competency rubrics for Cloudflare engineering & GTM roles (Workers, Rust, Go, Distributed Systems, Edge Networking).
2. Evaluating candidate background fit with 'skills-based' benchmarks.
3. Crafting personalized, peer-level outbound sourcing messages that avoid buzzwords and highlight Cloudflare's mission (Building a better Internet, Project Galileo, 1.1.1.1).
Tone: Concise, analytical, collaborative, and professional.`
      }
    ]
  };

  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      const { message } = await request.json() as { message: string };
      if (!message) {
        return new Response("Missing message", { status: 400 });
      }

      // Add user message to state history
      const state = this.state;
      state.history.push({ role: "user", content: message });

      // Run Workers AI with Llama 3.3
      const aiResponse = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct", {
        messages: state.history,
        max_tokens: 1024,
        temperature: 0.6
      });

      const assistantReply = aiResponse.response || "No response received.";
      state.history.push({ role: "assistant", content: assistantReply });

      // Save state in Durable Object
      this.setState(state);

      return Response.json({ reply: assistantReply, historyLength: state.history.length });
    }

    if (url.pathname === "/api/reset" && request.method === "POST") {
      this.setState(this.initialState);
      return Response.json({ status: "reset" });
    }

    return new Response("Not found", { status: 404 });
  }
}

// Serve UI & Route to Agent
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const id = env.RecruitingAgent.idFromName("default-agent");
      const agent = env.RecruitingAgent.get(id);
      return agent.fetch(request);
    }

    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cloudflare APAC Talent Acquisition AI Partner</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --cf-orange: #F38020;
      --cf-dark: #1E1E1E;
      --cf-gray: #F4F5F7;
      --text-main: #333333;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0; padding: 0; background: var(--cf-gray); color: var(--text-main);
      display: flex; flex-direction: column; height: 100vh;
    }
    header {
      background: white; border-bottom: 2px solid var(--cf-orange); padding: 16px 24px;
      display: flex; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    header h1 { margin: 0; font-size: 1.15rem; color: var(--cf-dark); }
    header span { font-size: 0.85rem; color: #666; background: #FFF4EC; border: 1px solid var(--cf-orange); padding: 4px 8px; border-radius: 4px; }
    #chat-container {
      flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; max-width: 800px; margin: 0 auto; width: 100%; box-sizing: border-box;
    }
    .msg { padding: 14px 18px; border-radius: 8px; line-height: 1.5; font-size: 0.95rem; max-width: 85%; white-space: pre-wrap; }
    .user { background: var(--cf-orange); color: white; align-self: flex-end; }
    .assistant { background: white; color: var(--text-main); align-self: flex-start; border: 1px solid #E1E4E8; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
    .quick-prompts { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; max-width: 800px; margin: 0 auto 8px auto; width: 100%; padding: 0 24px; box-sizing: border-box; }
    .chip { font-size: 0.8rem; background: white; border: 1px solid #D0D7DE; padding: 6px 12px; border-radius: 16px; cursor: pointer; transition: all 0.2s; }
    .chip:hover { border-color: var(--cf-orange); color: var(--cf-orange); }
    #input-bar { background: white; border-top: 1px solid #E1E4E8; padding: 16px 24px; }
    .input-wrap { max-width: 800px; margin: 0 auto; display: flex; gap: 10px; }
    input[type="text"] { flex: 1; padding: 12px 16px; border: 1px solid #D0D7DE; border-radius: 6px; font-size: 1rem; outline: none; }
    input[type="text"]:focus { border-color: var(--cf-orange); }
    button { background: var(--cf-orange); color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 0.95rem; font-weight: bold; cursor: pointer; }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <header>
    <h1>Cloudflare APAC Talent Acquisition AI Partner</h1>
    <span>Powered by Cloudflare Agents & Workers AI (Llama 3.3)</span>
  </header>
  <div id="chat-container">
    <div class="msg assistant">👋 Hello! I am your Cloudflare Talent Acquisition Agent. I help hiring managers and TA partners calibrate candidate rubrics, analyze technical profiles against Cloudflare's architecture, and draft personalized outbound sourcing messages. How can I assist your hiring pipeline today?</div>
  </div>
  <div class="quick-prompts">
    <div class="chip" onclick="sendQuick('Calibrate hiring rubric for a Senior Systems Engineer (Rust / Linux Edge)')">🎯 Calibrate Systems Engineer Rubric</div>
    <div class="chip" onclick="sendQuick('Draft a personalized outreach to a passive Senior Distributed Systems Engineer in Taiwan')">✉️ Draft Passive Outreach (Taiwan Tech)</div>
    <div class="chip" onclick="sendQuick('Analyze candidate with Go/Networking experience for Cloudflare Workers team')">🔍 Assess Candidate Fit</div>
  </div>
  <div id="input-bar">
    <div class="input-wrap">
      <input type="text" id="userInput" placeholder="Ask about rubrics, candidates, or sourcing messages..." onkeydown="if(event.key==='Enter') sendMsg()">
      <button onclick="sendMsg()">Send</button>
    </div>
  </div>
  <script>
    async function sendMsg() {
      const input = document.getElementById('userInput');
      const text = input.value.trim();
      if (!text) return;
      appendMsg('user', text);
      input.value = '';
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      appendMsg('assistant', data.reply);
    }
    function sendQuick(text) {
      document.getElementById('userInput').value = text;
      sendMsg();
    }
    function appendMsg(role, text) {
      const container = document.getElementById('chat-container');
      const div = document.createElement('div');
      div.className = 'msg ' + role;
      div.innerText = text;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }
  </script>
</body>
</html>`;
