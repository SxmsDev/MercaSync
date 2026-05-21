import asyncio
import httpx
from playwright.async_api import async_playwright
from core.producto import construir_producto

BASE_URL = "https://www.megatiendas.co"
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


async def configurar_ubicacion(page):
    try:
        print("Esperando modal de ubicación...")
        await page.wait_for_selector(
            '.megatiendas-delivery-modal-1-x-ModalFormAddress__card_content',
            timeout=10000
        )
        print("Modal detectado")

        for campo, valor in [
            ("#react-select-2-input", "Bolívar"),
            ("#react-select-3-input", "Cartagena"),
            ("#react-select-4-input", "Centro"),
        ]:
            input = page.locator(campo)
            await input.click()
            await input.fill(valor)
            await page.wait_for_timeout(2000)
            await page.keyboard.press("ArrowDown")
            await page.keyboard.press("Enter")
            await page.wait_for_timeout(3000)

        await page.locator('.megatiendas-delivery-modal-1-x-ModalFormAddress__card_btn').first.click()
        await page.wait_for_timeout(5000)
        print("Ubicación configurada\n")

    except Exception as e:
        print(f"Error configurando ubicación: {e}")


async def hacer_scroll(page):
    ultimo_total = 0
    intentos_iguales = 0
    while True:
        await page.mouse.wheel(0, 15000)
        await asyncio.sleep(3)
        total_actual = await page.locator('[data-af-element="search-result"]').count()
        print(f"Productos cargados: {total_actual}")
        if total_actual == ultimo_total:
            intentos_iguales += 1
        else:
            intentos_iguales = 0
            ultimo_total = total_actual
        if intentos_iguales >= 6:
            break


async def presionar_mostrar_mas(page):
    while True:
        try:
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(3)
            boton = page.locator('.vtex-search-result-3-x-buttonShowMore a')
            if await boton.count() == 0 or not await boton.is_visible():
                break
            productos_antes = await page.locator('[data-af-element="search-result"]').count()
            await boton.scroll_into_view_if_needed()
            await asyncio.sleep(2)
            await boton.click(force=True)
            for _ in range(10):
                await asyncio.sleep(1)
                if await page.locator('[data-af-element="search-result"]').count() > productos_antes:
                    break
            await hacer_scroll(page)
        except Exception as e:
            print(f"Error Mostrar más: {e}")
            break


async def scrape():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        print("Cargando página...")
        await page.goto(f"{BASE_URL}/despensa", wait_until="domcontentloaded")

        await configurar_ubicacion(page)

        print("Scroll inicial...")
        await hacer_scroll(page)
        await presionar_mostrar_mas(page)

        print("\nScroll final...")
        await hacer_scroll(page)

        productos_locator = page.locator('[data-af-element="search-result"]')
        total = await productos_locator.count()
        print(f"\nTotal: {total} productos\n")

        urls_vistas = set()

        async with httpx.AsyncClient() as cliente:
            for i in range(total):
                try:
                    producto = productos_locator.nth(i)

                    link = await producto.locator('a').first.get_attribute("href")
                    if not link or link == "/" or not link.startswith("/"):
                        continue
                    url = BASE_URL + link
                    if url in urls_vistas:
                        continue
                    urls_vistas.add(url)

                    nombre = (await producto.locator('.vtex-product-summary-2-x-productBrand').first.inner_text()).strip()
                    precio = (await producto.locator('.vtex-product-price-1-x-currencyContainer').first.inner_text()).strip()

                    if not nombre or not precio:
                        continue

                    datos = construir_producto(
                        nombre=nombre,
                        precio=precio,
                        url=url,
                        tienda="Megatiendas",
                        categoria=CATEGORIA,
                    )
                    datos["url_base"] = BASE_URL
                    await enviar_producto(cliente, datos)

                except Exception as e:
                    print(f"Error producto {i}: {e}")

        await browser.close()
    print("\n✅ Scraping de Megatiendas finalizado")


asyncio.run(scrape())