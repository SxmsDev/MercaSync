export default function Footer({ t }) {
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