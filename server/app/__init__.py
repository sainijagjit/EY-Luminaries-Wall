from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.config import router as config_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1212"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(config_router)