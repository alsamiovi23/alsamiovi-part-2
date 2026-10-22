import { useEffect, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { Home, About, Archive, Notes, Reviews, Log } from './pages'

const links = [['/', 'Home'], ['/about', 'About'], ['/archive', 'Archive'], ['/notes', 'Notes'], ['/reviews', 'Reviews'], ['/log', 'Daily log']]

const ease = [0.22, 1, 0.36, 1]
const idx = (p) => Math.max(0, links.findIndex(([to]) => to === p))

// page slide variants: direction follows the nav order
const pv = {
  in: (d) => ({ opacity: 0, x: d * 40 }),
  show: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.45, ease } },
  out: (d) => ({ opacity: 0, x: d * -40, transition: { duration: 0.3 } }),
}

const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 29 15 4l12 25M9 29l7-14M19 29l-4-8" /></svg>
)

function Cursor() {
  const dot = useRef()
  const ring = useRef()
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return
    document.body.classList.add('has-cursor')
    let x = 0, y = 0, rx = 0, ry = 0, raf
    const move = (e) => {
      x = e.clientX; y = e.clientY
      dot.current.style.transform = `translate(${x}px,${y}px)`
      ring.current.classList.toggle('hover', !!e.target.closest('a,button,input'))
    }
    const loop = () => {
      rx += (x - rx) * 0.15; ry += (y - ry) * 0.15
      ring.current.style.transform = `translate(${rx}px,${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('mousemove', move)
    loop()
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf); document.body.classList.remove('has-cursor') }
  }, [])
  return <><div ref={ring} className="c-ring" /><div ref={dot} className="c-dot" /></>
}

// full-screen wipe shown on every page change (and once on first load)
function Curtain({ label, dir }) {
  const x = [`${dir * 100}%`, '0%', '0%', `${dir * -100}%`]
  return (
    <motion.div className="curtain" initial={{ x: x[0] }} animate={{ x }} transition={{ duration: 1.1, times: [0, 0.35, 0.5, 1], ease: [0.76, 0, 0.24, 1] }}>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.1, times: [0, 0.4, 0.55, 0.8] }}>{label}</motion.span>
    </motion.div>
  )
}

export default function App() {
  const loc = useLocation()
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [hide, setHide] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  // direction: +1 when moving forward in the nav, -1 when moving back
  const nav = useRef({ path: loc.pathname, dir: 1 })
  if (nav.current.path !== loc.pathname) {
    nav.current = { path: loc.pathname, dir: idx(loc.pathname) >= idx(nav.current.path) ? 1 : -1 }
  }
  const dir = nav.current.dir

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 })
    let raf, last = 0
    const tick = (t) => { lenis.raf(t); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    lenis.on('scroll', ({ scroll }) => { setHide(scroll > last && scroll > 120); last = scroll })
    window.__lenis = lenis
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])

  useEffect(() => {
    setOpen(false)
    const t = setTimeout(() => window.__lenis?.scrollTo(0, { immediate: true }), 400)
    return () => clearTimeout(t)
  }, [loc.pathname])

  useEffect(() => { open ? window.__lenis?.stop() : window.__lenis?.start() }, [open])

  const label = links[idx(loc.pathname)][1]

  return (
    <>
      <Cursor />
      <Curtain key={loc.pathname} label={label} dir={dir} />
      <motion.div className="bar" style={{ scaleX: bar }} />

      <header className={'nav' + (hide && !open ? ' hide' : '')}>
        <Link to="/" className="brand"><Logo /><span>AL-SAMI OVI</span></Link>
        <div className="right">
          <nav>
            {links.map(([to, n]) => <NavLink key={to} to={to} end={to === '/'}>{n}</NavLink>)}
          </nav>
          <button className="theme" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☾' : '☀'}</button>
          <button className={'burger' + (open ? ' on' : '')} aria-label="Menu" onClick={() => setOpen(!open)}><span /><span /></button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease }}>
            {links.map(([to, n], i) => (
              <motion.div key={to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease }}>
                <NavLink to={to} end={to === '/'} onClick={() => setOpen(false)}>{n}</NavLink>
              </motion.div>
            ))}
            <p className="sig">Same guy, new ideas.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.main key={loc.pathname} custom={dir} variants={pv} initial="in" animate="show" exit="out">
          <Routes location={loc}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/log" element={<Log />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <footer>
        <span>&lt;/&gt; Built with React + Vite</span>
        <span className="sig">Same guy, new ideas.</span>
      </footer>
    </>
  )
}
