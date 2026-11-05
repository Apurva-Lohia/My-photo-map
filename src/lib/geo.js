import atlas from '../data/atlas.json'

export { atlas }

// Web-Mercator position of a lat/lon as a percentage of the map image.
export function project(lat, lon) {
  const m = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))
  return {
    x: ((lon + 180) / 360) * 100,
    y: ((atlas.MT - m) / (atlas.MT - atlas.MB)) * 100,
  }
}

export function distanceKm(a, b) {
  const R = 6371
  const t = Math.PI / 180
  const dLa = (b.lat - a.lat) * t
  const dLo = (b.lon - a.lon) * t
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLo / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function formatCoords(lat, lon) {
  return `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`
}

// Keep the view inside the map: z is the zoom, (cx, cy) the centre in % of the map.
export function clampView(z, cx, cy) {
  const zz = Math.max(1, Math.min(8, z))
  const h = 50 / zz
  return { z: zz, cx: Math.max(h, Math.min(100 - h, cx)), cy: Math.max(h, Math.min(100 - h, cy)) }
}

export function fitView(points) {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const z = Math.min(100 / ((x1 - x0) * 1.22), 100 / ((y1 - y0) * 1.32), 6)
  return clampView(z, (x0 + x1) / 2, (y0 + y1) / 2 - 12 / z)
}
