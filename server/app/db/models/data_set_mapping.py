from sqlalchemy import Column, ForeignKey, Integer, JSON
from sqlalchemy.orm import relationship

from app.db.session import Base


class DataSetMapping(Base):
    __tablename__ = "DATA_SET_MAPPING"

    data_set_id = Column(Integer, primary_key=True)
    visualization_id = Column(Integer, ForeignKey("VISUALIZATION.id"))
    data_set = Column(JSON)

    visualization = relationship("Visualization", back_populates="data_sets")


