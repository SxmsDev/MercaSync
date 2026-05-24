import { BRANDS } from "../../constants/data"

export default function BrandsCarousel() {
  const duplicated = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS]

  return (
    <section className="brands-section">
      <p className="section-label" style={{ textAlign: "center", marginBottom: 32 }}>
        Marcas con las que trabajamos
      </p>
      <div style={{ overflow: "hidden" }}>
        <div className="brands-track">
          {duplicated.map((brand, i) => (
            <div key={i} className="brand-item" style={{ color: brand.color }}>
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}