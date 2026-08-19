import { useEffect, useRef, useState } from 'react'

/**
 * Minimal data-fetching hook: runs `fn` on mount (and whenever `deps`
 * change), tracks loading/error/data state, and guards against setting
 * state after unmount. Kept intentionally dependency-free (no TanStack
 * Query) since this public site's data needs are simple read-only fetches.
 *
 * @param {() => Promise<any>} fn
 * @param {Array<any>} deps
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    setState((s) => ({ ...s, loading: true, error: null }))

    fn()
      .then((data) => {
        if (isMounted.current) setState({ data, error: null, loading: false })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('[mcfabs-site] data fetch failed:', error)
        if (isMounted.current) setState({ data: null, error, loading: false })
      })

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
