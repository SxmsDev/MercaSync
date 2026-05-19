import asyncio
from playwright.async_api import async_playwright

BASE_URL = "https://www.olimpica.com"

URL = "https://www.olimpica.com/supermercado/despensa"


async def cerrar_popup(page):

    try:

        popup = page.locator(".om-popup-close-x")

        if await popup.count() > 0:

            if await popup.first.is_visible():

                print("Popup detectado -> cerrando")

                await popup.first.click(force=True)

                await page.wait_for_timeout(1500)

    except:
        pass


async def main():

    productos_totales = []
    urls_vistas = set()

    async with async_playwright() as p:

        browser = await p.chromium.launch(
            headless=False
        )

        page = await browser.new_page(
            viewport={"width": 1400, "height": 900}
        )

        print("Entrando a la página...\n")

        await page.goto(
            URL,
            wait_until="domcontentloaded",
            timeout=120000
        )

        # esperar carga inicial
        await page.wait_for_timeout(6000)

        # cerrar popup
        await cerrar_popup(page)

        # =========================================
        # SCROLL LENTO Y LARGO
        # =========================================
        print("Haciendo scroll...\n")

        for i in range(40):

            await cerrar_popup(page)

            # scroll más humano
            await page.mouse.wheel(0, 7000)

            print(f"Scroll #{i + 1}")

            # tiempo suficiente para VTEX
            await page.wait_for_timeout(2500)

        print("\nEsperando carga final...\n")

        await page.wait_for_timeout(6000)

        # =========================================
        # PRODUCTOS
        # =========================================
        productos = page.locator(
            '[data-af-element="search-result"]'
        )

        total = await productos.count()

        print(f"\nProductos encontrados: {total}\n")

        for i in range(total):

            try:

                producto = productos.nth(i)

                # =========================
                # LINK
                # =========================
                link = await producto.locator("a").first.get_attribute("href")

                if not link:
                    continue

                if "/p" not in link:
                    continue

                if not link.startswith("http"):
                    url_completa = BASE_URL + link
                else:
                    url_completa = link

                # evitar duplicados
                if url_completa in urls_vistas:
                    continue

                urls_vistas.add(url_completa)

                # =========================
                # NOMBRE
                # =========================
                nombre = "Sin nombre"

                selectores_nombre = [
                    ".vtex-product-summary-2-x-productBrand",
                    ".vtex-product-summary-2-x-productNameContainer",
                    ".vtex-store-components-3-x-productBrand"
                ]

                for selector in selectores_nombre:

                    try:

                        texto = await producto.locator(selector)\
                            .first.inner_text()

                        texto = texto.strip()

                        if texto and len(texto) > 2:

                            nombre = texto
                            break

                    except:
                        pass

                # =========================
                # PRECIO
                # =========================
                precio = "Sin precio"

                selectores_precio = [
                    ".olimpica-dinamic-flags-0-x-currencyContainer",
                    ".vtex-product-price-1-x-sellingPriceValue",
                    ".vtex-store-components-3-x-price_sellingPrice"
                ]

                for selector in selectores_precio:

                    try:

                        texto_precio = await producto.locator(selector)\
                            .first.inner_text()

                        texto_precio = texto_precio.strip()

                        if texto_precio:

                            precio = texto_precio
                            break

                    except:
                        pass

                # =========================
                # GUARDAR
                # =========================
                data = {
                    "nombre": nombre,
                    "precio": precio,
                    "url": url_completa
                }

                productos_totales.append(data)

                print("=" * 50)
                print(f"Nombre: {nombre}")
                print(f"Precio: {precio}")
                print(f"URL: {url_completa}")

            except Exception as e:

                print(f"Error producto {i + 1}: {e}")

        print("\n" + "=" * 50)
        print(
            f"TOTAL PRODUCTOS EXTRAÍDOS: {len(productos_totales)}"
        )

        await browser.close()


asyncio.run(main())