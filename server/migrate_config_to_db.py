import json
from pathlib import Path

from app.db import models
from app.db.session import SessionLocal, engine
from app.db.session import Base


def migrate_config_to_db():
    config_path = Path(__file__).parent / "app" / "config.json"
    
    with config_path.open() as f:
        config_data = json.load(f)
    
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning: Could not create tables (they may already exist): {e}")
    
    db = SessionLocal()
    
    try:
        db.query(models.DataSetMapping).delete(synchronize_session=False)
        db.query(models.Visualization).delete(synchronize_session=False)
        db.query(models.Screen).delete(synchronize_session=False)
        db.flush()
        
        for screen_data in config_data["screens"]:
            screen = models.Screen(
                screen_id=screen_data["screen_id"],
                screen_name=screen_data["screen_name"],
                persona_id=screen_data.get("persona_id"),
            )
            db.add(screen)
            db.flush()
            
            for vis_data in screen_data.get("visualizations", []):
                visualization = models.Visualization(
                    id=vis_data["id"],
                    title=vis_data["title"],
                    screen_id=screen.screen_id,
                    chart_type=vis_data["chart_type"],
                )
                db.add(visualization)
                db.flush()
                
                for ds_data in vis_data.get("data_sets", []):
                    data_set = models.DataSetMapping(
                        data_set_id=ds_data["data_set_id"],
                        visualization_id=visualization.id,
                        data_set=ds_data["data_set"],
                    )
                    db.add(data_set)
        
        db.commit()
        print("Successfully migrated config.json to database!")
        print(f"Migrated {len(config_data['screens'])} screens")
        
        total_visualizations = sum(len(s.get("visualizations", [])) for s in config_data["screens"])
        print(f"Migrated {total_visualizations} visualizations")
        
        total_data_sets = sum(
            len(vis.get("data_sets", []))
            for screen in config_data["screens"]
            for vis in screen.get("visualizations", [])
        )
        print(f"Migrated {total_data_sets} data sets")
        
    except Exception as e:
        db.rollback()
        print(f"\nError during migration: {e}")
        print("\nPossible issues:")
        print("1. Database server is not accessible")
        print("2. Database URL is incorrect")
        print("3. Network connectivity issues")
        print("4. Database credentials are invalid")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    migrate_config_to_db()

