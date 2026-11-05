export default function Header({ count, playing, onReplay }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex min-h-[68px] max-w-[1360px] flex-wrap items-center justify-between gap-3 px-4 sm:px-7">
        <a href="#top" className="inline-flex items-center gap-2.5 text-ink no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <circle cx="14" cy="14" r="12" fill="#FDE3EA" />
            <path d="M14 4l2.4 7.6L24 14l-7.6 2.4L14 24l-2.4-7.6L4 14l7.6-2.4z" fill="#C2456E" />
            <circle cx="14" cy="14" r="2.2" fill="#FFF8F2" />
          </svg>
          <span className="font-serif text-[22px] font-semibold tracking-tight">
            little world<span className="text-rose">.</span>
          </span>
        </a>

        <nav aria-label="Sections" className="hidden gap-7 sm:flex">
          <a href="#atlas" className="inline-flex min-h-11 items-center border-b-2 border-rose px-1 text-sm font-semibold text-ink">Photo map</a>
          <a href="#postcards" className="inline-flex min-h-11 items-center gap-2 border-b-2 border-transparent px-1 text-sm font-semibold text-muted hover:text-ink">
            Postcards
            <span className="rounded-full bg-[#F3E9F7] px-2 font-mono text-[11px] text-[#6B4FA8]">{count}</span>
          </a>
        </nav>

        <button
          type="button"
          onClick={onReplay}
          aria-pressed={playing}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-rose px-4 text-sm font-semibold text-white transition hover:bg-rose-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose active:scale-[.97]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={playing ? 'M6 5h4v14H6zM14 5h4v14h-4z' : 'M7 4.5v15l12-7.5z'} />
          </svg>
          {playing ? 'Pause journey' : 'Replay my journey'}
        </button>
      </div>
    </header>
  )
}
