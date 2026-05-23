import { useState, useEffect, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const API = "http://127.0.0.1:8000"

// ═══════════════════════════════════════════════════════════════════════════════
// TEMAS (Claro y Oscuro)
// ═══════════════════════════════════════════════════════════════════════════════
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
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATOS
// ═══════════════════════════════════════════════════════════════════════════════
const BRANDS = [
  { name: "Carulla", color: "#e74c3c" },
  { name: "Olímpica", color: "#3498db" },
  { name: "Megatiendas", color: "#f39c12" },
  { name: "Éxito", color: "#f1c40f" },
  { name: "D1", color: "#e67e22" },
  { name: "Ara", color: "#9b59b6" },
]

const STORE_COLORS = { "Carulla": "#e74c3c", "Olímpica": "#3498db", "Megatiendas": "#f39c12" }

const SUPERMARKETS = [
  { id: 1, name: "Carulla Bocagrande", brand: "Carulla", address: "Cra. 3 #6-100, Bocagrande", zone: "Bocagrande", phone: "+57 5 665 1234", hours: "Lun-Sáb: 7:00 AM - 10:00 PM, Dom: 8:00 AM - 9:00 PM", lat: 10.3997, lng: -75.5564, services: ["Domicilios", "Parqueadero", "Cajeros"] },
  { id: 2, name: "Carulla Centro", brand: "Carulla", address: "Calle 32 #8-55, Centro Histórico", zone: "Centro", phone: "+57 5 664 5678", hours: "Lun-Sáb: 7:30 AM - 9:00 PM, Dom: 8:00 AM - 8:00 PM", lat: 10.4236, lng: -75.5483, services: ["Domicilios", "Panadería"] },
  { id: 3, name: "Olímpica Manga", brand: "Olímpica", address: "Av. del Consulado #25-100, Manga", zone: "Manga", phone: "+57 5 660 2345", hours: "Lun-Dom: 6:00 AM - 10:00 PM", lat: 10.4128, lng: -75.5389, services: ["Domicilios", "Parqueadero", "Farmacia", "Cajeros"] },
  { id: 4, name: "Olímpica Castellana", brand: "Olímpica", address: "Calle 31 #18-50, Castellana", zone: "Castellana", phone: "+57 5 661 8765", hours: "Lun-Dom: 6:00 AM - 11:00 PM", lat: 10.4089, lng: -75.5121, services: ["Domicilios", "Parqueadero", "Droguería"] },
  { id: 5, name: "Megatiendas Pie de la Popa", brand: "Megatiendas", address: "Cra. 20 #29A-85, Pie de la Popa", zone: "Pie de la Popa", phone: "+57 5 662 4321", hours: "Lun-Sáb: 7:00 AM - 9:00 PM, Dom: 8:00 AM - 7:00 PM", lat: 10.4167, lng: -75.5267, services: ["Parqueadero", "Carnicería"] },
  { id: 6, name: "Megatiendas El Bosque", brand: "Megatiendas", address: "Av. Pedro de Heredia #45-22, El Bosque", zone: "El Bosque", phone: "+57 5 663 9876", hours: "Lun-Dom: 7:00 AM - 10:00 PM", lat: 10.4056, lng: -75.4889, services: ["Domicilios", "Parqueadero"] },
]

// ═══════════════════════════════════════════════════════════════════════════════
// ESTILOS CSS DINÁMICOS
// ═══════════════════════════════════════════════════════════════════════════════
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
      position: sticky; top: 0; z-index: 1001;
      background: ${t.navBg}; backdrop-filter: blur(16px);
      border-bottom: 1px solid ${t.border};
      padding: 0 32px; display: flex; align-items: center; gap: 16px; height: 64px;
    }
    .nav-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:20px; color:${t.text}; letter-spacing:-0.5px; cursor:pointer; }
    .nav-logo span { color:${t.green}; }
    .nav-links { display:flex; gap:4px; margin-left:auto; align-items:center; }
    .nav-btn { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; color:${t.textMuted}; padding:8px 16px; border-radius:8px; transition:all 0.2s; }
    .nav-btn:hover { color:${t.text}; background:${t.bgCard}; }
    .nav-btn.active { color:${t.green}; background:${t.greenGlow}; }
    .theme-toggle { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:20px; padding:6px 14px; cursor:pointer; font-size:13px; color:${t.textMuted}; transition:all 0.2s; display:flex; align-items:center; gap:6px; margin-left:12px; }
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

    .prod-img { width:100%; height:140px; object-fit:contain; background:${t.imgBg}; border-radius:10px; margin-bottom:14px; }
    .prod-img-placeholder { width:100%; height:140px; background:${t.imgBg}; border-radius:10px; margin-bottom:14px; display:flex; align-items:center; justify-content:center; font-size:32px; }
    .producto-nombre { font-family:'Syne',sans-serif; font-weight:700; font-size:14px; line-height:1.3; margin-bottom:5px; }
    .producto-meta { font-size:12px; color:${t.textMuted}; }

    .spinner { width:28px; height:28px; border:2px solid ${t.border}; border-top-color:${t.green}; border-radius:50%; animation:spin 0.7s linear infinite; margin:60px auto; }
    .empty { text-align:center; padding:80px 20px; color:${t.textMuted}; }
    .empty-icon { font-size:40px; margin-bottom:12px; }

    .canasta-total { position:sticky; bottom:24px; background:${t.bgCard}; border:1px solid ${t.green}; box-shadow:0 0 40px ${t.greenGlow}; border-radius:16px; padding:20px 28px; display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top:32px; }
    .qty-ctrl { display:flex; align-items:center; gap:10px; }
    .qty-btn { width:28px; height:28px; border-radius:8px; border:1px solid ${t.border}; background:${t.bgHover}; color:${t.text}; font-size:16px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
    .qty-btn:hover { border-color:${t.green}; color:${t.green}; }
    .qty-num { font-family:'Syne',sans-serif; font-weight:700; font-size:14px; min-width:20px; text-align:center; }

    a { color:${t.green}; text-decoration:none; }
    a:hover { text-decoration:underline; }

    /* Landing Sections */
    .hero-section { padding:80px 32px; text-align:center; }
    .hero-section h1 { font-family:'Syne',sans-serif; font-size:clamp(40px,6vw,64px); font-weight:800; line-height:1.05; margin-bottom:20px; }
    .hero-section p { color:${t.textMuted}; font-size:18px; max-width:600px; margin:0 auto 40px; }

    .brands-section { padding:60px 32px; overflow:hidden; }
    .brands-track { display:flex; gap:48px; animation: scroll 20s linear infinite; }
    @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .brand-item { flex-shrink:0; width:160px; height:80px; background:${t.bgCard}; border:1px solid ${t.border}; border-radius:12px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:18px; }

    .about-section { background:${t.green}; padding:80px 32px; }
    .about-section h2 { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; color:#fff; margin-bottom:24px; }
    .about-section p { color:rgba(255,255,255,0.85); line-height:1.7; margin-bottom:16px; }
    .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; max-width:1100px; margin:0 auto; }
    .about-stats { display:flex; gap:16px; margin-top:24px; }
    .stat-box { background:rgba(255,255,255,0.15); backdrop-filter:blur(8px); border-radius:12px; padding:16px 20px; text-align:center; }
    .stat-box strong { display:block; font-size:28px; font-weight:800; color:#fff; }
    .stat-box span { font-size:13px; color:rgba(255,255,255,0.7); }
    .how-box { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:16px; padding:28px; }
    .how-box h3 { font-family:'Syne',sans-serif; font-weight:700; font-size:20px; color:#fff; margin-bottom:20px; }
    .how-list { list-style:none; }
    .how-list li { display:flex; align-items:flex-start; gap:12px; color:rgba(255,255,255,0.85); margin-bottom:16px; font-size:14px; }
    .how-num { background:${t.greenDark}; color:#fff; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }

    .map-section { padding:80px 32px; background:${t.bgHover}; }
    .map-section h2 { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; text-align:center; margin-bottom:12px; }
    .map-section > p { text-align:center; color:${t.textMuted}; margin-bottom:40px; max-width:600px; margin-left:auto; margin-right:auto; }
    .map-container { display:grid; grid-template-columns:2fr 1fr; gap:0; border-radius:16px; overflow:hidden; box-shadow:${t.shadow}; max-width:1100px; margin:0 auto; }
    .map-wrapper { height:500px; }
    .map-sidebar { background:${t.green}; padding:24px; overflow-y:auto; max-height:500px; }
    .map-sidebar h3 { font-family:'Syne',sans-serif; font-weight:700; font-size:18px; color:#fff; margin-bottom:20px; }
    .market-group { margin-bottom:20px; }
    .market-group-title { display:flex; align-items:center; gap:8px; color:#fff; font-weight:600; margin-bottom:10px; }
    .market-dot { width:10px; height:10px; border-radius:50%; }
    .market-btn { width:100%; text-align:left; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:12px; margin-bottom:8px; cursor:pointer; transition:all 0.2s; }
    .market-btn:hover { background:rgba(255,255,255,0.2); }
    .market-btn p { margin:0; color:#fff; font-weight:600; font-size:13px; }
    .market-btn span { font-size:11px; color:rgba(255,255,255,0.7); }
    .market-detail { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:20px; }
    .market-detail h4 { color:#fff; font-family:'Syne',sans-serif; font-weight:700; margin-bottom:4px; }
    .market-detail .brand { color:rgba(255,255,255,0.7); font-size:13px; margin-bottom:16px; }
    .market-info { display:flex; flex-direction:column; gap:12px; }
    .market-info-row { display:flex; gap:10px; color:rgba(255,255,255,0.9); font-size:13px; }
    .market-info-row svg { flex-shrink:0; color:rgba(255,255,255,0.6); }
    .market-services { display:flex; flex-wrap:wrap; gap:6px; margin-top:12px; }
    .service-tag { background:rgba(255,255,255,0.2); color:#fff; font-size:11px; padding:4px 10px; border-radius:20px; }
    .back-btn { background:none; border:none; color:rgba(255,255,255,0.7); font-size:13px; cursor:pointer; margin-bottom:16px; display:flex; align-items:center; gap:4px; }
    .back-btn:hover { color:#fff; }
    .map-legend { display:flex; justify-content:center; gap:24px; margin-top:24px; }
    .legend-item { display:flex; align-items:center; gap:8px; font-size:13px; color:${t.textMuted}; }
    .legend-dot { width:12px; height:12px; border-radius:50%; }

    .footer { background:#111; padding:60px 32px 40px; }
    .footer-content { max-width:1100px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:24px; }
    .footer-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:20px; color:#fff; }
    .footer-logo span { color:${t.green}; }
    .footer-links { display:flex; gap:32px; }
    .footer-links a { color:#888; font-size:14px; text-decoration:none; transition:color 0.2s; }
    .footer-links a:hover { color:${t.green}; }
    .footer-copy { width:100%; text-align:center; color:#555; font-size:13px; margin-top:32px; padding-top:32px; border-top:1px solid #222; }

    @media (max-width: 900px) { 
      .layout { grid-template-columns:1fr; } 
      .filters-panel { position:static; } 
      .about-grid { grid-template-columns:1fr; }
      .map-container { grid-template-columns:1fr; }
      .map-wrapper { height:350px; }
      .map-sidebar { max-height:400px; }
    }
  `;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════
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

function createCustomIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════════════════════════
function Logo({ size = "default", onClick }) {
  const fontSize = size === "large" ? "32px" : "20px"
  return (
    <div className="nav-logo" style={{ fontSize }} onClick={onClick}>
      Merca<span>Sync</span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING - HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function HeroSection({ onSearch, t }) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (query.trim()) onSearch(query)
  }

  return (
    <section className="hero-section">
      <p className="section-label">Comparador de precios</p>
      <h1>Encuentra el mejor<br /><span style={{ color: t.green }}>precio</span></h1>
      <p>Compara el mismo producto entre todos los supermercados de Cartagena</p>
      
      <div className="search-wrap" style={{ maxWidth: 560, margin: "0 auto" }}>
        <input
          className="search-input"
          placeholder="Ej: arroz, aceite, café..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="btn" onClick={handleSearch}>Buscar</button>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING - BRANDS CAROUSEL
// ═══════════════════════════════════════════════════════════════════════════════
function BrandsCarousel() {
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

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING - ABOUT SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function AboutSection({ t }) {
  return (
    <section className="about-section">
      <div className="about-grid">
        <div>
          <Logo size="large" />
          <h2 style={{ marginTop: 24 }}>¿Quiénes somos?</h2>
          <p>
            <strong>MercaSync</strong> es tu aliado para ahorrar en tus compras del supermercado. 
            Somos una plataforma que compara precios en tiempo real de los principales supermercados 
            de Cartagena, ayudándote a encontrar los mejores precios sin salir de casa.
          </p>
          <p>
            Nuestra misión es democratizar el acceso a información de precios, permitiéndote 
            tomar decisiones inteligentes y ahorrar dinero en cada compra.
          </p>
          <div className="about-stats">
            <div className="stat-box">
              <strong>+500</strong>
              <span>Productos</span>
            </div>
            <div className="stat-box">
              <strong>3</strong>
              <span>Supermercados</span>
            </div>
            <div className="stat-box">
              <strong>24/7</strong>
              <span>Disponibilidad</span>
            </div>
          </div>
        </div>
        <div className="how-box">
          <h3>¿Cómo funciona?</h3>
          <ul className="how-list">
            <li>
              <span className="how-num">1</span>
              <span>Busca el producto que necesitas en nuestro comparador</span>
            </li>
            <li>
              <span className="how-num">2</span>
              <span>Compara precios entre Carulla, Olímpica y Megatiendas</span>
            </li>
            <li>
              <span className="how-num">3</span>
              <span>Agrega los productos más baratos a tu canasta</span>
            </li>
            <li>
              <span className="how-num">4</span>
              <span>¡Ahorra dinero en cada compra!</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING - MAP SECTION
// ═══════════════════════════════════════════════════════════════════════════════
function MapSection({ t }) {
  const [selectedMarket, setSelectedMarket] = useState(null)

  const groupedByBrand = SUPERMARKETS.reduce((acc, market) => {
    if (!acc[market.brand]) acc[market.brand] = []
    acc[market.brand].push(market)
    return acc
  }, {})

  return (
    <section className="map-section">
      <h2>Encuentra tu <span style={{ color: t.green }}>supermercado</span></h2>
      <p>
        Explora todos los supermercados disponibles en Cartagena. Haz clic en un marcador 
        para ver detalles como horarios, dirección y servicios disponibles.
      </p>
      
      <div className="map-container">
        <div className="map-wrapper">
          <MapContainer
            center={[10.4100, -75.5200]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {SUPERMARKETS.map((market) => (
              <Marker
                key={market.id}
                position={[market.lat, market.lng]}
                icon={createCustomIcon(STORE_COLORS[market.brand])}
                eventHandlers={{ click: () => setSelectedMarket(market) }}
              >
                <Popup>
                  <div style={{ fontSize: 13 }}>
                    <p style={{ fontWeight: 700, margin: 0 }}>{market.name}</p>
                    <p style={{ color: "#666", margin: 0 }}>{market.zone}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="map-sidebar">
          <h3>Supermercados en Cartagena</h3>
          
          {selectedMarket ? (
            <div className="market-detail">
              <button className="back-btn" onClick={() => setSelectedMarket(null)}>
                ← Ver todos
              </button>
              <div className="market-dot" style={{ background: STORE_COLORS[selectedMarket.brand], width: 10, height: 10, marginBottom: 8 }} />
              <h4>{selectedMarket.name}</h4>
              <p className="brand">{selectedMarket.brand}</p>
              
              <div className="market-info">
                <div className="market-info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{selectedMarket.address}</span>
                </div>
                <div className="market-info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{selectedMarket.hours}</span>
                </div>
                <div className="market-info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>{selectedMarket.phone}</span>
                </div>
              </div>
              
              <div className="market-services">
                {selectedMarket.services.map((s) => (
                  <span key={s} className="service-tag">{s}</span>
                ))}
              </div>
            </div>
          ) : (
            Object.entries(groupedByBrand).map(([brand, markets]) => (
              <div key={brand} className="market-group">
                <div className="market-group-title">
                  <div className="market-dot" style={{ background: STORE_COLORS[brand] }} />
                  <span>{brand}</span>
                </div>
                {markets.map((market) => (
                  <button key={market.id} className="market-btn" onClick={() => setSelectedMarket(market)}>
                    <p>{market.name}</p>
                    <span>{market.zone}</span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="map-legend">
        {Object.entries(STORE_COLORS).map(([name, color]) => (
          <div key={name} className="legend-item">
            <div className="legend-dot" style={{ background: color }} />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═════════════════════════════════════════════════════════════════════════════���═
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <div className="footer-logo">Merca<span>Sync</span></div>
          <p style={{ color: "#666", marginTop: 8, fontSize: 14 }}>Tu comparador de precios en Cartagena</p>
        </div>
        <div className="footer-links">
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Contacto</a>
        </div>
      </div>
      <div className="footer-copy">© 2026 MercaSync. Todos los derechos reservados.</div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILTERS PANEL
// ═══════════════════════════════════════════════════════════════════════════════
function FiltersPanel({ filters, onChange, marcas, categorias, onClear }) {
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

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES PARA PRECIO POR UNIDAD
// ═══════════════════════════════════════════════════════════════════════════════
function parseQuantity(cantidad, unidad) {
  if (!cantidad) return null;
  const num = parseFloat(String(cantidad).replace(/[^\d.]/g, ''));
  if (isNaN(num) || num <= 0) return null;
  
  const unitLower = (unidad || '').toLowerCase();
  // Normalizar a gramos o mililitros
  if (unitLower.includes('kg') || unitLower.includes('kilo')) return { value: num * 1000, unit: 'g' };
  if (unitLower.includes('lb') || unitLower.includes('libra')) return { value: num * 453.592, unit: 'g' };
  if (unitLower.includes('l') && !unitLower.includes('ml')) return { value: num * 1000, unit: 'ml' };
  if (unitLower.includes('ml')) return { value: num, unit: 'ml' };
  if (unitLower.includes('g') || unitLower.includes('gr')) return { value: num, unit: 'g' };
  if (unitLower.includes('und') || unitLower.includes('unid')) return { value: num, unit: 'und' };
  return { value: num, unit: unidad || 'und' };
}

function calcPricePerUnit(precio, cantidad, unidad) {
  const parsed = parseQuantity(cantidad, unidad);
  if (!parsed || parsed.value <= 0) return null;
  return { price: precio / parsed.value, unit: parsed.unit };
}

function formatPricePerUnit(ppu) {
  if (!ppu) return null;
  const unitLabel = ppu.unit === 'g' ? '/100g' : ppu.unit === 'ml' ? '/100ml' : `/${ppu.unit}`;
  const displayPrice = ppu.unit === 'g' || ppu.unit === 'ml' ? ppu.price * 100 : ppu.price;
  return `${fmt(Math.round(displayPrice))}${unitLabel}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARADOR
// ═══════════════════════════════════════════════════════════════════════════════
function Comparador({ onAgregarCanasta, t, initialQuery }) {
  const [q, setQ] = useState(initialQuery || "");
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

  useEffect(() => {
    if (initialQuery) {
      setQ(initialQuery);
      buscar();
    }
  }, [initialQuery]);

  // Agrupar por producto y calcular precio por unidad
  const grouped = results.reduce((acc, r) => {
    const key = r.producto;
    if (!acc[key]) acc[key] = { nombre: r.producto, marca: r.marca, cantidad: r.cantidad, unidad: r.unidad, precios: [] };
    const ppu = calcPricePerUnit(r.precio, r.cantidad, r.unidad);
    acc[key].precios.push({ ...r, pricePerUnit: ppu });
    return acc;
  }, {});

  // Ordenar cada grupo por precio
  Object.values(grouped).forEach(g => {
    g.precios.sort((a, b) => a.precio - b.precio);
  });

  // Aplanar todos los productos en una sola lista para el grid
  const allProducts = [];
  Object.values(grouped).forEach(g => {
    g.precios.forEach((p, i) => {
      const ppu = p.pricePerUnit;
      allProducts.push({
        ...p,
        groupName: g.nombre,
        groupMarca: g.marca,
        groupCantidad: g.cantidad,
        groupUnidad: g.unidad,
        isLowest: i === 0,
        lowestPrice: g.precios[0].precio,
        highestPrice: g.precios[g.precios.length - 1]?.precio || g.precios[0].precio,
        pricePerUnit: ppu,
      });
    });
  });

  // Ordenar por precio (mas barato primero)
  allProducts.sort((a, b) => a.precio - b.precio);

  // Estadisticas globales
  const globalStats = allProducts.length > 0 ? {
    total: allProducts.length,
    minPrice: Math.min(...allProducts.map(p => p.precio)),
    maxPrice: Math.max(...allProducts.map(p => p.precio)),
    avgPrice: Math.round(allProducts.reduce((s, p) => s + p.precio, 0) / allProducts.length),
    cheapestStore: allProducts[0]?.supermercado,
    cheapestProduct: allProducts[0]?.groupName,
  } : null;

  return (
    <div className="page fade-up">
      <p className="section-label">Comparador de precios</p>
      <h1 className="hero-title">Encuentra el mejor<br /><span>precio</span></h1>
      <p className="hero-sub">Compara el mismo producto entre todos los supermercados</p>

      <div className="search-wrap">
        <input className="search-input" placeholder="Ej: arroz, aceite, cafe..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && buscar()} />
        <button className="btn" onClick={buscar}>Buscar</button>
      </div>

      {loading && <Spinner />}
      {!loading && searched && results.length === 0 && (
        <div className="empty"><div className="empty-icon">🔍</div><p>No encontramos resultados para <strong>{`"${q}"`}</strong></p></div>
      )}

      {!loading && globalStats && (
        <>
          {/* Panel de estadisticas globales */}
          <div style={{ 
            background: t.bgCard, 
            border: `1px solid ${t.border}`, 
            borderRadius: 16, 
            padding: 20, 
            marginBottom: 28,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 20
          }}>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Resultados</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 24, color: t.text }}>{globalStats.total}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>productos encontrados</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Precio mas bajo</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 24, color: t.green }}>{fmt(globalStats.minPrice)}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{globalStats.cheapestStore}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Precio promedio</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 24, color: t.text }}>{fmt(globalStats.avgPrice)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Ahorro potencial</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 24, color: t.green }}>{fmt(globalStats.maxPrice - globalStats.minPrice)}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{Math.round(((globalStats.maxPrice - globalStats.minPrice) / globalStats.maxPrice) * 100)}% de diferencia</div>
            </div>
          </div>

          {/* Grid de todos los productos */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: 16 
          }}>
            {allProducts.map((p, i) => {
              const ppuFormatted = formatPricePerUnit(p.pricePerUnit);
              const savingsFromMax = p.highestPrice - p.precio;
              
              return (
                <div key={i} className={`card ${p.isLowest ? "rank-1" : ""}`} style={{ animationDelay: `${Math.min(i * 0.03, 0.4)}s` }}>
                  {p.isLowest && <div className="rank-badge">Mas barato</div>}
                  <ProdImg src={p.imagen} alt={p.groupName} />
                  <div className="producto-nombre" style={{ fontSize: 13, marginBottom: 4 }}>{p.groupName}</div>
                  <div className="producto-meta" style={{ marginBottom: 10 }}>
                    {p.groupMarca && `${p.groupMarca} · `}{p.groupCantidad && `${p.groupCantidad}${p.groupUnidad}`}
                  </div>
                  <StoreChip name={p.supermercado} />
                  <div style={{ marginTop: 12 }}>
                    <div className="price-badge">{fmt(p.precio)}</div>
                    {ppuFormatted && (
                      <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{ppuFormatted}</div>
                    )}
                    {savingsFromMax > 0 && p.isLowest && (
                      <div className="price-sub" style={{ color: t.green }}>Ahorra {fmt(savingsFromMax)}</div>
                    )}
                  </div>
                  <hr className="divider" />
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={p.url} target="_blank" rel="noreferrer"><button className="btn btn-ghost btn-sm">Ver</button></a>
                    <button className="btn btn-sm" style={{ flex: 1 }} onClick={() => onAgregarCanasta({ ...p, nombre: p.groupName })}>+ Canasta</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LISTADO DE PRODUCTOS
// ═══════════════════════════════════════════════════════════════════════════════
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
        <FiltersPanel filters={filters} onChange={onChange} marcas={marcas} categorias={categorias} onClear={onClear} />

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

// ═══════════════════════════════════════════════════════════════════════════════
// CANASTA
// ═══════════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE (Inicio)
// ═══════════════════════════════════════════════════════════════════════════════
function LandingPage({ onSearch, t }) {
  return (
    <>
      <HeroSection onSearch={onSearch} t={t} />
      <BrandsCarousel />
      <AboutSection t={t} />
      <MapSection t={t} />
      <Footer t={t} />
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("inicio")
  const [canasta, setCanasta] = useState([])
  const [isDark, setIsDark] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const t = THEMES[isDark ? "dark" : "light"]

  const agregarCanasta = (item) => {
    setCanasta(prev => {
      const idx = prev.findIndex(i => i.nombre === item.nombre && i.supermercado === item.supermercado)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        return next
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setPage("comparar")
  }

  const nav = [
    { id: "inicio", label: "Inicio" },
    { id: "comparar", label: "Comparar" },
    { id: "productos", label: "Productos" },
    { id: "canasta", label: `Canasta${canasta.length ? ` (${canasta.length})` : ""}` },
  ]

  return (
    <>
      <style>{makeCSS(t)}</style>
      <nav className="nav">
        <Logo onClick={() => setPage("inicio")} />
        <div className="nav-links">
          {nav.map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>{n.label}</button>
          ))}
          <button className="theme-toggle" onClick={() => setIsDark(d => !d)}>
            {isDark ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
        </div>
      </nav>

      {page === "inicio" && <LandingPage onSearch={handleSearch} t={t} />}
      {page === "comparar" && <Comparador onAgregarCanasta={agregarCanasta} t={t} initialQuery={searchQuery} />}
      {page === "productos" && <Listado onAgregarCanasta={agregarCanasta} t={t} />}
      {page === "canasta" && <Canasta items={canasta} onUpdate={(i, q) => setCanasta(prev => { const n=[...prev]; n[i]={...n[i],qty:q}; return n; })} onRemove={i => setCanasta(prev => prev.filter((_,j) => j !== i))} t={t} />}
    </>
  )
}
