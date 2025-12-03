from sqlalchemy import Column, Integer, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Screen(Base):
    __tablename__ = "SCREEN"

    screen_id = Column(Integer, primary_key=True)
    screen_name = Column(Text)
    persona_id = Column(Integer)

    visualizations = relationship("Visualization", back_populates="screen")


