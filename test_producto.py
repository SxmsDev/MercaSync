from core.producto import construir_producto


producto = construir_producto(
    nombre="Aceite de Oliva La Constancia Extra Virgen x 250 cm3",
    precio="$ 26.490",
    url="https://www.megatiendas.co/producto",
    tienda="megatiendas",
    categoria="aceites"
)

print(producto)