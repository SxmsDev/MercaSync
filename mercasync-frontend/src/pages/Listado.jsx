import { useState, useEffect, useCallback } from "react"
import FiltersPanel from "../components/FiltersPanel"
import ProdImg      from "../components/ProdImg"
import Spinner      from "../components/Spinner"
import { fmt }      from "../utils/format"

const API = "http://127.0.0.1:8000"
const FILTERS_DEFAULT = { categoria: null, marca: null, precio_min: null, precio_max: null, orden: null }

export default function Listado({ onAgregarCanasta, t }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [marcas, setMarcas]       = useState([])
  const [q, setQ]                 = useState("")
  const [filters, setFilters]     = useState(FILTERS_DEFAULT)

  useEffect(() => {
    fetch(`${API}/marcas`).then(r => r.json()).then(setMarcas).catch(() => {})
  }, [])

  const fetchProductos = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.categoria)  params.set("categoria",  filters.categoria)
      if (filters.marca)      params.set("marca",      filters.marca)
      if (filters.precio_min) params.set("precio_min", filters.precio_min)
      if (filters.precio_max) params.set("precio_max", filters.precio_max)
      if (filters.orden)      params.set("orden",      filters.orden)
      const res = await fetch(`${API}/productos?${params}`)
      setProductos(await res.json())
    } catch { setProductos([]) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchProductos() }, [fetchProductos])

  const onChange  = (key, val) => setFilters(f => ({ ...f, [key]: val }))
  const onClear   = () => setFilters(FILTERS_DEFAULT)
  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))]
  const filtrados  = productos.filter(p => !q || p.nombre_original?.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="page fade-up">
      <p className="section-label">Catálogo</p>
      <h1 className="hero-title">Todos los<br /><span>productos</span></h1>
      <p className="hero-sub">{filtrados.length} productos encontrados</p>

      <div className="search-wrap">
        <input className="search-input" placeholder="Buscar en resultados..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <div className="layout">
        <FiltersPanel filters={filters} onChange={onChange} marcas={marcas} categorias={categorias} onClear={onClear} />

        <div>
          {loading && <Spinner />}
          {!loading && filtrados.length === 0 && (
            <div className="empty"><div className="empty-icon">📦</div><p>No hay productos con estos filtros</p></div>
          )}
          {!loading && (
            <div className="grid-3">
              {filtrados.map((p, i) => {
                const imagen      = p.precios?.[0]?.imagen
                const precioMenor = p.precio_menor
                const tienda      = p.precios?.[0]?.supermercado
                return (
                  <div key={i} className="card fade-up" style={{ animationDelay: `${Math.min(i * 0.02, 0.3)}s` }}>
                    <ProdImg src={imagen} alt={p.nombre_original} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span className="tag">{p.categoria}</span>
                      {p.marca && <span style={{ fontSize: 11, color: t.textMuted }}>{p.marca}</span>}
                    </div>
                    <div className="producto-nombre">{p.nombre_original}</div>
                    <div className="producto-meta" style={{ marginBottom: 12 }}>{p.cantidad && `${p.cantidad}${p.unidad}`}</div>
                    {precioMenor > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div className="price-badge" style={{ fontSize: 18 }}>{fmt(precioMenor)}</div>
                        {tienda && <div className="price-sub">en {tienda}{p.precios?.length > 1 ? ` · ${p.precios.length} tiendas` : ""}</div>}
                      </div>
                    )}
                    <button className="btn btn-sm" style={{ width: "100%" }} onClick={() => onAgregarCanasta({ nombre: p.nombre_original, precio: precioMenor || 0, supermercado: tienda || "", imagen })}>
                      + Canasta
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}