import L from "leaflet"

export function createCustomIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

export function makeCSS(t) {
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

    .nav { position:sticky; top:0; z-index:1001; background:${t.navBg}; backdrop-filter:blur(16px); border-bottom:1px solid ${t.border}; padding:0 32px; display:flex; align-items:center; gap:16px; height:64px; }
    .nav-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:20px; color:${t.text}; letter-spacing:-0.5px; cursor:pointer; }
    .nav-logo span { color:${t.green}; }
    .nav-links { display:flex; gap:4px; margin-left:auto; align-items:center; }
    .nav-btn { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; color:${t.textMuted}; padding:8px 16px; border-radius:8px; transition:all 0.2s; }
    .nav-btn:hover { color:${t.text}; background:${t.bgCard}; }
    .nav-btn.active { color:${t.green}; background:${t.greenGlow}; }
    .theme-toggle { background:${t.bgCard}; border:1px solid ${t.border}; border-radius:20px; padding:6px 14px; cursor:pointer; font-size:13px; color:${t.textMuted}; transition:all 0.2s; display:flex; align-items:center; gap:6px; margin-left:12px; }
    .theme-toggle:hover { border-color:${t.green}; color:${t.green}; }

    .page { max-width:1140px; margin:0 auto; padding:48px 32px; }
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

    .hero-section { padding:80px 32px; text-align:center; }
    .hero-section h1 { font-family:'Syne',sans-serif; font-size:clamp(40px,6vw,64px); font-weight:800; line-height:1.05; margin-bottom:20px; }
    .hero-section p { color:${t.textMuted}; font-size:18px; max-width:600px; margin:0 auto 40px; }

    .brands-section { padding:60px 32px; overflow:hidden; }
    .brands-track { display:flex; gap:48px; animation:scroll 20s linear infinite; }
    @keyframes scroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
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

    @media (max-width:900px) {
      .layout { grid-template-columns:1fr; }
      .filters-panel { position:static; }
      .about-grid { grid-template-columns:1fr; }
      .map-container { grid-template-columns:1fr; }
      .map-wrapper { height:350px; }
      .map-sidebar { max-height:400px; }
    }
  `
}