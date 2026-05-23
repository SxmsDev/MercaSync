import asyncio
import httpx
from playwright.async_api import async_playwright, TimeoutError
from core.producto import construir_producto

BASE_URL = "https://www.olimpica.com"
API_URL = "http://127.0.0.1:8000/precios"
CATEGORIA = "despensa"


async def enviar_producto(cliente: httpx.AsyncClient, datos: dict):
    try:
        response = await cliente.post(API_URL, json=datos)

        if response.status_code == 200:
            print(f"✅ Guardado: {datos['nombre_original']}")
        else:
            print(f"⚠️ Error API {response.status_code}: {datos['nombre_original']}")

    except Exception as e:
        print(f"❌ Error enviando producto: {e}")


async def cerrar_popup(page):
    try:
        popup = page.locator(".om-popup-close-x")

        if await popup.count() > 0:
            if await popup.first.is_visible():
                await popup.first.click(force=True)
                await page.wait_for_timeout(500)

    except:
        pass


async def esperar_nuevos_productos(page, cantidad_actual, timeout=15000):
    """
    Espera hasta que aparezcan nuevos productos
    """

    try:
        await page.wait_for_function(
            f"""
            () => document.querySelectorAll('[data-af-element="search-result"]').length > {cantidad_actual}
            """,
            timeout=timeout
        )

        return True

    except TimeoutError:
        return False


async def obtener_texto(producto, selectores):

    for selector in selectores:

        try:
            locator = producto.locator(selector).first

            if await locator.count() > 0:

                texto = await locator.inner_text()
                texto = texto.strip()

                if texto:
                    return texto

        except:
            pass

    return None


async def scrape():

    urls_vistas = set()

    async with async_playwright() as p:

        browser = await p.chromium.launch(
            headless=False,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--start-maximized"
            ]
        )

        context = await browser.new_context(
            viewport={"width": 1400, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )

        page = await context.new_page()

        # IMPORTANTE
        # Evita esperas de 30 segundos por locator
        page.set_default_timeout(5000)

        # Bloquear SOLO recursos innecesarios
        await page.route(
            "**/*",
            lambda route: (
                route.abort()
                if route.request.resource_type in ("font", "media")
                else route.continue_()
            )
        )

        print("🌐 Entrando a Olímpica...")

        await page.goto(
            f"{BASE_URL}/supermercado/{CATEGORIA}",
            wait_until="domcontentloaded",
            timeout=120000
        )

        # Esperar productos
        await page.wait_for_selector(
            '[data-af-element="search-result"]',
            timeout=30000
        )

        await cerrar_popup(page)

        async with httpx.AsyncClient(timeout=30) as cliente:

            ultimo_total = 0
            scrolls_sin_nuevos = 0

            while True:

                await cerrar_popup(page)

                productos_locator = page.locator(
                    '[data-af-element="search-result"]'
                )

                productos_actuales = await productos_locator.count()

                print(f"\n🛒 Productos detectados: {productos_actuales}")

                tareas = []

                # SOLO NUEVOS PRODUCTOS
                for i in range(ultimo_total, productos_actuales):

                    try:

                        # Re-obtener locator
                        producto = page.locator(
                            '[data-af-element="search-result"]'
                        ).nth(i)

                        # Evita errores con elementos reciclados
                        try:
                            await producto.wait_for(timeout=3000)
                        except:
                            continue

                        if not await producto.is_visible():
                            continue

                        # LINK
                        link = producto.locator("a").first

                        try:
                            href = await link.get_attribute(
                                "href",
                                timeout=3000
                            )
                        except:
                            continue

                        if not href or "/p" not in href:
                            continue

                        url = href if href.startswith("http") else BASE_URL + href

                        if url in urls_vistas:
                            continue

                        urls_vistas.add(url)

                        # NOMBRE
                        nombre = await obtener_texto(
                            producto,
                            [
                                ".vtex-product-summary-2-x-productBrand",
                                ".vtex-product-summary-2-x-productNameContainer",
                                ".vtex-product-summary-2-x-productBrandName",
                            ]
                        )

                        # PRECIO
                        precio = await obtener_texto(
                            producto,
                            [
                                ".olimpica-dinamic-flags-0-x-currencyContainer",
                                ".vtex-product-price-1-x-sellingPriceValue",
                                ".vtex-product-price-1-x-currencyContainer",
                            ]
                        )

                        # IMAGEN
                        imagen = None

                        try:

                            img = producto.locator("img").first

                            imagen = await img.get_attribute(
                                "src",
                                timeout=3000
                            )

                            if imagen and imagen.startswith("//"):
                                imagen = "https:" + imagen

                        except:
                            pass

                        if not nombre or not precio:
                            continue

                        datos = construir_producto(
                            nombre=nombre,
                            precio=precio,
                            url=url,
                            tienda="Olímpica",
                            categoria=CATEGORIA,
                        )

                        datos["url_base"] = BASE_URL

                        if imagen:
                            datos["imagen"] = imagen

                        tareas.append(
                            enviar_producto(cliente, datos)
                        )

                    except Exception as e:
                        print(f"❌ Error producto {i}: {e}")

                # ENVÍO PARALELO
                if tareas:
                    await asyncio.gather(*tareas)

                ultimo_total = productos_actuales

                print("\n⬇️ Haciendo scroll...")

                # Scroll real VTEX
                await page.evaluate(
                    "window.scrollBy(0, document.body.scrollHeight)"
                )

                # Esperar nuevos productos
                nuevos = await esperar_nuevos_productos(
                    page,
                    productos_actuales
                )

                if nuevos:
                    print("✅ Nuevos productos cargados")
                    scrolls_sin_nuevos = 0
                else:
                    print("⚠️ No cargaron más productos")
                    scrolls_sin_nuevos += 1

                # FIN
                if scrolls_sin_nuevos >= 3:
                    print("\n🏁 Fin del scraping")
                    break

        await browser.close()

    print("\n✅ Scraping de Olímpica finalizado")


asyncio.run(scrape())