from fastapi import FastAPI

app = FastAPI(
    title="Agentic AI Voice Bot",
    description="An Agentic AI based Voice bot assistant for ProposifyAI",
    version="0.1.0"
)

@app.get('/')
def home():
    return {"message": "Hello World !!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}