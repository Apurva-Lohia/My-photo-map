import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { places as placeList } from './data/places.js'
import media from './data/media.json'
import { project, distanceKm, formatCoords } from './lib/geo.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import AtlasMap from './components/AtlasMap.jsx'
import Journey from './components/Journey.jsx'
import PlacePanel from './components/PlacePanel.jsx'
import Postcards from './components/Postcards.jsx'

const pad = (n) => String(n).padStart(2, '0')

// Combine place data with real media (if any) or the illustrated stand-ins.
function buildPlaces() {
  return placeList.map((p, i) => {
    const real = (media[p.key] || []).map((m, j) => ({ ...m, caption: m.caption || `${p.name}, moment ${j + 1}` }))
    const items = real.length
      ? real
      : p.illustrations.map(([caption, time]) => ({ type: 'photo', src: `/illustrations/${p.key}-${time}.svg`, caption, time, illustration: true }))
    const firstPhoto = items.find((m) => m.type === 'photo')
    return {
      ...p,
      index: i,
      num: pad(i + 1),
      pos: project(p.lat, p.lon),
      coords: formatCoords(p.lat, p.lon),
      media: items,
      hasReal: real.length > 0,
      cover: firstPhoto ? firstPhoto.src : `/illustrations/${p.key}-day.svg`,
      illustration: `/illustrations/${p.key}-day.svg`,
      illustrationNight: `/illustrations/${p.key}-night.svg`,
    }
  })
}

export default function App() {
  const places = useMemo(buildPlaces, [])
  const [active, setActive] = useState(0)
  const [mediaIdx, setMediaIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [flyTo, setFlyTo] = useState({ index: null, tick: 0 })
  const timer = useRef(null)

  const stats = useMemo(() => {
    const home = places[0]
    let far = { km: 0, name: '' }
    places.forEach((p) => {
      const d = distanceKm(home, p)
      if (d > far.km) far = { km: d, name: p.name }
    })
    return {
      places: places.length,
      moments: places.reduce((n, p) => n + p.media.length, 0),
      countries: new Set(places.map((p) => p.country)).size,
      far,
    }
  }, [places])

  const select = useCallback((i, { fly = true } = {}) => {
    setActive(i)
    setMediaIdx(0)
    if (fly) setFlyTo((f) => ({ index: i, tick: f.tick + 1 }))
  }, [])

  const stopReplay = useCallback(() => {
    clearInterval(timer.current)
    timer.current = null
    setPlaying(false)
  }, [])

  const choose = useCallback((i) => { stopReplay(); select(i) }, [select, stopReplay])

  const toggleReplay = useCallback(() => {
    if (playing) { stopReplay(); return }
    setPlaying(true)
    let k = 0
    select(0)
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      k += 1
      if (k >= places.length) {
        stopReplay()
        setFlyTo((f) => ({ index: 'fit', tick: f.tick + 1 }))
        return
      }
      select(k)
    }, 2600)
  }, [playing, places.length, select, stopReplay])

  useEffect(() => () => clearInterval(timer.current), [])

  const surprise = () => {
    let j = Math.floor(Math.random() * places.length)
    if (j === active) j = (j + 3) % places.length
    choose(j)
    document.getElementById('atlas')?.scrollIntoView({ behavior: 'smooth' })
  }

  const cur = places[active]
  const n = places.length

  return (
    <div className="min-h-screen">
      <Header count={n} playing={playing} onReplay={toggleReplay} />
      <Hero stats={stats} />

      <section id="atlas" aria-label="Photo atlas" className="mx-auto max-w-[1360px] scroll-mt-20 px-4 sm:px-7">
        <div className="flex flex-wrap overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_30px_60px_-30px_rgba(43,34,51,.22)]">
          <div className="flex min-w-0 flex-[999_1_620px] flex-col">
            <AtlasMap places={places} active={active} playing={playing} flyTo={flyTo} onSelect={choose} />
            <Journey places={places} active={active} onSelect={choose} />
          </div>
          <PlacePanel
            key={cur.key}
            place={cur}
            total={n}
            mediaIdx={mediaIdx}
            onMedia={(i) => { stopReplay(); setMediaIdx(i) }}
            onPrev={() => choose((active - 1 + n) % n)}
            onNext={() => choose((active + 1) % n)}
            prevName={places[(active - 1 + n) % n].name}
            nextName={places[(active + 1) % n].name}
          />
        </div>
      </section>

      <Postcards places={places} onOpen={(i) => { choose(i); document.getElementById('atlas')?.scrollIntoView({ behavior: 'smooth' }) }} onSurprise={surprise} />

      <footer className="mx-auto flex max-w-[1360px] flex-wrap justify-between gap-3 px-4 pb-14 pt-10 text-[13.5px] text-muted sm:px-7">
        <span className="font-serif text-[17px] italic text-ink">Made for the moments between destinations.</span>
        <span>{places.some((p) => p.hasReal) ? 'Photos and videos by Apurva' : 'Illustrated stand-ins · add your photos to public/media'}</span>
      </footer>
    </div>
  )
}
