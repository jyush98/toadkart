from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Add this block
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3004"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "ToadKart backend live!"}
