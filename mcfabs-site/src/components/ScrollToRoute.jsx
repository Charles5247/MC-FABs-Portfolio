import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
export default function ScrollToRoute() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        let id
        try { id = decodeURIComponent(hash.slice(1)) } catch { return }
        document.getElementById(id)?.scrollIntoView()
      } else window.scrollTo({ top: 0, behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}