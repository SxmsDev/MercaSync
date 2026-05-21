import asyncio
import httpx
from playwright.async_api import async_playwright
from core.producto import construir_producto

BASE_URL = "https://www.olimpica.com"
API_URL = "http://127.0.0.1:8000/precios"
CATEGORIA = "despensa"


async def enviar_producto(cliente: httpx.AsyncClient, datos: dict):
    try:
        response = await cliente.post(API_URL, json=datos)
        if response.status_code == 200:
            print(f"  ✅ Guardado: {datos['nombre_original']}")
        else:
            print(f"  ⚠️  Error API {response.status_code}: {datos['nombre_original']}")
    except Exception as e:
        print(f"  ❌ Error enviando: {e}")


async def cerrar_popup(page):
    try:
        popup = page.locator(".om-popup-close-x")
        if await popup.count() > 0 and await popup.first.is_visible():
            await popup.first.click(force=True)
            await page.wait_for_timeout(1000)
    except:
        pass


async def scrape():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page(viewport={"width": 1400, "height": 900})

        await page.route("**/*", lambda route: (
            route.abort() if route.request.resource_type in ("image", "font", "media")
            else route.continue_()
        ))

        print("Cargando página...")
        await page.goto(f"{BASE_URL}/supermercado/despensa", wait_until="domcontentloaded", timeout=120000)
        await page.wait_for_timeout(4000)
        await cerrar_popup(page)

        print("Haciendo scroll...")
        for i in range(10):
            await cerrar_popup(page)
            await page.mouse.wheel(0, 7000)
            await page.wait_for_timeout(2000)
            print(f"  Scroll #{i + 1}")

        await page.wait_for_timeout(4000)

        productos_locator = page.locator('[data-af-element="search-result"]')
        total = await productos_locator.count()
        print(f"\n{total} productos encontrados\n")

        urls_vistas = set()

        async with httpx.AsyncClient() as cliente:
            for i in range(total):
                try:
                    producto = productos_locator.nth(i)

                    href = await producto.locator("a").first.get_attribute("href")
                    if not href or "/p" not in href:
                        continue
                    url = href if href.startswith("http") else BASE_URL + href
                    if url in urls_vistas:
                        continue
                    urls_vistas.add(url)

                    nombre = "Sin nombre"
                    for selector in [
                        ".vtex-product-summary-2-x-productBrand",
                        ".vtex-product-summary-2-x-productNameContainer",
                    ]:
                        try:
                            texto = (await producto.locator(selector).first.inner_text()).strip()
                            if len(texto) > 2:
                                nombre = texto
                                break
                        except:
                            pass

                    precio = "Sin precio"
                    for selector in [
                        ".olimpica-dinamic-flags-0-x-currencyContainer",
                        ".vtex-product-price-1-x-sellingPriceValue",
                    ]:
                        try:
                            texto = (await producto.locator(selector).first.inner_text()).strip()
                            if texto:
                                precio = texto
                                break
                        except:
                            pass

                    if nombre == "Sin nombre" or precio == "Sin precio":
                        continue

                    datos = construir_producto(
                        nombre=nombre,
                        precio=precio,
                        url=url,
                        tienda="Olímpica",
                        categoria=CATEGORIA,
                    )
                    datos["url_base"] = BASE_URL
                    await enviar_producto(cliente, datos)

                except Exception as e:
                    print(f"Error producto {i}: {e}")

        await browser.close()
    print("\n✅ Scraping de Olímpica finalizado")


asyncio.run(scrape())