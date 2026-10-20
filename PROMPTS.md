# AI-Assisted Development & Prompt History

In compliance with Cloudflare's candidate assignment guideline (*"AI-assisted coding is encouraged, but you have to submit prompt history"*), this document records the prompts and reasoning chain used to build this AI-powered Talent Acquisition Agent.

---

### Prompt 1: System Concept & Requirements Alignment
> **User Prompt:**  
> "I am applying for the Senior Talent Acquisition Business Partner role at Cloudflare. I need to complete the optional assignment to build an AI-powered application on Cloudflare using Workers AI (Llama 3.3), Agents SDK / Durable Objects for state, and an interactive UI. The agent should be tailored to recruitment operations: calibrating technical rubrics, vetting candidate architectures against Cloudflare's stack, and generating high-converting reachouts."

### Prompt 2: Agent Architecture & Memory State
> **User Prompt:**  
> "Write a Cloudflare Worker using the new `@cloudflare/agents` SDK. Implement an Agent class that:  
> 1. Maintains chat history in state.  
> 2. Uses `@cf/meta/llama-3.3-70b-instruct` via Workers AI binding.  
> 3. Implements system instructions for an APAC Talent Acquisition Business Partner.  
> 4. Serves a clean HTML/CSS/JS chat interface directly so it requires zero external hosting."

### Prompt 3: Refining UI and System Prompt
> **User Prompt:**  
> "Ensure the chat UI includes quick suggestion buttons:  
> - 'Calibrate Senior Cloudflare Systems Engineer Rubric'  
> - 'Analyze Technical Profile vs. Distributed Edge Stack'  
> - 'Draft Outbound Message for Senior SRE in APAC'  
> Make sure the wrangler.jsonc or wrangler.toml is fully configured for Workers AI and Durable Objects."
