import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { notes, archive, reviews, log0 } from './data'

const ease = [0.22, 1, 0.36, 1]

const Rv = ({ children, d = 0, ...p }) => (
  <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.8, delay: d, ease }} {...p}>
    {children}
  </motion.div>
)

const paths = {
  now: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" fill="currentColor" /></>,
  notes: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
  archive: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  reviews: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  log: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  pin: <><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
}
const Icon = ({ n, s = 28 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">{paths[n]}</svg>
)

const Head = ({ k, t, s }) => (
  <div className="phead"><Rv><p className="kick">{k}</p><h1>{t}</h1><p className="sub">{s}</p></Rv></div>
)

const Chips = ({ items, v, set }) => (
  <div className="chips">
    {items.map((i) => <button key={i} className={'chip' + (v === i ? ' on' : '')} onClick={() => set(i)}>{i}</button>)}
  </div>
)

function Card({ to, n, t, x, d }) {
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
  }
  return (
    <Rv d={d}>
      <Link to={to} className="card" onMouseMove={spot}>
        <Icon n={n} /><h3>{t}</h3><p>{x}</p>
        <span className="view">View <Icon n="arrow" s={16} /></span>
      </Link>
    </Rv>
  )
}

export function Home() {
  const ref = useRef()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <div className="wrap">
      <section className="hero" ref={ref}>
        <div>
          <Rv><p className="kick">Hello, I’m</p></Rv>
          <Rv d={0.1}><h1>AL-SAMI OVI</h1></Rv>
          <Rv d={0.2}><p className="sub">A personal corner of the internet.</p></Rv>
          <Rv d={0.3}>
            <p className="lead">Part portfolio. Part digital garden. Part archive. A space for my thoughts, projects, reviews and the little updates from my daily life.</p>
            <i className="rule" />
          </Rv>
          <Rv d={0.4}>
            <p className="meta"><Icon n="pin" s={15} /> Dhaka, Bangladesh <span>•</span> {today} <span>•</span> Still figuring it out.</p>
          </Rv>
        </div>
        <Rv d={0.2} className="img">
          <motion.img style={{ y }} src="/hero.svg" alt="A crescent moon above a tree at dusk" />
          <span className="hand">Better things ahead.</span>
        </Rv>
      </section>
      <section className="cards">
        <Card d={0} to="/about" n="now" t="Now" x="Currently reading: The Trial (Kafka). Also working on my personal website and learning more about OSINT." />
        <Card d={0.08} to="/notes" n="notes" t="Notes" x="Ideas, random thoughts, useful resources, and things I don’t want to forget." />
        <Card d={0.16} to="/archive" n="archive" t="Archive" x="Old posts, past projects, and things that shaped this space." />
        <Card d={0.24} to="/reviews" n="reviews" t="Reviews" x="Books, movies, anime, games, tech and more. Just my honest thoughts." />
        <Card d={0.32} to="/log" n="log" t="Daily log" x="Small updates from my everyday life, from study sessions to random moments." />
      </section>
    </div>
  )
}

export function About() {
  return (
    <div className="wrap">
      <Head k="About" t="About me" s="Still figuring it out, and that’s fine." />
      <div className="two">
        <Rv>
          <p className="lead big">I’m Al-Sami Ovi, based in Dhaka, Bangladesh. I like reading, building small corners of the internet, and learning how things work.</p>
          <p className="lead">Right now I’m reading The Trial by Kafka, working on this website, and learning more about OSINT.</p>
        </Rv>
        <Rv d={0.15}>
          <div className="card static">
            <h3>Say hello</h3>
            <a className="lk" href="mailto:alsamiovi90@gmail.com">alsamiovi90@gmail.com</a>
            <a className="lk" href="https://www.linkedin.com/in/al-sami-ovi" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </Rv>
      </div>
      <Rv><div className="chips">{['Reading', 'Web design', 'OSINT', 'Anime', 'Games', 'Writing'].map((i) => <span className="chip" key={i}>{i}</span>)}</div></Rv>
    </div>
  )
}

export function Archive() {
  return (
    <div className="wrap">
      <Head k="Archive" t="Archive" s="Old posts, past projects, and things that shaped this space." />
      {archive.map((a, i) => (
        <Rv key={a.t} d={i * 0.05}>
          <div className="row"><span className="yr">{a.y}</span><div className="grow"><h3>{a.t}</h3><p className="mut">{a.x}</p></div><span className="chip">{a.k}</span></div>
        </Rv>
      ))}
    </div>
  )
}

export function Notes() {
  const tags = ['All', ...new Set(notes.map((n) => n.tag))]
  const [f, setF] = useState('All')
  const [o, setO] = useState(null)
  return (
    <div className="wrap">
      <Head k="Notes" t="Notes" s="Ideas, random thoughts, useful resources, and things I don’t want to forget." />
      <Chips items={tags} v={f} set={setF} />
      {notes.filter((n) => f === 'All' || n.tag === f).map((n) => (
        <Rv key={n.t}>
          <button className="row col" onClick={() => setO(o === n.t ? null : n.t)}>
            <div className="rowtop"><h3>{n.t}</h3><span className="mut">{n.tag} · {n.d}</span></div>
            <AnimatePresence initial={false}>
              {o === n.t && (
                <motion.p className="mut" style={{ overflow: 'hidden' }} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}>{n.x}</motion.p>
              )}
            </AnimatePresence>
          </button>
        </Rv>
      ))}
    </div>
  )
}

export function Reviews() {
  const kinds = ['All', ...new Set(reviews.map((r) => r.k))]
  const [f, setF] = useState('All')
  return (
    <div className="wrap">
      <Head k="Reviews" t="Reviews" s="Books, movies, anime, games, tech and more. Just my honest thoughts." />
      <Chips items={kinds} v={f} set={setF} />
      <motion.div layout className="grid2">
        <AnimatePresence>
          {reviews.filter((r) => f === 'All' || r.k === f).map((r) => (
            <motion.article layout key={r.t} className="card static" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.4, ease }}>
              <span className="mut">{r.k}</span><h3>{r.t}</h3><p className="mut">{r.by}</p>
              <p className="stars">{'★'.repeat(r.r)}{'☆'.repeat(5 - r.r)}</p><p>{r.x}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function Log() {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('log')) || log0 } catch { return log0 } })
  const [v, setV] = useState('')
  useEffect(() => { try { localStorage.setItem('log', JSON.stringify(items)) } catch {} }, [items])
  const add = (e) => {
    e.preventDefault()
    if (!v.trim()) return
    setItems([{ d: new Date().toISOString().slice(0, 10), x: v.trim() }, ...items])
    setV('')
  }
  return (
    <div className="wrap">
      <Head k="Daily log" t="Daily log" s="Small updates from my everyday life, from study sessions to random moments." />
      <form className="add" onSubmit={add}>
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="What happened today?" />
        <button className="chip on">Add entry</button>
      </form>
      <div className="tl">
        {items.map((e, i) => (
          <Rv key={e.d + e.x} d={i < 6 ? i * 0.05 : 0}><div className="tli"><span className="mut">{e.d}</span><p>{e.x}</p></div></Rv>
        ))}
      </div>
    </div>
  )
}
