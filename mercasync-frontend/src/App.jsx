import { useState } from "react"
import { THEMES }      from "./constants/themes"
import { makeCSS }     from "./styles/makeCSS"
import Navbar          from "./components/Navbar"
import LandingPage     from "./pages/landing/LandingPage"
import Comparador      from "./pages/Comparador"
import Listado         from "./pages/Listado"
import Canasta         from "./pages/Canasta"

export default function App() {
  const [page, setPage]           = useState("inicio")
  const [canasta, setCanasta]     = useState([])
  const [isDark, setIsDark]       = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const t = THEMES[isDark ? "dark" : "light"]

  const agregarCanasta = (item) => {
    setCanasta(prev => {
      const idx = prev.findIndex(i => i.nombre === item.nombre && i.supermercado === item.supermercado)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        return next
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setPage("comparar")
  }

  const updateQty = (i, q) => setCanasta(prev => { const n = [...prev]; n[i] = { ...n[i], qty: q }; return n })
  const removeItem = (i) => setCanasta(prev => prev.filter((_, j) => j !== i))

  return (
    <>
      <style>{makeCSS(t)}</style>

      <Navbar
        page={page}
        setPage={setPage}
        canasta={canasta}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {page === "inicio"    && <LandingPage onSearch={handleSearch} t={t} />}
      {page === "comparar"  && <Comparador  onAgregarCanasta={agregarCanasta} t={t} initialQuery={searchQuery} />}
      {page === "productos" && <Listado     onAgregarCanasta={agregarCanasta} t={t} />}
      {page === "canasta"   && <Canasta     items={canasta} onUpdate={updateQty} onRemove={removeItem} t={t} />}
    </>
  )
}