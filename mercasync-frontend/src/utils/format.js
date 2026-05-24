export function fmt(n) {
  return `$${Number(n).toLocaleString("es-CO")}`
}

export function parseQuantity(cantidad, unidad) {
  if (!cantidad) return null
  const num = parseFloat(String(cantidad).replace(/[^\d.]/g, ''))
  if (isNaN(num) || num <= 0) return null

  const unitLower = (unidad || '').toLowerCase()
  if (unitLower.includes('kg') || unitLower.includes('kilo'))   return { value: num * 1000,     unit: 'g'   }
  if (unitLower.includes('lb') || unitLower.includes('libra'))  return { value: num * 453.592,  unit: 'g'   }
  if (unitLower.includes('l') && !unitLower.includes('ml'))     return { value: num * 1000,     unit: 'ml'  }
  if (unitLower.includes('ml'))                                  return { value: num,            unit: 'ml'  }
  if (unitLower.includes('g') || unitLower.includes('gr'))      return { value: num,            unit: 'g'   }
  if (unitLower.includes('und') || unitLower.includes('unid'))  return { value: num,            unit: 'und' }
  return { value: num, unit: unidad || 'und' }
}

export function calcPricePerUnit(precio, cantidad, unidad) {
  const parsed = parseQuantity(cantidad, unidad)
  if (!parsed || parsed.value <= 0) return null
  return { price: precio / parsed.value, unit: parsed.unit }
}

export function formatPricePerUnit(ppu) {
  if (!ppu) return null
  const unitLabel    = ppu.unit === 'g' ? '/100g' : ppu.unit === 'ml' ? '/100ml' : `/${ppu.unit}`
  const displayPrice = ppu.unit === 'g' || ppu.unit === 'ml' ? ppu.price * 100 : ppu.price
  return `${fmt(Math.round(displayPrice))}${unitLabel}`
}