function Media({ item, className, controls }) {
  if (item.type === 'video') {
    return (
      <video
        key={item.src}
        src={item.src}
        className={className}
        controls={controls}
        muted={!controls}
        playsInline
        preload="metadata"
        autoPlay={controls}
        loop={!controls}
      />
    )
  }
  return <img src={item.src} alt={item.caption} className={className} loading="lazy" />
}

export default function PlacePanel({ place, total, mediaIdx, onMedia, onPrev, onNext, prevName, nextName }) {
  const items = place.media
  const big = items[mediaIdx] || items[0]
  const others = items.map((m, i) => ({ m, i })).filter(({ i }) => i !== mediaIdx)
  const photos = items.filter((m) => m.type === 'photo').length
  const videos = items.length - photos
  const countLabel = [photos && `${photos} photograph${photos === 1 ? '' : 's'}`, videos && `${videos} video${videos === 1 ? '' : 's'}`].filter(Boolean).join(' · ')

  return (
    <aside
      aria-label={`${place.name} album`}
      className="relative min-h-[680px] min-w-0 flex-[1_1_360px] border-l border-line transition-colors duration-500 lg:max-w-[440px]"
      style={{ background: place.tint }}
    >
      <div className="no-scrollbar absolute inset-0 flex flex-col overflow-y-auto">
        <div className="anim-fade-up flex flex-col px-7 pt-7">
          <div className="flex items-center justify-between gap-2.5">
            <span className="font-mono text-[13px] text-muted">{place.num} / {String(total).padStart(2, '0')}</span>
            <span className="rounded border bg-white/60 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[.12em]" style={{ borderColor: place.line, color: place.deep }}>
              {place.home ? 'Home base' : place.hasReal ? 'My album' : 'Sample album'}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3.5">
            <h2 className="font-serif text-[46px] font-medium leading-none tracking-[-0.03em] sm:text-[52px]" style={{ color: place.deep }}>{place.name}</h2>
            <span className="size-[54px] shrink-0 -rotate-8 overflow-hidden rounded-full border-[3px] border-white shadow-[0_6px_14px_rgba(43,34,51,.18)]">
              <img src={place.illustration} alt="" className="size-full object-cover" />
            </span>
          </div>
          <p className="mt-3.5 font-mono text-[10.5px] uppercase tracking-[.12em] text-muted">{place.region} · {place.coords}</p>
          <p className="mt-6 font-serif text-xl font-medium italic leading-snug text-[#6A5A72]">{place.note}</p>

          <div className="mt-7 flex items-baseline justify-between gap-2.5">
            <span className="text-sm font-bold" style={{ color: place.deep }}>{countLabel}</span>
            <span className="text-[13.5px] text-muted">Little moments, kept.</span>
          </div>

          <figure key={big.src} className="anim-fade-in mt-3">
            <Media item={big} controls className="block aspect-[3/2] w-full rounded-xl bg-black/5 object-cover shadow-[0_10px_24px_-14px_rgba(43,34,51,.45)]" />
            <figcaption className="mt-2 font-serif text-sm italic text-muted">
              {big.caption}
              {big.time && <span className="font-mono text-[9.5px] uppercase not-italic tracking-[.12em] text-faint"> · {big.time}</span>}
            </figcaption>
          </figure>

          <div className="mt-3.5 grid grid-cols-2 gap-3">
            {others.map(({ m, i }) => (
              <button
                key={m.src}
                type="button"
                onClick={() => onMedia(i)}
                aria-label={`Linger on: ${m.caption}`}
                className="relative block cursor-pointer overflow-hidden rounded-xl transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: place.deep }}
              >
                <Media item={m} className="block aspect-[4/3] w-full object-cover" />
                {m.type === 'video' && (
                  <span className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill={place.deep}><path d="M7 4.5v15l12-7.5z" /></svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-serif text-[17px] font-medium italic text-[#6A5A72]">Click a photo to linger.</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A7F92" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 3L3 10.5l7 2.5 2.5 7z" /><path d="M10 13l11-10" />
            </svg>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 px-7 pb-6 pt-5">
          <NavButton onClick={onPrev} label={`Previous place: ${prevName}`} place={place} d="M19 12H5M11 6l-6 6 6 6" />
          <span className="text-[15px] text-muted">
            <span className="font-semibold" style={{ color: place.deep }}>{place.num}</span> / {String(total).padStart(2, '0')} places
          </span>
          <NavButton onClick={onNext} label={`Next place: ${nextName}`} place={place} d="M5 12h14M13 6l6 6-6 6" />
        </div>
      </div>
    </aside>
  )
}

function NavButton({ onClick, label, place, d }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border bg-white/55 transition hover:bg-white active:scale-95"
      style={{ borderColor: place.line, color: place.deep }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
    </button>
  )
}
