from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.connection import Base


class Supermercado(Base):
    __tablename__ = "supermercados"

    id         = Column(Integer, primary_key=True, index=True)
    nombre     = Column(String, unique=True, nullable=False)
    url_base   = Column(String, nullable=False)
    creado_en  = Column(DateTime(timezone=True), server_default=func.now())

    precios    = relationship("Precio", back_populates="supermercado")


class Producto(Base):
    __tablename__ = "productos"

    id                  = Column(Integer, primary_key=True, index=True)
    nombre_normalizado  = Column(String, nullable=False)
    nombre_original     = Column(String, nullable=False)
    marca               = Column(String, default="")
    categoria           = Column(String, nullable=False)
    cantidad            = Column(Float, nullable=True)
    unidad              = Column(String, nullable=True)
    creado_en           = Column(DateTime(timezone=True), server_default=func.now())

    precios             = relationship("Precio", back_populates="producto")


class Precio(Base):
    __tablename__ = "precios"

    id                = Column(Integer, primary_key=True, index=True)
    producto_id       = Column(Integer, ForeignKey("productos.id"), nullable=False)
    supermercado_id   = Column(Integer, ForeignKey("supermercados.id"), nullable=False)
    precio            = Column(Integer, nullable=False)
    precio_texto      = Column(String, default="")
    url               = Column(String, nullable=False)
    imagen            = Column(String, default="")
    disponible        = Column(Boolean, default=True)
    actualizado_en    = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    producto          = relationship("Producto", back_populates="precios")
    supermercado      = relationship("Supermercado", back_populates="precios")