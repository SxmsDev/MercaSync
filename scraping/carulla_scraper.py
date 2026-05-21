import sys
import os
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

import asyncio
import httpx
from playwright.async_api import async_playwright
from core.producto import construir_producto

BASE_URL = "https://www.carulla.com"
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


async def scrape():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36",
            locale="es-CO",
        )

        await page.route("**/*", lambda route: (
            route.abort() if route.request.resource_type in ("image", "font", "media")
            else route.continue_()
        ))

        async with httpx.AsyncClient() as cliente:
            for page_num in range(10):
                url = f"{BASE_URL}/despensa?category-1=despensa&facets=category-1&sort=score_desc&page={page_num}"
                print(f"\n📄 Página {page_num}/49...")

                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_selector("article.productCard_productCard__M0677", timeout=15000)

                productos_raw = await page.evaluate("""() => {
                    return [...document.querySelectorAll('article.productCard_productCard__M0677')].map(card => ({
                        nombre: card.querySelector('h3.styles_name__qQJiK')?.textContent.trim(),
                        precio: card.querySelector('p[data-fs-container-precio-otros="true"]')?.textContent.trim()
                            || card.querySelector('p[data-fs-container-price-otros="true"]')?.textContent.trim(),
                        url: 'https://www.carulla.com' + card.querySelector('a[data-testid="product-link"]')?.getAttribute('href'),
                        imagen: card.querySelector('img')?.getAttribute('src') || '',
                    })).filter(p => p.nombre && p.precio && p.url)
                }""")

                print(f"  → {len(productos_raw)} productos encontrados")

                for raw in productos_raw:
                    datos = construir_producto(
                        nombre=raw["nombre"],
                        precio=raw["precio"],
                        url=raw["url"],
                        tienda="Carulla",
                        categoria=CATEGORIA,
                        imagen=raw["imagen"],
                    )
                    datos["url_base"] = BASE_URL
                    await enviar_producto(cliente, datos)

                await asyncio.sleep(1)

        await browser.close()
    print("\n✅ Scraping de Carulla finalizado")


asyncio.run(scrape())