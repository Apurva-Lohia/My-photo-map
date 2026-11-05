export default function Journey({ places, active, onSelect }) {
  const n = places.length
  const inset = 50 / n
  return (
    <div className="flex items-center gap-5 border-t border-line px-5 pb-5 pt-4">
      <div className="shrink-0">
        <p className="eyebrow text-faint">From home</p>
        <p className="mt-0.5 font-serif text-[15px] italic">Kolkata, then everywhere</p>
      </div>
      <div className="no-scrollbar min-w-0 flex-1 overflow-x-auto">
        <div className="relative grid pt-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, minWidth: n * 76 }}>
          <span aria-hidden="true" className="absolute top-[15px] h-0.5 rounded bg-line" style={{ left: `${inset}%`, right: `${inset}%` }} />
          <span
            aria-hidden="true"
            className="absolute top-[15px] h-0.5 rounded bg-rose transition-[width] duration-700"
            style={{ left: `${inset}%`, width: `${(active / (n - 1)) * (100 - 2 * inset)}%` }}
          />
          {places.map((p, i) => {
            const on = i <= active
            const cur = i === active
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onSelect(i)}
                aria-pressed={cur}
                aria-label={`Stop ${i + 1}: ${p.name}`}
                className="group relative flex min-h-14 cursor-pointer flex-col items-center gap-1 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-transform group-hover:scale-125 ${
                    cur ? 'border-rose bg-rose text-white' : on ? 'border-rose bg-[#FDE3EA] text-rose' : 'border-[#E3D3C8] bg-white text-faint'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="whitespace-nowrap text-[12.5px] font-bold">{p.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[.08em] text-faint">{p.home ? 'home' : p.country}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
