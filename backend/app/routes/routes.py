from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.services import services

router = APIRouter()


@router.get("/supermercados")
def listar_supermercados(db: Session = Depends(get_db)):
    return services.get_supermercados(db)


@router.get("/marcas")
def listar_marcas(db: Session = Depends(get_db)):
    return services.get_marcas(db)


@router.get("/productos")
def listar_productos(
    categoria: str = None,
    marca: str = None,
    precio_min: int = None,
    precio_max: int = None,
    orden: str = None,
    db: Session = Depends(get_db)
):
    return services.get_productos(db, categoria, marca, precio_min, precio_max, orden)


@router.get("/productos/buscar")
def buscar_productos(q: str, db: Session = Depends(get_db)):
    if not q:
        raise HTTPException(status_code=400, detail="El parámetro q es requerido")
    return services.buscar_productos(db, q)


@router.post("/precios")
def guardar_precio(datos: dict, db: Session = Depends(get_db)):
    campos = ["nombre_original", "nombre_normalizado", "precio", "url", "tienda", "categoria"]
    for campo in campos:
        if campo not in datos:
            raise HTTPException(status_code=400, detail=f"Falta el campo: {campo}")
    return services.guardar_precio(db, datos)


@router.get("/comparar")
def comparar_precios(nombre: str, db: Session = Depends(get_db)):
    if not nombre:
        raise HTTPException(status_code=400, detail="El parámetro nombre es requerido")
    resultados = services.comparar_precios(db, nombre)
    if not resultados:
        raise HTTPException(status_code=404, detail="No se encontraron productos")
    return resultados