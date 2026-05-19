from playwright.async_api import async_playwright
import asyncio

URL = "https://www.megatiendas.co/despensa"

# ==========================================
# CONFIGURAR UBICACIÓN
# ==========================================
async def configurar_ubicacion(page):

    try:

        print("Verificando modal de ubicación...")

        await page.wait_for_timeout(4000)

        modal = page.locator(
            '.megatiendas-delivery-modal-1-x-ModalFormAddress__card_content'
        )

        if await modal.count() == 0:

            print("No apareció modal")
            return

        print("Modal detectado")

        # ==========================================
        # DEPARTAMENTO
        # ==========================================
        print("Seleccionando departamento...")

        departamento_input = page.locator(
            '#react-select-2-input'
        )

        await departamento_input.click()
        await departamento_input.fill("Bolívar")

        await page.wait_for_timeout(2000)

        await page.keyboard.press("ArrowDown")
        await page.keyboard.press("Enter")

        # ==========================================
        # MUNICIPIO
        # ==========================================
        print("Seleccionando municipio...")

        await page.wait_for_timeout(3000)

        municipio_input = page.locator(
            '#react-select-3-input'
        )

        await municipio_input.click()
        await municipio_input.fill("Cartagena")

        await page.wait_for_timeout(2000)

        await page.keyboard.press("ArrowDown")
        await page.keyboard.press("Enter")

        # ==========================================
        # BARRIO
        # ==========================================
        print("Seleccionando barrio...")

        await page.wait_for_timeout(3000)

        barrio_input = page.locator(
            '#react-select-4-input'
        )

        await barrio_input.click()
        await barrio_input.fill("Centro")

        await page.wait_for_timeout(2000)

        await page.keyboard.press("ArrowDown")
        await page.keyboard.press("Enter")

        # ==========================================
        # GUARDAR
        # ==========================================
        print("Guardando ubicación...")

        await page.wait_for_timeout(3000)

        boton_guardar = page.locator(
            '.megatiendas-delivery-modal-1-x-ModalFormAddress__card_btn'
        ).first

        await boton_guardar.click()

        await page.wait_for_timeout(5000)

        print("Ubicación configurada")

    except Exception as e:

        print(f"Error configurando ubicación: {e}")


# ==========================================
# SCROLL PROFUNDO
# ==========================================
async def hacer_scroll(page):

    ultimo_total = 0
    intentos_iguales = 0

    while True:

        # scroll fuerte
        await page.mouse.wheel(0, 15000)

        await asyncio.sleep(3)

        total_actual = await page.locator(
            '[data-af-element="search-result"]'
        ).count()

        print(f"Productos cargados: {total_actual}")

        if total_actual == ultimo_total:

            intentos_iguales += 1

        else:

            intentos_iguales = 0
            ultimo_total = total_actual

        # esperar varios ciclos iguales
        if intentos_iguales >= 6:
            break


# ==========================================
# MOSTRAR MÁS HASTA EL FINAL
# ==========================================
async def presionar_mostrar_mas(page):

    while True:

        try:

            # bajar completamente
            await page.evaluate(
                "window.scrollTo(0, document.body.scrollHeight)"
            )

            await asyncio.sleep(3)

            boton = page.locator(
                '.vtex-search-result-3-x-buttonShowMore a'
            )

            # si no existe
            if await boton.count() == 0:

                print("\nNo existe más botón Mostrar más")
                break

            # si no es visible
            if not await boton.is_visible():

                print("\nBotón Mostrar más no visible")
                break

            productos_antes = await page.locator(
                '[data-af-element="search-result"]'
            ).count()

            print(
                f"\nProductos antes del click: "
                f"{productos_antes}"
            )

            await boton.scroll_into_view_if_needed()

            await asyncio.sleep(2)

            print("Presionando Mostrar más...")

            await boton.click(force=True)

            cargaron = False

            for _ in range(40):

                await asyncio.sleep(1)

                productos_despues = await page.locator(
                    '[data-af-element="search-result"]'
                ).count()

                print(
                    f"Antes: {productos_antes} | "
                    f"Ahora: {productos_despues}"
                )

                if productos_despues > productos_antes:

                    cargaron = True
                    break

            if not cargaron:

                print("\nNo cargaron más productos")
                break

            # scroll después de cargar
            await hacer_scroll(page)

        except Exception as e:

            print(f"\nError Mostrar más: {e}")
            break


# ==========================================
# EXTRAER PRODUCTOS
# ==========================================
async def extraer_productos(page):

    productos = page.locator(
        '[data-af-element="search-result"]'
    )

    total = await productos.count()

    print(f"\nTOTAL ELEMENTOS EN DOM: {total}")

    productos_extraidos = []
    urls_vistas = set()

    for i in range(total):

        try:

            producto = productos.nth(i)

            # ==========================================
            # NOMBRE
            # ==========================================
            nombre = await producto.locator(
                '.vtex-product-summary-2-x-productBrand'
            ).first.inner_text()

            nombre = nombre.strip()

            # ==========================================
            # PRECIO
            # ==========================================
            precio = await producto.locator(
                '.vtex-product-price-1-x-currencyContainer'
            ).first.inner_text()

            precio = precio.strip()

            # ==========================================
            # URL
            # ==========================================
            link = await producto.locator(
                'a'
            ).first.get_attribute("href")

            # evitar links inválidos
            if not link:
                continue

            if link == "/":
                continue

            if not link.startswith("/"):
                continue

            url_producto = f"https://www.megatiendas.co{link}"

            # evitar duplicados
            if url_producto in urls_vistas:
                continue

            urls_vistas.add(url_producto)

            # ==========================================
            # GUARDAR
            # ==========================================
            data = {
                "nombre": nombre,
                "precio": precio,
                "url": url_producto,
                "supermercado": "Megatiendas"
            }

            productos_extraidos.append(data)

            # ==========================================
            # MOSTRAR
            # ==========================================
            print("\n===================================")
            print(f"Nombre: {nombre}")
            print(f"Precio: {precio}")
            print(f"URL: {url_producto}")

        except Exception as e:

            print(f"Error producto {i}: {e}")

    print("\n===================================")
    print(f"TOTAL PRODUCTOS ÚNICOS: {len(productos_extraidos)}")

    return productos_extraidos


# ==========================================
# MAIN
# ==========================================
async def main():

    async with async_playwright() as p:

        browser = await p.chromium.launch(
            headless=False
        )

        page = await browser.new_page()

        print("Entrando a la página...\n")

        await page.goto(
            URL,
            wait_until="domcontentloaded"
        )

        # ==========================================
        # UBICACIÓN
        # ==========================================
        await configurar_ubicacion(page)

        # ==========================================
        # SCROLL INICIAL
        # ==========================================
        print("\nHaciendo scroll inicial...")

        await hacer_scroll(page)

        # ==========================================
        # MOSTRAR MÁS
        # ==========================================
        await presionar_mostrar_mas(page)

        # ==========================================
        # SCROLL FINAL
        # ==========================================
        print("\nScroll final...")

        await hacer_scroll(page)

        # ==========================================
        # EXTRAER PRODUCTOS
        # ==========================================
        await extraer_productos(page)

        print("\nScraping finalizado")

        await asyncio.sleep(10)

        await browser.close()


# ==========================================
# EJECUTAR
# ==========================================
asyncio.run(main())