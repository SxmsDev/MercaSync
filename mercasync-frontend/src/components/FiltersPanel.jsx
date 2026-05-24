export default function FiltersPanel({ filters, onChange, marcas, categorias, onClear }) {
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
  )
}