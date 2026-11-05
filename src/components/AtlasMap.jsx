import { useEffect, useMemo, useRef, useState } from 'react'
import { atlas, clampView, fitView } from '../lib/geo.js'
import { continents } from '../data/places.js'

const W = 2000
const H = 1173
const ROTS = [-5, 4, -3, 6, -4, 3, -6, 5, -2, 4]

function Btn({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#EADBD2] bg-white px-4 text-sm font-semibold text-ink transition hover:border-[#E9B9C8] hover:bg-[#FFF1F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose active:scale-[.97] aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function AtlasMap({ places, active, playing, flyTo, onSelect }) {
  const fit = useMemo(() => fitView(places.map((p) => p.pos)), [places])
  const [view, setView] = useState(fit)
  const [dragging, setDragging] = useState(false)
  const [labels, setLabels] = useState(true)
  const [route, setRoute] = useState(true)
  const [q, setQ] = useState('')
  const vpRef = useRef(null)
  const drag = useRef(null)
  const moved = useRef(false)
  const viewRef = useRef(view)
  viewRef.current = view

  // Fly to a place (or back to the overview) when the parent asks.
  useEffect(() => {
    if (flyTo.index === null) return
    if (flyTo.index === 'fit') { setView(fit); return }
    const p = places[flyTo.index]
    setView((v) => clampView(Math.max(v.z, 2.4), p.pos.x, p.pos.y))
  }, [flyTo, fit, places])

  // Pinch / ctrl+scroll to zoom, without hijacking normal page scrolling.
  useEffect(() => {
    const el = vpRef.current
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      zoomAt(Math.exp(-e.deltaY * 0.01), e)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  function zoomAt(f, e) {
    const r = vpRef.current.getBoundingClientRect()
    const u = ((e.clientX - r.left) / r.width) * 100
    const w = ((e.clientY - r.top) / r.height) * 100
    const v = viewRef.current
    const z2 = Math.max(1, Math.min(8, v.z * f))
    const lx = (u - (50 - v.z * v.cx)) / v.z
    const ly = (w - (50 - v.z * v.cy)) / v.z
    setView(clampView(z2, (50 - (u - z2 * lx)) / z2, (50 - (w - z2 * ly)) / z2))
  }

  const zoomBy = (f) => setView((v) => clampView(v.z * f, v.cx, v.cy))

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy, w: e.currentTarget.clientWidth, h: e.currentTarget.clientHeight }
    moved.current = false
  }
  const onPointerMove = (e) => {
    const g = drag.current
    if (!g) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (!moved.current && Math.abs(dx) + Math.abs(dy) < 5) return
    moved.current = true
    setDragging(true)
    setView((v) => clampView(v.z, g.cx - (dx / g.w) * 100 / v.z, g.cy - (dy / g.h) * 100 / v.z))
  }
  const endDrag = () => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    setTimeout(() => { moved.current = false }, 0)
  }

  const { z, cx, cy } = view
  const inv = 1 / z
  const fan = Math.max(0, Math.min(1, (4 - z) / 1.8))

  const countryLabels = !labels ? [] : atlas.labels.filter((l) => l[3] === 1 || (l[3] === 2 && z >= 1.8) || (l[3] === 3 && z >= 3.2))
  const seaLabels = !labels ? [] : atlas.seas.filter((s) => s[3] === 1 || z >= 1.8)
  const cityLabels = !labels || z < 3.2 ? [] : atlas.cities

  const spokes = useMemo(() => {
    const home = places[0].pos
    const HX = (home.x / 100) * W
    const HY = (home.y / 100) * H
    return places.slice(1).map((p) => {
      const X = (p.pos.x / 100) * W
      const Y = (p.pos.y / 100) * H
      const k = 0.22
      const mx = (HX + X) / 2 - (Y - HY) * k
      const my = (HY + Y) / 2 - (X - HX) * k
      return `M${HX.toFixed(1)} ${HY.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${X.toFixed(1)} ${Y.toFixed(1)}`
    })
  }, [places])

  const query = q.trim().toLowerCase()
  const suggestions = query ? places.filter((p) => `${p.name} ${p.region} ${p.country}`.toLowerCase().includes(query)) : []
  const legend = continents.filter((c) => places.some((p) => continentOf(p) === c.name))

  return (
    <>
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#F7F3EC] py-3 pl-5 pr-4">
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="eyebrow inline-flex items-center gap-2 text-ink">
            <span className="size-[9px] rounded-full bg-[#5DAA7A] shadow-[0_0_0_3px_#D8EEDF]" />
            The world, so far
          </span>
          {legend.map((l) => (
            <span key={l.name} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-muted">
              <span className="size-2.5 rounded-[3px]" style={{ background: l.fill }} />
              {l.name}
            </span>
          ))}
        </div>
        <div className="relative w-full sm:w-[260px]">
          <label className="flex min-h-11 items-center gap-2 rounded-full border border-[#EADBD2] bg-white px-3.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A7F92" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <span className="sr-only">Find a place</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a place…" className="min-h-10 w-full bg-transparent text-sm outline-none placeholder:text-faint" />
          </label>
          {suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-[52px] z-20 rounded-[18px] border border-[#EADBD2] bg-white p-1.5 shadow-[0_16px_34px_rgba(43,34,51,.16)]">
              {suggestions.map((p) => (
                <button key={p.key} type="button" onClick={() => { setQ(''); onSelect(p.index) }} className="flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-[#FFF1F4]">
                  <img src={p.cover} alt="" className="h-[34px] w-11 rounded-md object-cover" />
                  <span className="flex flex-col">
                    <span className="text-sm font-bold">{p.name}</span>
                    <span className="text-[12.5px] text-muted">{p.region} · {p.media.length} moments</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={vpRef}
        role="region"
        aria-label="World map. Drag to move, double-click to zoom in."
        className={`relative aspect-[2000/1173] w-full touch-none select-none overflow-hidden bg-sea ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onDoubleClick={(e) => zoomAt(1.8, e)}
      >
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `translate(${50 - z * cx}%, ${50 - z * cy}%) scale(${z})`,
            transition: dragging ? 'none' : 'transform .8s cubic-bezier(.3,.75,.2,1)',
          }}
        >
          <img src="/map/continents.svg" alt="" draggable="false" className="pointer-events-none absolute inset-0 block size-full" />

          {seaLabels.map(([n, x, y], i) => (
            <span key={`s${i}`} className="map-label pointer-events-none absolute whitespace-nowrap font-mono text-[11px] uppercase tracking-[.3em] text-[#3F7787]" style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%,-50%) scale(${inv})` }}>{n}</span>
          ))}
          {countryLabels.map(([n, x, y, t]) => (
            <span key={n} className="map-label pointer-events-none absolute whitespace-nowrap font-bold uppercase tracking-[.14em] text-[#5B5163]" style={{ left: `${x}%`, top: `${y}%`, fontSize: t === 1 ? 10.5 : t === 2 ? 9.5 : 9, transform: `translate(-50%,-50%) scale(${inv})` }}>{n}</span>
          ))}
          {cityLabels.map(([n, x, y], i) => (
            <span key={`c${i}`} className="map-label pointer-events-none absolute flex items-center gap-1.5 whitespace-nowrap text-[11.5px] font-semibold" style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-4px,-50%) scale(${inv})`, transformOrigin: '4px 50%' }}>
              <span className="block size-2 rounded-full border-2 border-[#5B5163] bg-white" />{n}
            </span>
          ))}

          {route && (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
              {spokes.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#C2456E" strokeLinecap="round" strokeOpacity={0.75} strokeWidth={2.4 / z} strokeDasharray={`${2 / z} ${9 / z}`} />
              ))}
              {playing && spokes.slice(0, active).map((d, i) => (
                <path key={`d${i}`} d={d} fill="none" stroke="#C2456E" strokeLinecap="round" strokeWidth={4 / z} />
              ))}
            </svg>
          )}

          {places.map((p, i) => {
            const isActive = i === active
            const lx = p.ox * fan
            const ly = -48 + (p.oy + 48) * fan
            return (
              <span key={p.key} className="absolute size-0 origin-top-left" style={{ left: `${p.pos.x}%`, top: `${p.pos.y}%`, transform: `scale(${inv})`, zIndex: isActive ? 6 : 2 }}>
                <svg width="1" height="1" aria-hidden="true" className="absolute left-0 top-0 overflow-visible">
                  <line x1="0" y1="0" x2={lx} y2={ly} stroke="#2B2233" strokeOpacity=".45" strokeWidth="1.5" strokeDasharray="2 3" />
                </svg>
                {isActive && <span aria-hidden="true" className="anim-pulse-ring absolute -left-3.5 -top-3.5 size-7 rounded-full border-2 border-rose" />}
                <span aria-hidden="true" className="absolute -left-1.5 -top-1.5 size-3 rounded-full border-[2.5px] border-white shadow-[0_2px_6px_rgba(43,34,51,.3)]" style={{ background: p.deep }} />
                <button
                  type="button"
                  onClick={() => { if (!moved.current) onSelect(i) }}
                  aria-label={`Open ${p.name} album, ${p.media.length} moments`}
                  aria-pressed={isActive}
                  className="absolute w-[62px] origin-bottom cursor-pointer bg-white px-[5px] pt-[5px] shadow-[0_2px_0_rgba(43,34,51,.06),0_10px_22px_rgba(43,34,51,.18)] transition duration-300 [transition-timing-function:cubic-bezier(.3,1.5,.5,1)] hover:z-10 hover:!rotate-0 hover:-translate-y-1.5 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
                  style={{ left: lx - 31, top: ly - 32, rotate: `${isActive ? 0 : ROTS[i % ROTS.length]}deg`, scale: isActive ? 1.18 : 1, outline: isActive ? `3px solid ${p.deep}` : undefined }}
                >
                  {p.home && (
                    <span className="absolute -left-2 -top-2.5 -rotate-6 rounded-[3px] px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[.14em] text-white" style={{ background: p.deep }}>home</span>
                  )}
                  <img src={p.cover} alt="" draggable="false" className="pointer-events-none block h-[38px] w-[52px] object-cover" />
                  <span className="block whitespace-nowrap text-center font-serif text-[11.5px] italic leading-5">{p.name}</span>
                  <span className="absolute -right-2 -top-2 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white px-1 text-[11px] font-bold text-white" style={{ background: p.deep }}>{p.media.length}</span>
                </button>
              </span>
            )
          })}
        </div>

        <svg width="34" height="44" viewBox="0 0 34 44" aria-hidden="true" className="absolute left-4 top-3.5">
          <text x="17" y="11" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="10" fill="#3F7787">N</text>
          <path d="M17 15l6 22-6-5-6 5z" fill="#3F7787" /><path d="M17 15l6 22-6-5z" fill="#2B5E6C" />
        </svg>

        <div className="absolute bottom-3.5 left-3.5 z-10 flex flex-wrap gap-2">
          <Btn aria-pressed={route} onClick={() => setRoute((r) => !r)} className="min-h-[38px] px-3.5 text-[13px]">Flight paths</Btn>
          <Btn aria-pressed={labels} onClick={() => setLabels((l) => !l)} className="min-h-[38px] px-3.5 text-[13px]">Labels</Btn>
          <span className="hidden self-center rounded-full bg-white/75 px-2.5 py-1 text-xs font-semibold text-[#3F7787] md:inline">drag to wander · double-click to zoom</span>
        </div>

        <div className="absolute right-3.5 top-3.5 z-10 flex flex-col gap-1.5">
          <Btn onClick={() => zoomBy(1.6)} aria-label="Zoom in" className="!rounded-[14px] !px-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </Btn>
          <Btn onClick={() => zoomBy(1 / 1.6)} aria-label="Zoom out" className="!rounded-[14px] !px-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>
          </Btn>
          <Btn onClick={() => setView(fit)} aria-label="Show all my places" className="!rounded-[14px] !px-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
          </Btn>
        </div>
      </div>
    </>
  )
}

function continentOf(p) {
  if (p.country === 'Australia') return 'Oceania'
  if (p.country === 'Russia') return 'Europe'
  return 'Asia'
}
