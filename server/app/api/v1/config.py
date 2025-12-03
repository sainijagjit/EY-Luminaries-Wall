import json
import os
from pathlib import Path

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models
from app.db.session import get_db

router = APIRouter()


def _load_config_from_db(db: Session):
    screens = db.query(models.Screen).all()

    result = []
    for screen in screens:
        screen_data = {
            "screen_id": screen.screen_id,
            "screen_name": screen.screen_name,
            "persona_id": screen.persona_id,
            "visualizations": [],
        }

        for vis in screen.visualizations:
            vis_data = {
                "id": vis.id,
                "title": vis.title,
                "screen_id": vis.screen_id,
                "chart_type": vis.chart_type,
                "data_sets": [],
            }

            for ds in vis.data_sets:
                vis_data["data_sets"].append(
                    {
                        "data_set_id": ds.data_set_id,
                        "visualization_id": ds.visualization_id,
                        "data_set": ds.data_set,
                    }
                )

            screen_data["visualizations"].append(vis_data)

        result.append(screen_data)

    return {"screens": result}


def _load_config_from_file():
    config_path = Path(__file__).resolve().parents[2] / "config.json"
    with config_path.open() as f:
        data = json.load(f)
    return data


@router.get("/config")
def get_config(db: Session = Depends(get_db)):
    return _load_config_from_file()
    # return _load_config_from_db(db)