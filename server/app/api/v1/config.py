from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models
from app.db.session import get_db

router = APIRouter()


@router.get("/config")
def get_config(db: Session = Depends(get_db)):
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
                "chart_typ": vis.chart_typ,
                "data_sets": [],
            }

            for ds in vis.data_sets:
                vis_data["data_sets"].append(
                    {
                        "data_set_id": ds.data_set_id,
                        "visualization_": ds.visualization_,
                        "data_set": ds.data_set,
                    }
                )

            screen_data["visualizations"].append(vis_data)

        result.append(screen_data)

    return {"screens": result}