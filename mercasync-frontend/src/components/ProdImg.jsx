import { useState } from "react"

export default function ProdImg({ src, alt }) {
  const [err, setErr] = useState(false)
  if (!src || err) return <div className="prod-img-placeholder">🛒</div>
  return <img className="prod-img" src={src} alt={alt} onError={() => setErr(true)} loading="lazy" />
}