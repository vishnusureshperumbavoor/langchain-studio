# InsightEngine: Autonomous Research Orchestrator

InsightEngine is an open-source, multi-agent research agent designed to demonstrate the power of **LangGraph**, **LangChain**, and **LangSmith**. It autonomously plans, searches, and synthesizes complex topics into professional Markdown reports.

## 📺 Project Demo
[![InsightEngine Demo](https://img.youtube.com/vi/JhdqFnx4UMY/maxresdefault.jpg)](https://www.youtube.com/watch?v=JhdqFnx4UMY)


## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js & npm
- OpenAI API Key

### 1. Backend Setup
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Frontend Setup
```powershell
cd frontend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_key
LANGCHAIN_PROJECT=InsightEngine
```

### 4. Running the Project
**Start the Backend:**
```powershell
backend\.venv\Scripts\python -m backend.main
```

**Start the Frontend:**
```powershell
cd frontend
npm run dev
```

---

## 🧠 Technology Stack

### LangGraph (Orchestration)
We use **LangGraph** to manage the state and cyclic logic of the research process. Unlike a linear chain, LangGraph allows the agent to:
- **Plan**: Break a topic into sub-questions.
- **Loop**: Refine searches if initial results are insufficient.
- **State Management**: Persist findings across different specialized nodes.

### LangChain (Agentic Building Blocks)
**LangChain** provides the "muscles" for our agents:
- **Tools**: We use LangChain tools to interface with DuckDuckGo and ArXiv.
- **LLM Integration**: Seamless switching between GPT-4o-mini (for planning) and GPT-4o (for synthesis).
- **Output Parsing**: Ensuring the LLM returns structured data our graph can understand.

### LangSmith (Observability)
**LangSmith** is our "X-ray" for debugging. It is integrated natively to:
- **Trace**: View the step-by-step decision-making process of each agent.
- **Monitor**: Track token usage and latency for every research task.
- **Optimize**: Identify which nodes in the graph are failing or hallucinating.

---