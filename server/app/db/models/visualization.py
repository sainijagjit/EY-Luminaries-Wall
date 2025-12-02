from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Visualization(Base):
    __tablename__ = "VISUALIZATION"

    id = Column(Integer, primary_key=True)
    title = Column(Text)
    screen_id = Column(Integer, ForeignKey("SCREEN.screen_id"))
    chart_type = Column(Text)

    screen = relationship("Screen", back_populates="visualizations")
    data_sets = relationship("DataSetMapping", back_populates="visualization")


