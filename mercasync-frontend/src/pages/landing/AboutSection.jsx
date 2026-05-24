import Logo from "../../components/Logo"

export default function AboutSection() {
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
            <div className="stat-box"><strong>+500</strong><span>Productos</span></div>
            <div className="stat-box"><strong>3</strong><span>Supermercados</span></div>
            <div className="stat-box"><strong>24/7</strong><span>Disponibilidad</span></div>
          </div>
        </div>
        <div className="how-box">
          <h3>¿Cómo funciona?</h3>
          <ul className="how-list">
            {[
              "Busca el producto que necesitas en nuestro comparador",
              "Compara precios entre Carulla, Olímpica y Megatiendas",
              "Agrega los productos más baratos a tu canasta",
              "¡Ahorra dinero en cada compra!",
            ].map((step, i) => (
              <li key={i}>
                <span className="how-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}