import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { SUPERMARKETS, STORE_COLORS } from "../../constants/data"

// Fix leaflet icons en Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

function createCustomIcon(color) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background-color: ${color};
      width: 20px; height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize:   [20, 20],
    iconAnchor: [10, 10],
    popupAnchor:[0, -12],
  })
}

export default function MapSection({ t }) {
  const [selectedMarket, setSelectedMarket] = useState(null)
  const [mapReady, setMapReady] = useState(false)

  // Leaflet necesita que el DOM esté listo
  useEffect(() => { setMapReady(true) }, [])

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
        {/* Mapa */}
        <div className="map-wrapper">
          {mapReady && (
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
              {SUPERMARKETS.map(market => (
                <Marker
                  key={market.id}
                  position={[market.lat, market.lng]}
                  icon={createCustomIcon(STORE_COLORS[market.brand])}
                  eventHandlers={{ click: () => setSelectedMarket(market) }}
                >
                  <Popup>
                    <div style={{ fontSize: 13, fontFamily: "DM Sans, sans-serif" }}>
                      <p style={{ fontWeight: 700, margin: "0 0 2px" }}>{market.name}</p>
                      <p style={{ color: "#666", margin: 0 }}>{market.zone}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Sidebar */}
        <div className="map-sidebar">
          <h3>Supermercados en Cartagena</h3>

          {selectedMarket ? (
            <div className="market-detail">
              <button className="back-btn" onClick={() => setSelectedMarket(null)}>
                ← Ver todos
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div className="market-dot" style={{ background: STORE_COLORS[selectedMarket.brand] }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{selectedMarket.brand}</span>
              </div>
              <h4>{selectedMarket.name}</h4>
              <p className="brand">{selectedMarket.zone}</p>
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
                {selectedMarket.services.map(s => (
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
                {markets.map(market => (
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