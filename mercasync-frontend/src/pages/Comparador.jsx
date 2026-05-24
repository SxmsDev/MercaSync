    import { useState, useEffect, useCallback } from "react"
import StoreChip from "../components/StoreChip"
import ProdImg   from "../components/ProdImg"
import Spinner   from "../components/Spinner"
import { fmt, calcPricePerUnit, formatPricePerUnit } from "../utils/format"

const API = "http://127.0.0.1:8000"

export default function Comparador({ onAgregarCanasta, t, initialQuery }) {
  const [q, setQ]           = useState(initialQuery || "")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const buscar = useCallback(async () => {
    if (!q.trim()) return
    setLoading(true); setSearched(true)
    try {
      const res = await fetch(`${API}/comparar?nombre=${encodeURIComponent(q)}`)
      if (!res.ok) { setResults([]); return }
      setResults(await res.json())
    } catch { setResults([]) }
    finally { setLoading(false) }
  }, [q])

  useEffect(() => {
    if (initialQuery) { setQ(initialQuery); buscar() }
  }, [initialQuery])

  const grouped = results.reduce((acc, r) => {
    const key = r.producto
    if (!acc[key]) acc[key] = { nombre: r.producto, marca: r.marca, cantidad: r.cantidad, unidad: r.unidad, precios: [] }
    acc[key].precios.push({ ...r, pricePerUnit: calcPricePerUnit(r.precio, r.cantidad, r.unidad) })
    return acc
  }, {})

  Object.values(grouped).forEach(g => g.precios.sort((a, b) => a.precio - b.precio))

  const allProducts = []
  Object.values(grouped).forEach(g => {
    g.precios.forEach((p, i) => {
      allProducts.push({
        ...p,
        groupName: g.nombre, groupMarca: g.marca, groupCantidad: g.cantidad, groupUnidad: g.unidad,
        isLowest: i === 0,
        highestPrice: g.precios[g.precios.length - 1]?.precio || g.precios[0].precio,
      })
    })
  })
  allProducts.sort((a, b) => a.precio - b.precio)

  const globalStats = allProducts.length > 0 ? {
    total:          allProducts.length,
    minPrice:       Math.min(...allProducts.map(p => p.precio)),
    maxPrice:       Math.max(...allProducts.map(p => p.precio)),
    avgPrice:       Math.round(allProducts.reduce((s, p) => s + p.precio, 0) / allProducts.length),
    cheapestStore:  allProducts[0]?.supermercado,
  } : null

  return (
    <div className="page fade-up">
      <p className="section-label">Comparador de precios</p>
      <h1 className="hero-title">Encuentra el mejor<br /><span>precio</span></h1>
      <p className="hero-sub">Compara el mismo producto entre todos los supermercados</p>

      <div className="search-wrap">
        <input className="search-input" placeholder="Ej: arroz, aceite, café..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && buscar()} />
        <button className="btn" onClick={buscar}>Buscar</button>
      </div>

      {loading && <Spinner />}
      {!loading && searched && results.length === 0 && (
        <div className="empty"><div className="empty-icon">🔍</div><p>No encontramos resultados para <strong>{`"${q}"`}</strong></p></div>
      )}

      {!loading && globalStats && (
        <>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20, marginBottom: 28, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 20 }}>
            {[
              { label: "Resultados",       value: globalStats.total,                             sub: "productos encontrados" },
              { label: "Precio más bajo",  value: fmt(globalStats.minPrice),                     sub: globalStats.cheapestStore, color: t.green },
              { label: "Precio promedio",  value: fmt(globalStats.avgPrice) },
              { label: "Ahorro potencial", value: fmt(globalStats.maxPrice - globalStats.minPrice), sub: `${Math.round(((globalStats.maxPrice - globalStats.minPrice) / globalStats.maxPrice) * 100)}% de diferencia`, color: t.green },
            ].map(({ label, value, sub, color }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{label}</div>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 24, color: color || t.text }}>{value}</div>
                {sub && <div style={{ fontSize: 12, color: t.textMuted }}>{sub}</div>}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {allProducts.map((p, i) => {
              const ppuFormatted  = formatPricePerUnit(p.pricePerUnit)
              const savingsFromMax = p.highestPrice - p.precio
              return (
                <div key={i} className={`card ${p.isLowest ? "rank-1" : ""}`}>
                  {p.isLowest && <div className="rank-badge">Más barato</div>}
                  <ProdImg src={p.imagen} alt={p.groupName} />
                  <div className="producto-nombre" style={{ fontSize: 13, marginBottom: 4 }}>{p.groupName}</div>
                  <div className="producto-meta" style={{ marginBottom: 10 }}>
                    {p.groupMarca && `${p.groupMarca} · `}{p.groupCantidad && `${p.groupCantidad}${p.groupUnidad}`}
                  </div>
                  <StoreChip name={p.supermercado} />
                  <div style={{ marginTop: 12 }}>
                    <div className="price-badge">{fmt(p.precio)}</div>
                    {ppuFormatted && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{ppuFormatted}</div>}
                    {savingsFromMax > 0 && p.isLowest && <div className="price-sub" style={{ color: t.green }}>Ahorra {fmt(savingsFromMax)}</div>}
                  </div>
                  <hr className="divider" />
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={p.url} target="_blank" rel="noreferrer"><button className="btn btn-ghost btn-sm">Ver</button></a>
                    <button className="btn btn-sm" style={{ flex: 1 }} onClick={() => onAgregarCanasta({ ...p, nombre: p.groupName })}>+ Canasta</button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}