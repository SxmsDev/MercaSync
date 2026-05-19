from core.normalizador import (
    normalizar_nombre,
    extraer_presentacion,
    extraer_marca
)


MARCAS_CONOCIDAS = [
    "ricaceite",
    "olivetto",
    "diana",
    "premier",
    "la constancia",
    "vitaplus",
    "gourmet",
    "johnsons",
    "glade",
    "zenu",
    "van camps",
    "alamar",
    "familia"
]


def limpiar_precio(precio):
    """
    Convierte:
    '$ 26.490'
    -> 26490
    """

    if precio is None:
        return 0

    precio = str(precio)

    precio = precio.replace("$", "")
    precio = precio.replace(".", "")
    precio = precio.replace(",", "")
    precio = precio.strip()

    try:
        return int(precio)
    except:
        return 0


def construir_producto(
    nombre,
    precio,
    url,
    tienda,
    categoria,
    imagen="",
    disponible=True
):
    """
    Construye un producto con estructura estándar
    """

    nombre_normalizado = normalizar_nombre(nombre)

    cantidad, unidad = extraer_presentacion(nombre_normalizado)

    marca = extraer_marca(
        nombre_normalizado,
        MARCAS_CONOCIDAS
    )

    precio_numerico = limpiar_precio(precio)

    producto = {
        "nombre_original": nombre,
        "nombre_normalizado": nombre_normalizado,
        "marca": marca,
        "precio": precio_numerico,
        "precio_texto": str(precio),
        "cantidad": cantidad,
        "unidad": unidad,
        "categoria": categoria,
        "url": url,
        "imagen": imagen,
        "tienda": tienda,
        "disponible": disponible
    }

    return producto