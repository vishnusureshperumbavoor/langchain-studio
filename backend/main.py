from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.agents.graph import research_graph
import json
import asyncio
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/research")
async def run_research(request: Request):
    data = await request.json()
    topic = data.get("topic")
    
    async def event_generator():
        initial_state = {
            "topic": topic,
            "plan": [],
            "results": [],
            "report": "",
            "logs": [f"Starting research on: {topic}"]
        }
        
        async for event in research_graph.astream(initial_state):
            # event is a dict like {'planner': {...}} or {'researcher': {...}}
            node_name = list(event.keys())[0]
            node_data = event[node_name]
            
            if "logs" in node_data:
                for log in node_data["logs"]:
                    yield f"data: {json.dumps({'type': 'log', 'content': log})}\n\n"
            
            if "report" in node_data:
                yield f"data: {json.dumps({'type': 'report', 'content': node_data['report']})}\n\n"
                
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
