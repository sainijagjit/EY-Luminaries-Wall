from fastapi import FastAPI

from app.api.v1.config import router as config_router


app = FastAPI()

app.include_router(config_router)