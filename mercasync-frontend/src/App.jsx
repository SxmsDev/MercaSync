import { useState, useEffect, useCallback } from "react";

const API = "http://127.0.0.1:8000";

const THEMES = {
  dark: {
    bg: "#111111", bgCard: "#1a1a1a", bgHover: "#222222",
    border: "#2a2a2a", borderHover: "#383838",
    green: "#2ecc71", greenDark: "#27ae60", greenGlow: "rgba(46,204,113,0.15)",
    text: "#f0f0f0", textMuted: "#888", textDim: "#444",
    navBg: "rgba(17,17,17,0.92)", shadow: "0 4px 24px rgba(0,0,0,0.4)",
    imgBg: "#0d0d0d",
  },
  light: {
    bg: "#f5f5f3", bgCard: "#ffffff", bgHover: "#f0f0ee",
    border: "#e0e0dc", borderHover: "#ccc",
    green: "#1fa85a", greenDark: "#178a4a", greenGlow: "rgba(31,168,90,0.12)",
    text: "#111111", textMuted: "#666", textDim: "#aaa",
    navBg: "rgba(245,245,243,0.92)", shadow: "0 4px 24px rgba(0,0,0,0.08)",
    imgBg: "#f0f0ee",
  },
};

const STORE_COLORS = { "Carulla": "#e74c3c", "Olímpica": "#3498db", "Megatiendas": "#f39c12" };

function makeCSS(t) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${t.bg}; color: ${t.text}; font-family: 'DM Sans', sans-serif; min-height: 100vh; -webkit-font-smoothing: antialiased; transition: background 0.3s, color 0.3s; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${t.bg}; }
    ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fade-up { animation: fadeUp 0.35s ease both; }

    .nav {
      position: sticky; top: 0; z-index: 100;
      background: ${t.navBg}; backdrop-filter: blur(16px);
      border-bottom: 1px solid ${t.border};
      padding: 0 32px; display: flex; align-items: center; gap: 16px; height: 64px;
    }
    .nav-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:20px; color:${t.text}; letter-spacing:-0.5px; }
    .nav-logo span { color:${t.green}; }
    .nav-links { display:flex; gap:4px; margin-left:auto; }
    .nav-btn { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; color:${t.textMuted}; padding:8px 16px; border-radius:8px; transition:all 0.2s; }
    .nav-btn:hover { color:${t.text}; background:${t.bgCard}; }
    .nav-btn.active { color:${t.green}; background:${t.greenGlow}; }
    .theme-toggle { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:20px; padding:6px 14px; cursor:pointer; font-size:13px; color:${t.textMuted}; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
    .theme-toggle:hover { border-color:${t.green}; color:${t.green}; }

    .page { max-width: 1140px; margin: 0 auto; padding: 48px 32px; }
    .hero-title { font-family:'Syne',sans-serif; font-size:clamp(32px,5vw,52px); font-weight:800; line-height:1.05; letter-spacing:-1.5px; margin-bottom:10px; }
    .hero-title span { color:${t.green}; }
    .hero-sub { color:${t.textMuted}; font-size:15px; margin-bottom:36px; font-weight:300; }
    .section-label { font-family:'Syne',sans-serif; font-size:11px; font-weight:700; color:${t.textDim}; letter-spacing:2px; text-transform:uppercase; margin-bottom:16px; }

    .search-wrap { display:flex; gap:10px; margin-bottom:24px; }
    .search-input { flex:1; background:${t.bgCard}; border:1px solid ${t.border}; border-radius:12px; color:${t.text}; font-family:'DM Sans',sans-serif; font-size:15px; padding:13px 18px; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
    .search-input::placeholder { color:${t.textDim}; }
    .search-input:focus { border-color:${t.green}; box-shadow:0 0 0 3px ${t.greenGlow}; }

    .btn { background:${t.green}; color:#fff; border:none; cursor:pointer; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; padding:13px 22px; border-radius:12px; transition:all 0.2s; white-space:nowrap; }
    .btn:hover { background:${t.greenDark}; transform:translateY(-1px); }
    .btn:active { transform:translateY(0); }
    .btn-ghost { background:${t.bgCard}; border:1px solid ${t.border}; color:${t.text}; }
    .btn-ghost:hover { background:${t.bgHover}; border-color:${t.borderHover}; }
    .btn-sm { padding:7px 13px; font-size:12px; border-radius:8px; }
    .btn-danger { background:#e74c3c; }
    .btn-danger:hover { background:#c0392b; }

    .card { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:16px; padding:20px; transition:border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
    .card:hover { border-color:${t.borderHover}; transform:translateY(-2px); box-shadow:${t.shadow}; }
    .rank-1 { border-color:${t.green} !important; box-shadow:0 0 20px ${t.greenGlow} !important; }
    .rank-badge { font-family:'Syne',sans-serif; font-size:11px; font-weight:700; background:${t.green}; color:#fff; border-radius:6px; padding:2px 8px; display:inline-block; margin-bottom:8px; }

    .tag { display:inline-block; background:${t.greenGlow}; color:${t.green}; border:1px solid ${t.green}33; border-radius:20px; font-size:11px; font-weight:600; padding:3px 10px; letter-spacing:0.5px; text-transform:uppercase; }

    .price-badge { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:${t.green}; }
    .price-sub { font-size:12px; color:${t.textMuted}; margin-top:2px; }
    .price-expensive { color:#e74c3c !important; }

    .grid-3 { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; }
    .grid-2 { display:grid; grid-template-columns:repeat(auto-fill,minmax(380px,1fr)); gap:16px; }
    .divider { border:none; border-top:1px solid ${t.border}; margin:16px 0; }

    .store-chip { display:inline-flex; align-items:center; gap:6px; background:${t.bgHover}; border:1px solid ${t.border}; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:500; color:${t.textMuted}; }
    .store-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

    /* Filters sidebar */
    .layout { display:grid; grid-template-columns:240px 1fr; gap:28px; align-items:start; }
    .filters-panel { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:16px; padding:20px; position:sticky; top:80px; }
    .filter-title { font-family:'Syne',sans-serif; font-weight:700; font-size:13px; color:${t.text}; margin-bottom:12px; }
    .filter-group { margin-bottom:20px; }
    .filter-label { font-size:11px; font-weight:600; color:${t.textDim}; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
    .filter-select { width:100%; background:${t.bgHover}; border:1px solid ${t.border}; border-radius:8px; color:${t.text}; font-family:'DM Sans',sans-serif; font-size:13px; padding:8px 10px; outline:none; cursor:pointer; }
    .filter-select:focus { border-color:${t.green}; }
    .filter-input { width:100%; background:${t.bgHover}; border:1px solid ${t.border}; border-radius:8px; color:${t.text}; font-family:'DM Sans',sans-serif; font-size:13px; padding:8px 10px; outline:none; }
    .filter-input:focus { border-color:${t.green}; }
    .price-range { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .filter-chip-row { display:flex; flex-wrap:wrap; gap:6px; }
    .filter-chip { background:${t.bgHover}; border:1px solid ${t.border}; border-radius:20px; color:${t.textMuted}; font-size:12px; font-weight:500; padding:5px 12px; cursor:pointer; transition:all 0.2s; }
    .filter-chip:hover { border-color:${t.borderHover}; color:${t.text}; }
    .filter-chip.active { background:${t.greenGlow}; border-color:${t.green}; color:${t.green}; }
    .clear-btn { width:100%; margin-top:4px; }

    /* Product card image */
    .prod-img { width:100%; height:140px; object-fit:contain; background:${t.imgBg}; border-radius:10px; margin-bottom:14px; }
    .prod-img-placeholder { width:100%; height:140px; background:${t.imgBg}; border-radius:10px; margin-bottom:14px; display:flex; align-items:center; justify-content:center; font-size:32px; }
    .producto-nombre { font-family:'Syne',sans-serif; font-weight:700; font-size:14px; line-height:1.3; margin-bottom:5px; }
    .producto-meta { font-size:12px; color:${t.textMuted}; }

    /* Spinner & empty */
    .spinner { width:28px; height:28px; border:2px solid ${t.border}; border-top-color:${t.green}; border-radius:50%; animation:spin 0.7s linear infinite; margin:60px auto; }
    .empty { text-align:center; padding:80px 20px; color:${t.textMuted}; }
    .empty-icon { font-size:40px; margin-bottom:12px; }

    /* Canasta */
    .canasta-total { position:sticky; bottom:24px; background:${t.bgCard}; border:1px solid ${t.green}; box-shadow:0 0 40px ${t.greenGlow}; border-radius:16px; padding:20px 28px; display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top:32px; }
    .qty-ctrl { display:flex; align-items:center; gap:10px; }
    .qty-btn { width:28px; height:28px; border-radius:8px; border:1px solid ${t.border}; background:${t.bgHover}; color:${t.text}; font-size:16px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
    .qty-btn:hover { border-color:${t.green}; color:${t.green}; }
    .qty-num { font-family:'Syne',sans-serif; font-weight:700; font-size:14px; min-width:20px; text-align:center; }

    a { color:${t.green}; text-decoration:none; }
    a:hover { text-decoration:underline; }
    @media (max-width: 768px) { .layout { grid-template-columns:1fr; } .filters-panel { position:static; } }
  `;
}

function fmt(n) { return `$${Number(n).toLocaleString("es-CO")}`; }
function Spinner() { return <div className="spinner" />; }

function StoreChip({ name }) {
  const color = STORE_COLORS[name] || "#888";
  return <span className="store-chip"><span className="store-dot" style={{ background: color }} />{name}</span>;
}

function ProdImg({ src, alt }) {
  const [err, setErr] = useState(false);
  if (!src || err) return <div className="prod-img-placeholder">🛒</div>;
  return <img className="prod-img" src={src} alt={alt} onError={() => setErr(true)} loading="lazy" />;
}

// ─── FILTERS PANEL ───────────────────────────────────────────────────────────
function FiltersPanel({ filters, onChange, marcas, categorias, onClear, t }) {
  return (
    <div className="filters-panel">
      <div className="filter-title">Filtros</div>

      <div className="filter-group">
        <div className="filter-label">Categoría</div>
        <div className="filter-chip-row">
          <button className={`filter-chip ${!filters.categoria ? "active" : ""}`} onClick={() => onChange("categoria", null)}>Todas</button>
          {categorias.map(c => (
            <button key={c} className={`filter-chip ${filters.categoria === c ? "active" : ""}`} onClick={() => onChange("categoria", c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Marca</div>
        <select className="filter-select" value={filters.marca || ""} onChange={e => onChange("marca", e.target.value || null)}>
          <option value="">Todas las marcas</option>
          {marcas.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <div className="filter-label">Rango de precio</div>
        <div className="price-range">
          <input className="filter-input" type="number" placeholder="Mín" value={filters.precio_min || ""} onChange={e => onChange("precio_min", e.target.value ? Number(e.target.value) : null)} />
          <input className="filter-input" type="number" placeholder="Máx" value={filters.precio_max || ""} onChange={e => onChange("precio_max", e.target.value ? Number(e.target.value) : null)} />
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Ordenar por</div>
        <select className="filter-select" value={filters.orden || ""} onChange={e => onChange("orden", e.target.value || null)}>
          <option value="">Relevancia</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre A-Z</option>
        </select>
      </div>

      <button className="btn btn-ghost btn-sm clear-btn" onClick={onClear}>Limpiar filtros</button>
    </div>
  );
}

// ─── COMPARADOR ──────────────────────────────────────────────────────────────
function Comparador({ onAgregarCanasta, t }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const buscar = useCallback(async () => {
    if (!q.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`${API}/comparar?nombre=${encodeURIComponent(q)}`);
      if (!res.ok) { setResults([]); return; }
      setResults(await res.json());
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, [q]);

  const grouped = results.reduce((acc, r) => {
    const key = r.producto;
    if (!acc[key]) acc[key] = { nombre: r.producto, marca: r.marca, cantidad: r.cantidad, unidad: r.unidad, precios: [] };
    acc[key].precios.push(r);
    return acc;
  }, {});

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
        <div className="empty"><div className="empty-icon">🔍</div><p>No encontramos resultados para <strong>"{q}"</strong></p></div>
      )}

      {!loading && Object.values(grouped).map((g, gi) => (
        <div key={gi} style={{ marginBottom: 32 }} className="fade-up">
          <div style={{ marginBottom: 14 }}>
            <div className="producto-nombre" style={{ fontSize: 17 }}>{g.nombre}</div>
            <div className="producto-meta">{g.marca && `${g.marca} · `}{g.cantidad && `${g.cantidad}${g.unidad}`}</div>
          </div>
          <div className="grid-3">
            {g.precios.map((p, i) => {
              const diff = i > 0 ? p.precio - g.precios[0].precio : 0;
              const pct = i > 0 ? Math.round((diff / g.precios[0].precio) * 100) : 0;
              return (
                <div key={i} className={`card ${i === 0 ? "rank-1" : ""}`}>
                  {i === 0 && <div className="rank-badge">🏆 Más barato</div>}
                  <ProdImg src={p.imagen} alt={g.nombre} />
                  <StoreChip name={p.supermercado} />
                  <div style={{ marginTop: 12 }}>
                    <div className="price-badge">{fmt(p.precio)}</div>
                    {i > 0 && <div className="price-sub price-expensive">+{fmt(diff)} ({pct}% más caro)</div>}
                    {i === 0 && g.precios.length > 1 && <div className="price-sub" style={{ color: t.green }}>Ahorra hasta {fmt(g.precios[g.precios.length - 1].precio - p.precio)}</div>}
                  </div>
                  <hr className="divider" />
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={p.url} target="_blank" rel="noreferrer"><button className="btn btn-ghost btn-sm">Ver</button></a>
                    <button className="btn btn-sm" style={{ flex: 1 }} onClick={() => onAgregarCanasta({ ...p, nombre: g.nombre })}>+ Canasta</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LISTADO ─────────────────────────────────────────────────────────────────
const FILTERS_DEFAULT = { categoria: null, marca: null, precio_min: null, precio_max: null, orden: null };

function Listado({ onAgregarCanasta, t }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState(FILTERS_DEFAULT);

  const fetchMarcas = async () => {
    try { const r = await fetch(`${API}/marcas`); setMarcas(await r.json()); } catch {}
  };

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.categoria) params.set("categoria", filters.categoria);
      if (filters.marca) params.set("marca", filters.marca);
      if (filters.precio_min) params.set("precio_min", filters.precio_min);
      if (filters.precio_max) params.set("precio_max", filters.precio_max);
      if (filters.orden) params.set("orden", filters.orden);
      const res = await fetch(`${API}/productos?${params}`);
      setProductos(await res.json());
    } catch { setProductos([]); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchMarcas(); }, []);
  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  const onChange = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const onClear = () => setFilters(FILTERS_DEFAULT);

  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))];

  const filtrados = productos.filter(p =>
    !q || p.nombre_original?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="page fade-up">
      <p className="section-label">Catálogo</p>
      <h1 className="hero-title">Todos los<br /><span>productos</span></h1>
      <p className="hero-sub">{filtrados.length} productos encontrados</p>

      <div className="search-wrap">
        <input className="search-input" placeholder="Buscar en resultados..." value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <div className="layout">
        <FiltersPanel filters={filters} onChange={onChange} marcas={marcas} categorias={categorias} onClear={onClear} t={t} />

        <div>
          {loading && <Spinner />}
          {!loading && filtrados.length === 0 && (
            <div className="empty"><div className="empty-icon">📦</div><p>No hay productos con estos filtros</p></div>
          )}
          {!loading && (
            <div className="grid-3">
              {filtrados.map((p, i) => {
                const imagen = p.precios?.[0]?.imagen;
                const precioMenor = p.precio_menor;
                const tienda = p.precios?.[0]?.supermercado;
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
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-sm" style={{ flex: 1 }} onClick={() => onAgregarCanasta({ nombre: p.nombre_original, precio: precioMenor || 0, supermercado: tienda || "", imagen })}>
                        + Canasta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CANASTA ─────────────────────────────────────────────────────────────────
function Canasta({ items, onUpdate, onRemove, t }) {
  const total = items.reduce((s, i) => s + i.precio * i.qty, 0);
  const porSupermercado = items.reduce((acc, item) => {
    const s = item.supermercado || "Sin tienda";
    if (!acc[s]) acc[s] = 0;
    acc[s] += item.precio * item.qty;
    return acc;
  }, {});

  return (
    <div className="page fade-up">
      <p className="section-label">Mi canasta</p>
      <h1 className="hero-title">Lista de<br /><span>compras</span></h1>
      <p className="hero-sub">{items.length} producto{items.length !== 1 ? "s" : ""} agregado{items.length !== 1 ? "s" : ""}</p>

      {items.length === 0 && (
        <div className="empty"><div className="empty-icon">🛒</div><p>Tu canasta está vacía.<br />Agrega productos desde el comparador o el listado.</p></div>
      )}

      {items.length > 0 && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {items.map((item, i) => (
              <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {item.imagen && <img src={item.imagen} alt={item.nombre} style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 8, background: t.imgBg, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />}
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
            <button className="btn btn-danger" onClick={() => { if (window.confirm("¿Vaciar la canasta?")) { for (let i = items.length - 1; i >= 0; i--) onRemove(i); } }}>
              Vaciar canasta
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("comparar");
  const [canasta, setCanasta] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const t = THEMES[isDark ? "dark" : "light"];

  const agregarCanasta = (item) => {
    setCanasta(prev => {
      const idx = prev.findIndex(i => i.nombre === item.nombre && i.supermercado === item.supermercado);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const nav = [
    { id: "comparar", label: "Comparar" },
    { id: "listado",  label: "Productos" },
    { id: "canasta",  label: `Canasta${canasta.length ? ` (${canasta.length})` : ""}` },
  ];

  return (
    <>
      <style>{makeCSS(t)}</style>
      <nav className="nav">
        <div className="nav-logo">Merca<span>Sync</span></div>
        <div className="nav-links">
          {nav.map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>{n.label}</button>
          ))}
          <button className="theme-toggle" onClick={() => setIsDark(d => !d)}>
            {isDark ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
        </div>
      </nav>
      {page === "comparar" && <Comparador onAgregarCanasta={agregarCanasta} t={t} />}
      {page === "listado"  && <Listado    onAgregarCanasta={agregarCanasta} t={t} />}
      {page === "canasta"  && <Canasta items={canasta} onUpdate={(i, q) => setCanasta(prev => { const n=[...prev]; n[i]={...n[i],qty:q}; return n; })} onRemove={i => setCanasta(prev => prev.filter((_,j) => j !== i))} t={t} />}
    </>
  );
}