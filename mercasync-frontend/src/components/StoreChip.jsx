import { STORE_COLORS } from "../constants/data"

export default function StoreChip({ name }) {
  const color = STORE_COLORS[name] || "#888"
  return (
    <span className="store-chip">
      <span className="store-dot" style={{ background: color }} />
      {name}
    </span>
  )
}