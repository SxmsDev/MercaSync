import asyncio
import sys
import os

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "scraping"))

from scraping.carulla_scraper import scrape as scrape_carulla
from scraping.olimpica_scraper import scrape as scrape_olimpica
from scraping.megatiendas_scraper import scrape as scrape_megatiendas


SCRAPERS = [
    ("Carulla",      scrape_carulla),
    ("Megatiendas",  scrape_megatiendas),
    ("Olímpica",     scrape_olimpica),
]


async def main():
    print("🛒 MercaSync — Iniciando scrapers\n")

    for nombre, scraper in SCRAPERS:
        print(f"{'='*50}")
        print(f"▶  {nombre}")
        print(f"{'='*50}")
        try:
            await scraper()
        except Exception as e:
            print(f"❌ Error en {nombre}: {e}")
        print()

    print("✅ Todos los scrapers finalizaron")


asyncio.run(main())