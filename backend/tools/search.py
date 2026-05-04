from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.utilities import ArxivAPIWrapper
from langchain_core.tools import tool

@tool
def web_search(query: str):
    """Search the web for general information, news, and current events."""
    search = DuckDuckGoSearchRun()
    return search.run(query)

@tool
def arxiv_search(query: str):
    """Search ArXiv for academic papers and technical research. 
    Use this for deep technical details or scientific information.
    """
    arxiv = ArxivAPIWrapper()
    return arxiv.run(query)
