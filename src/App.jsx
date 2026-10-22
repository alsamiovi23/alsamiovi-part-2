import { useEffect, useRef, useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'
import { Home, About, Archive, Notes, Reviews, Log } from './pages'

const links = [['/', 'Home'], ['/about', 'About'], ['/archive', 'Archive'], ['/notes', 'Notes'], ['/reviews', 'Reviews'], ['/log', 'Daily log']]

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

export default function App() {
  const loc = useLocation()
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [hide, setHide] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

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

  useEffect(() => { window.__lenis?.scrollTo(0, { immediate: true }) }, [loc.pathname])

  return (
    <>
      <Cursor />
      <motion.div className="bar" style={{ scaleX: bar }} />
      <header className={'nav' + (hide ? ' hide' : '')}>
        <Link to="/" className="brand"><Logo /><span>AL-SAMI OVI</span></Link>
        <nav>
          {links.map(([to, n]) => <NavLink key={to} to={to} end={to === '/'}>{n}</NavLink>)}
          <button aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☾' : '☀'}</button>
        </nav>
      </header>
      <AnimatePresence mode="wait">
        <motion.main key={loc.pathname} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
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
        <span>&lt;/&gt; Built with React + Vite &nbsp;|&nbsp; alsamiovi.vercel.app</span>
        <span className="sig">Same guy, new ideas.</span>
      </footer>
    </>
  )
}
