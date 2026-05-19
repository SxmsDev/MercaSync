import re
import unicodedata


def limpiar_texto(texto):
    """
    Limpia y normaliza texto de productos
    """

    if not texto:
        return ""

    texto = texto.lower()

    # Eliminar tildes
    texto = unicodedata.normalize("NFD", texto)
    texto = texto.encode("ascii", "ignore").decode("utf-8")

    # Normalizar unidades
    reemplazos = {
        "cm3": "ml",
        "cc": "ml",
        "litros": "l",
        "litro": "l",
        "gramos": "g",
        "gramo": "g",
        "kilogramos": "kg",
        "kilogramo": "kg",
        "mililitros": "ml",
        "mililitro": "ml",
        "unidad": "und",
        "unidades": "unds"
    }

    for viejo, nuevo in reemplazos.items():
        texto = texto.replace(viejo, nuevo)

    # Eliminar caracteres especiales
    texto = re.sub(r"[^\w\s]", " ", texto)

    # Eliminar espacios dobles
    texto = re.sub(r"\s+", " ", texto)

    return texto.strip()


def extraer_presentacion(nombre):
    """
    Extrae cantidad y unidad del producto
    Ejemplo:
    'aceite x 900 ml'
    -> (900, 'ml')
    """

    if not nombre:
        return None, None

    patron = r'(\d+(?:[\.,]\d+)?)\s?(ml|l|g|kg|unds|und)'

    match = re.search(patron, nombre.lower())

    if not match:
        return None, None

    cantidad = match.group(1)
    unidad = match.group(2)

    # Reemplazar coma decimal
    cantidad = cantidad.replace(",", ".")

    try:
        cantidad = float(cantidad)
    except:
        cantidad = None

    return cantidad, unidad


def extraer_marca(nombre, marcas=[]):
    """
    Detecta marca dentro del nombre
    """

    nombre = limpiar_texto(nombre)

    for marca in marcas:
        marca_limpia = limpiar_texto(marca)

        if marca_limpia in nombre:
            return marca

    return ""


def normalizar_nombre(nombre):
    """
    Devuelve nombre limpio y consistente
    """

    nombre = limpiar_texto(nombre)

    # Eliminar palabras innecesarias
    basura = [
        "x",
        "de",
        "con",
        "para",
        "el",
        "la",
        "los",
        "las"
    ]

    palabras = nombre.split()

    palabras_filtradas = [
        palabra
        for palabra in palabras
        if palabra not in basura
    ]

    nombre = " ".join(palabras_filtradas)

    return nombre.strip()