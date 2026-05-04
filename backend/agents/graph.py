from typing import Annotated, List, TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage
import operator

# Define the state of the research graph
class ResearchState(TypedDict):
    topic: str
    plan: List[str]
    results: List[str]
    report: str
    logs: Annotated[List[str], operator.add]

# Nodes
def planner(state: ResearchState):
    llm = ChatOpenAI(model="gpt-4o-mini")
    prompt = f"You are a Research Planner. Topic: {state['topic']}. Break this into 3 specific sub-questions to research."
    response = llm.invoke([HumanMessage(content=prompt)])
    # In a real app, we'd parse this into a list. For now, let's simulate a list.
    questions = response.content.split("\n")
    return {
        "plan": questions,
        "logs": [f"Created research plan with {len(questions)} steps."]
    }

from backend.tools.search import web_search, arxiv_search

def researcher(state: ResearchState):
    results = []
    for query in state["plan"]:
        # Use web search for everything for now, can be optimized later
        res = web_search.invoke(query)
        results.append(f"Source: Web\nQuery: {query}\nResult: {res}")
    
    return {
        "results": results,
        "logs": [f"Completed research for {len(state['plan'])} sub-topics."]
    }

def synthesizer(state: ResearchState):
    llm = ChatOpenAI(model="gpt-4o")
    prompt = f"Synthesize these findings into a report about {state['topic']}. Findings: {state['results']}"
    response = llm.invoke([HumanMessage(content=prompt)])
    return {
        "report": response.content,
        "logs": ["Synthesized final report."]
    }

# Build the graph
builder = StateGraph(ResearchState)
builder.add_node("planner", planner)
builder.add_node("researcher", researcher)
builder.add_node("synthesizer", synthesizer)

builder.set_entry_point("planner")
builder.add_edge("planner", "researcher")
builder.add_edge("researcher", "synthesizer")
builder.add_edge("synthesizer", END)

research_graph = builder.compile()
