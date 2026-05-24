export default function Logo({ size = "default", onClick }) {
  const fontSize = size === "large" ? "32px" : "20px"
  return (
    <div className="nav-logo" style={{ fontSize }} onClick={onClick}>
      Merca<span>Sync</span>
    </div>
  )
}