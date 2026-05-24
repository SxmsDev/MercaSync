import { useState } from "react"

export default function HeroSection({ onSearch, t }) {
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
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
        <button className="btn" onClick={handleSearch}>Buscar</button>
      </div>
    </section>
  )
}