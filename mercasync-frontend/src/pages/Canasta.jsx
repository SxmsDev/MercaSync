import StoreChip from "../components/StoreChip"
import { fmt }   from "../utils/format"

export default function Canasta({ items, onUpdate, onRemove, t }) {
  const total = items.reduce((s, i) => s + i.precio * i.qty, 0)
  const porSupermercado = items.reduce((acc, item) => {
    const s = item.supermercado || "Sin tienda"
    acc[s] = (acc[s] || 0) + item.precio * item.qty
    return acc
  }, {})

  return (
    <div className="page fade-up">
      <p className="section-label">Mi canasta</p>
      <h1 className="hero-title">Lista de<br /><span>compras</span></h1>
      <p className="hero-sub">{items.length} producto{items.length !== 1 ? "s" : ""} agregado{items.length !== 1 ? "s" : ""}</p>

      {items.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🛒</div>
          <p>Tu canasta está vacía.<br />Agrega productos desde el comparador o el listado.</p>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {items.map((item, i) => (
              <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {item.imagen && (
                  <img src={item.imagen} alt={item.nombre} style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 8, background: t.imgBg, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                )}
                <div style={{ flex: 1 }}>
                  <div className="producto-nombre" style={{ fontSize: 13 }}>{item.nombre}</div>
                  {item.supermercado && <StoreChip name={item.supermercado} />}
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => item.qty > 1 ? onUpdate(i, item.qty - 1) : onRemove(i)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => onUpdate(i, item.qty + 1)}>+</button>
                </div>
                <div style={{ textAlign: "right", minWidth: 90 }}>
                  <div className="price-badge" style={{ fontSize: 16 }}>{fmt(item.precio * item.qty)}</div>
                  {item.qty > 1 && <div className="price-sub">{fmt(item.precio)} c/u</div>}
                </div>
                <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", color: t.textDim, cursor: "pointer", fontSize: 20, padding: 4, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>

          {Object.keys(porSupermercado).length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <p className="section-label">Total por supermercado</p>
              <div className="grid-2">
                {Object.entries(porSupermercado).sort((a, b) => a[1] - b[1]).map(([store, subtotal], i) => (
                  <div key={i} className={`card ${i === 0 ? "rank-1" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      {i === 0 && <div className="rank-badge" style={{ marginBottom: 6 }}>💰 Más económico</div>}
                      <StoreChip name={store} />
                    </div>
                    <span className="price-badge" style={{ fontSize: 20 }}>{fmt(subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="canasta-total">
            <div>
              <div style={{ fontSize: 12, color: t.textMuted, fontWeight: 500, marginBottom: 4 }}>TOTAL ESTIMADO</div>
              <div className="price-badge" style={{ fontSize: 32 }}>{fmt(total)}</div>
            </div>
            <button className="btn btn-danger" onClick={() => { if (window.confirm("¿Vaciar la canasta?")) { for (let i = items.length - 1; i >= 0; i--) onRemove(i) } }}>
              Vaciar canasta
            </button>
          </div>
        </>
      )}
    </div>
  )
}