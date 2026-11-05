function Stat({ label, children, last }) {
  return (
    <div className={`px-5 py-3.5 ${last ? '' : 'border-r border-line'}`}>
      <dt className="eyebrow text-faint">{label}</dt>
      <dd className="mt-0.5 font-serif text-[30px] font-medium leading-tight">{children}</dd>
    </div>
  )
}

export default function Hero({ stats }) {
  return (
    <section id="top" className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-7 px-4 pb-7 pt-11 sm:px-7">
      <div className="max-w-[720px]">
        <p className="eyebrow text-faint">A little here, a little everywhere</p>
        <h1 className="mt-3 font-serif text-[44px] font-medium leading-none tracking-[-0.025em] sm:text-[64px]">
          A world, <span className="italic text-rose">remembered.</span>
          <svg className="anim-twinkle ml-1 inline-block align-top" width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2c.8 5.2 4.8 9.2 10 10-5.2.8-9.2 4.8-10 10-.8-5.2-4.8-9.2-10-10 5.2-.8 9.2-4.8 10-10z" fill="#E9B44C" />
          </svg>
        </h1>
        <p className="mt-3.5 max-w-[520px] text-[17px] text-muted">
          Every pin is a place I've stood. Every photo, a tiny time machine. Pick one and stay a while.
        </p>
      </div>
      <dl className="grid grid-cols-2 overflow-hidden rounded-[20px] border border-line bg-white sm:grid-cols-4">
        <Stat label="Places">{stats.places}</Stat>
        <Stat label="Moments">{stats.moments}</Stat>
        <Stat label="Countries">{stats.countries}</Stat>
        <Stat label={`Farthest · ${stats.far.name}`} last>
          {Math.round(stats.far.km).toLocaleString('en-US')}
          <span className="text-[15px] text-faint"> km</span>
        </Stat>
      </dl>
    </section>
  )
}
