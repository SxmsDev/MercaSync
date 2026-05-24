import Logo from "./Logo"

export default function Navbar({ page, setPage, canasta, isDark, setIsDark }) {
  const nav = [
    { id: "inicio",    label: "Inicio" },
    { id: "comparar",  label: "Comparar" },
    { id: "productos", label: "Productos" },
    { id: "canasta",   label: `Canasta${canasta.length ? ` (${canasta.length})` : ""}` },
  ]

  return (
    <nav className="nav">
      <Logo onClick={() => setPage("inicio")} />
      <div className="nav-links">
        {nav.map(n => (
          <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
            {n.label}
          </button>
        ))}
        <button className="theme-toggle" onClick={() => setIsDark(d => !d)}>
          {isDark ? "☀️ Claro" : "🌙 Oscuro"}
        </button>
      </div>
    </nav>
  )
}