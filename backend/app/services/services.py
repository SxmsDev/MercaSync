from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.models.models import Supermercado, Producto, Precio


def get_or_create_supermercado(db: Session, nombre: str, url_base: str) -> Supermercado:
    supermercado = db.query(Supermercado).filter(Supermercado.nombre == nombre).first()
    if not supermercado:
        supermercado = Supermercado(nombre=nombre, url_base=url_base)
        db.add(supermercado)
        db.commit()
        db.refresh(supermercado)
    return supermercado


def get_supermercados(db: Session):
    return db.query(Supermercado).all()


def get_or_create_producto(db: Session, datos: dict) -> Producto:
    producto = db.query(Producto).filter(
        Producto.nombre_normalizado == datos["nombre_normalizado"]
    ).first()
    if not producto:
        producto = Producto(
            nombre_normalizado=datos["nombre_normalizado"],
            nombre_original=datos["nombre_original"],
            marca=datos.get("marca", ""),
            categoria=datos.get("categoria", ""),
            cantidad=datos.get("cantidad"),
            unidad=datos.get("unidad"),
        )
        db.add(producto)
        db.commit()
        db.refresh(producto)
    return producto


def get_productos(db: Session, categoria: str = None, marca: str = None,
                  precio_min: int = None, precio_max: int = None,
                  orden: str = None):
    query = db.query(Producto).options(joinedload(Producto.precios).joinedload(Precio.supermercado))

    if categoria:
        query = query.filter(Producto.categoria == categoria)
    if marca:
        query = query.filter(func.lower(Producto.marca) == marca.lower())

    productos = query.all()

    # Serializar con precios y filtros de precio
    resultado = []
    for p in productos:
        precios = [
            {
                "supermercado": pr.supermercado.nombre,
                "precio": pr.precio,
                "precio_texto": pr.precio_texto,
                "url": pr.url,
                "imagen": pr.imagen,
                "disponible": pr.disponible,
            }
            for pr in p.precios if pr.disponible
        ]

        if not precios:
            continue

        precio_menor = min(pr["precio"] for pr in precios)

        if precio_min and precio_menor < precio_min:
            continue
        if precio_max and precio_menor > precio_max:
            continue

        resultado.append({
            "id": p.id,
            "nombre_original": p.nombre_original,
            "nombre_normalizado": p.nombre_normalizado,
            "marca": p.marca,
            "categoria": p.categoria,
            "cantidad": p.cantidad,
            "unidad": p.unidad,
            "precio_menor": precio_menor,
            "precios": precios,
        })

    # Ordenar
    if orden == "precio_asc":
        resultado.sort(key=lambda x: x["precio_menor"])
    elif orden == "precio_desc":
        resultado.sort(key=lambda x: x["precio_menor"], reverse=True)
    elif orden == "nombre":
        resultado.sort(key=lambda x: x["nombre_original"].lower())

    return resultado


def get_marcas(db: Session):
    marcas = db.query(Producto.marca).filter(Producto.marca != "").distinct().all()
    return sorted([m[0] for m in marcas if m[0]])


def buscar_productos(db: Session, termino: str):
    productos = db.query(Producto).options(
        joinedload(Producto.precios).joinedload(Precio.supermercado)
    ).filter(
        Producto.nombre_normalizado.ilike(f"%{termino}%")
    ).all()

    resultado = []
    for p in productos:
        precios = [
            {
                "supermercado": pr.supermercado.nombre,
                "precio": pr.precio,
                "precio_texto": pr.precio_texto,
                "url": pr.url,
                "imagen": pr.imagen,
                "disponible": pr.disponible,
            }
            for pr in p.precios if pr.disponible
        ]
        if precios:
            resultado.append({
                "id": p.id,
                "nombre_original": p.nombre_original,
                "marca": p.marca,
                "categoria": p.categoria,
                "cantidad": p.cantidad,
                "unidad": p.unidad,
                "precio_menor": min(pr["precio"] for pr in precios),
                "precios": precios,
            })

    return resultado


def guardar_precio(db: Session, datos: dict) -> Precio:
    supermercado = get_or_create_supermercado(db, datos["tienda"], datos.get("url_base", ""))
    producto = get_or_create_producto(db, datos)

    precio = db.query(Precio).filter(
        Precio.producto_id == producto.id,
        Precio.supermercado_id == supermercado.id,
    ).first()

    if precio:
        precio.precio = datos["precio"]
        precio.precio_texto = datos.get("precio_texto", "")
        precio.url = datos["url"]
        precio.imagen = datos.get("imagen", "")
        precio.disponible = datos.get("disponible", True)
    else:
        precio = Precio(
            producto_id=producto.id,
            supermercado_id=supermercado.id,
            precio=datos["precio"],
            precio_texto=datos.get("precio_texto", ""),
            url=datos["url"],
            imagen=datos.get("imagen", ""),
            disponible=datos.get("disponible", True),
        )
        db.add(precio)

    db.commit()
    db.refresh(precio)
    return precio


def comparar_precios(db: Session, nombre: str):
    productos = buscar_productos(db, nombre)
    resultados = []

    for producto in productos:
        for precio in sorted(producto["precios"], key=lambda x: x["precio"]):
            resultados.append({
                "producto": producto["nombre_original"],
                "marca": producto["marca"],
                "cantidad": producto["cantidad"],
                "unidad": producto["unidad"],
                "supermercado": precio["supermercado"],
                "precio": precio["precio"],
                "precio_texto": precio["precio_texto"],
                "url": precio["url"],
                "imagen": precio["imagen"],
                "disponible": precio["disponible"],
            })

    resultados.sort(key=lambda x: x["precio"])
    return resultados