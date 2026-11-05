export default function Postcards({ places, onOpen, onSurprise }) {
  return (
    <section id="postcards" aria-label="Postcards" className="mx-auto max-w-[1360px] scroll-mt-20 px-4 pb-6 pt-18 sm:px-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-faint">Wish you were here</p>
          <h2 className="mt-2 font-serif text-[36px] font-medium leading-tight tracking-[-0.02em] sm:text-[44px]">
            Postcards from <span className="italic text-rose">everywhere.</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={onSurprise}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#EADBD2] bg-white px-4 text-sm font-semibold transition hover:border-[#E9B9C8] hover:bg-[#FFF1F4]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c.8 5.2 4.8 9.2 10 10-5.2.8-9.2 4.8-10 10-.8-5.2-4.8-9.2-10-10 5.2-.8 9.2-4.8 10-10z" fill="#E9B44C" /></svg>
          Surprise me
        </button>
      </div>

      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {places.map((p, i) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onOpen(i)}
            aria-label={`Open ${p.name} on the map`}
            className="grid cursor-pointer grid-cols-[1.1fr_1fr] gap-3.5 rounded-md border border-line bg-[#FFFDF9] p-3 text-left shadow-[0_10px_24px_-12px_rgba(43,34,51,.18)] transition duration-300 hover:-translate-y-1.5 hover:-rotate-[.6deg] hover:shadow-[0_22px_40px_rgba(43,34,51,.16)]"
            style={{ rotate: `${i % 2 ? 0.6 : -0.5}deg` }}
          >
            <span className="relative block aspect-[4/3.4] overflow-hidden rounded-sm">
              <img src={p.cover} alt="" className="size-full object-cover" loading="lazy" />
              <span className="absolute bottom-1.5 left-2 font-serif text-2xl font-semibold italic text-white [text-shadow:0_2px_8px_rgba(43,34,51,.45)]">{p.name}</span>
            </span>
            <span className="relative flex flex-col gap-1.5 border-l border-dashed border-[#E3D3C8] pl-3 pt-1">
              <span className="absolute right-0 top-0 h-[50px] w-[42px] rotate-4 border-2 border-dotted bg-white p-[3px]" style={{ borderColor: p.line }}>
                <img src={p.illustrationNight} alt="" className="size-full object-cover" />
              </span>
              <span aria-hidden="true" className="absolute right-[34px] top-2.5 flex size-[46px] -rotate-12 flex-col items-center justify-center rounded-full border-[1.5px] opacity-60" style={{ borderColor: p.deep, color: p.deep }}>
                <span className="font-mono text-[7px] uppercase leading-tight tracking-[.1em]">{p.country}</span>
                <span className="font-mono text-[6px] leading-tight tracking-[.1em]">{p.code}</span>
              </span>
              <span className="h-[52px]" />
              <span className="font-serif text-sm italic leading-snug">{p.note}</span>
              <span className="mt-auto flex flex-col gap-2 pb-1">
                <span className="h-px bg-[#EADBD2]" />
                <span className="flex justify-between text-xs font-semibold text-muted">
                  <span>{p.region}</span>
                  <span>{p.media.length}</span>
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
