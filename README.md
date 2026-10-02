# MAV-AI
# MAV — Customizable Industrial AI Assistant

<p align="center">

**An AI assistant designed for industrial environments, built around local AI, real-time web knowledge, voice interaction, and customizable workflows.**

<br>

<img src="<img width="2560" height="1392" alt="MAV AI UI - Google Chrome 01-10-2026 23_34_40" src="https://github.com/user-attachments/assets/fa6ad7d8-959d-4f10-b00d-248548b9149c" />


</p>

<p align="center">

[![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Ollama](https://img.shields.io/badge/AI-Ollama-black)](https://ollama.com/)
[![Qwen](https://img.shields.io/badge/LLM-Qwen-purple)](https://qwenlm.ai/)

</p>

---

## The Problem

Industrial environments generate enormous amounts of knowledge.

Machine manuals.
Standard operating procedures.
Maintenance reports.
Troubleshooting guides.
Historical conversations.
Employee experience.

But when a machine breaks down, the required information is often **not available at the moment it is needed**.

Workers may have to search through documents, contact experienced technicians, or rely on fragmented information before taking action.

### MAV is designed to change that.

**MAV — Machine/Manufacturing AI Virtual Assistant — provides a customizable AI interface for interacting with industrial knowledge and workflows.**

---

## What is MAV?

MAV is an **industrial AI assistant** that combines:

* 🤖 Local Qwen AI through Ollama
* 🌐 Web search through Tavily
* 🎙️ Voice input using the Web Speech API
* 💬 Conversational interaction
* 🧠 JSON-based conversation/memory storage
* ⚙️ Customizable industrial workflows
* 🚀 FastAPI backend
* 🖥️ Lightweight web interface

The goal is not simply to build another chatbot.

The goal is to create an AI layer that can be adapted to an organization's **existing infrastructure, data, and workflows**.

---

## Demo

### 🎥 Watch MAV in action

> Add your demo video here.

[![MAV Demo](assets/demo.gif)](assets/demo.mp4)

**Demo flow:**

```text
Industrial problem
       ↓
User asks MAV a question
       ↓
MAV understands the request
       ↓
Local Qwen model processes the query
       ↓
Tavily provides external/current information when required
       ↓
MAV returns an actionable response
       ↓
Conversation context is retained
```

---

## Screenshots

### MAV Dashboard

<img src="assets/dashboard.png" alt="MAV Dashboard" width="900">

### AI Conversation

<img src="assets/chat.png" alt="MAV AI Conversation" width="900">

### Voice Interaction

<img src="assets/voice-mode.png" alt="MAV Voice Interface" width="900">

---

# Architecture

<img src="assets/architecture.png" alt="MAV Architecture" width="1000">

```text
                    ┌─────────────────────────┐
                    │        MAV UI           │
                    │ HTML / JS / Tailwind    │
                    │       Lucide Icons      │
                    └────────────┬────────────┘
                                 │
                           REST / CORS
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      FastAPI Server     │
                    │    Python / Uvicorn     │
                    └────────────┬────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
       ┌────────────────┐ ┌───────────────┐ ┌──────────────┐
       │ Qwen via       │ │    Tavily     │ │ JSON Memory  │
       │ Ollama         │ │ Web Search    │ │ / History    │
       └────────────────┘ └───────────────┘ └──────────────┘
                │                │                │
                └────────────────┼────────────────┘
                                 ▼
                       Context-aware response
```

---

# Core Features

## 🤖 Local AI

MAV uses **Qwen locally through Ollama**.

This allows the core AI interaction to run on local infrastructure instead of requiring every conversation to be sent to a hosted LLM provider.

```text
MAV → FastAPI → Ollama → Qwen → Response
```

---

## 🌐 Web Intelligence

When information outside the local knowledge context is required, MAV can use **Tavily** for web search.

```text
User Question
      ↓
MAV
      ↓
Does external information help?
      ↓
   ┌──┴──┐
   │     │
  No    Yes
   │     │
Local   Tavily
 AI      ↓
   │   Search
   │     │
   └──┬──┘
      ↓
   Response
```

This creates a combination of **local AI + external information retrieval**.

---

## 🎙️ Voice Interaction

MAV uses the browser's **Web Speech API** to support voice-based interaction.

The user can speak naturally instead of relying entirely on keyboard input.

```text
Voice
  ↓
Web Speech API
  ↓
Text
  ↓
MAV
  ↓
AI Response
```

---

## 🧠 Conversation Memory

Conversation information is stored using a lightweight JSON-based system.

This provides a simple mechanism for maintaining conversational context without requiring a separate database for the prototype.

---

## 🎨 Customizable Interface

The frontend is built using:

* HTML
* CSS
* JavaScript
* Tailwind CSS
* Lucide icons

The interface is designed to be lightweight and adaptable to different industrial use cases.

---

# Technology Stack

| Layer         | Technology            |
| ------------- | --------------------- |
| Frontend      | HTML, CSS, JavaScript |
| UI            | Tailwind CSS          |
| Icons         | Lucide                |
| Voice         | Web Speech API        |
| Backend       | Python                |
| API           | FastAPI               |
| Server        | Uvicorn               |
| Communication | REST / CORS           |
| Local AI      | Qwen + Ollama         |
| Web Search    | Tavily                |
| Memory        | JSON                  |

---

# Why Local AI?

Industrial environments can have strict requirements around data, infrastructure, and connectivity.

MAV's use of a local Qwen model through Ollama provides a foundation for deployments where organizations may prefer to keep AI inference closer to their own infrastructure.

The prototype therefore explores an architecture where:

**AI assistance does not necessarily require sending every interaction to a remote model.**

---

# Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/MAV.git
cd MAV
```

## 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

## 3. Install Ollama

Install Ollama for your operating system and make sure it is running.

Then pull the Qwen model used by the project:

```bash
ollama pull qwen
```

> Replace `qwen` with the exact model tag used by your implementation.

## 4. Configure Tavily

Create a `.env` file based on `.env.example`.

```env
TAVILY_API_KEY=your_api_key_here
```

**Never commit your real API key to GitHub.**

## 5. Start the backend

```bash
uvicorn backend.main:app --reload
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

## 6. Start the frontend

Open the frontend through your preferred local development server.

For example:

```bash
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

---

# Example Use Cases

MAV can be adapted to scenarios such as:

### 🔧 Machine Troubleshooting

> "The conveyor motor is overheating. What should I check first?"

### 📋 SOP Assistance

> "Show me the procedure for safely restarting this machine."

### 🛠️ Maintenance Support

> "What are the common causes of abnormal vibration?"

### 🌐 External Research

> "Find the latest information about this component."

### 🎙️ Hands-Free Interaction

> "MAV, what should I check before restarting the system?"

These examples demonstrate the broader idea:

**MAV is intended to adapt to industrial workflows rather than remain a generic chatbot.**

---

# Demo Flow

Our recommended hackathon demonstration follows a simple story:

```text
01  INDUSTRIAL PROBLEM
        ↓
02  ASK MAV A REALISTIC QUESTION
        ↓
03  MAV UNDERSTANDS THE REQUEST
        ↓
04  LOCAL QWEN GENERATES THE RESPONSE
        ↓
05  TAVILY PROVIDES EXTERNAL INFORMATION WHEN NEEDED
        ↓
06  USER CONTINUES THE CONVERSATION
        ↓
07  SHOW MEMORY / CONTEXT
        ↓
08  SHOW VOICE INTERACTION
        ↓
09  EXPLAIN CUSTOMIZATION & SCALABILITY
```

---

# What Makes MAV Different?

MAV explores an architecture that combines several capabilities in one industrial assistant:

```text
                 MAV
                  │
      ┌───────────┼───────────┐
      │           │           │
   Local AI     Web        Voice
   Qwen       Search       Input
      │           │           │
      └───────────┼───────────┘
                  │
            Conversation
               Memory
                  │
                  ▼
        Industrial Assistant
```

Instead of treating AI as a standalone chatbot, MAV explores AI as an **interface layer between people, information, and industrial workflows**.

---

# Future Roadmap

Possible future directions include:

* [ ] Industrial document ingestion
* [ ] PDF/manual understanding
* [ ] RAG-based company knowledge
* [ ] Equipment-specific assistants
* [ ] Role-based access
* [ ] Persistent database storage
* [ ] Industrial IoT integration
* [ ] Sensor/telemetry integration
* [ ] Maintenance history integration
* [ ] Multilingual voice interaction
* [ ] Offline-first deployments
* [ ] Enterprise authentication
* [ ] Agent-based workflow automation

---

# Project Vision

MAV starts with a simple idea:

> **The information needed to solve an industrial problem should be easier to access when the problem occurs.**

The long-term vision is a customizable industrial AI layer that can connect existing organizational knowledge, tools, and workflows through a natural conversational interface.

---

# Hackathon

MAV was developed as an **industrial AI hackathon project**.

The prototype focuses on demonstrating how local AI, web intelligence, voice interaction, and customizable workflows can be combined into a practical industrial assistant.

---

## Team

**MAV Team**

Built for innovation in industrial AI.

---

## License

Add your preferred license here.

For example:

```text
MIT License
```

---

<p align="center">

### MAV — Making Industrial Knowledge Accessible

</p>
