import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { error: signInError } = await signIn(email, password)
      if (signInError) setError('Unable to sign in. Check your email and password and try again.')
    } catch {
      setError('Unable to connect. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-center text-spark-gold">Faith Abah — Admin</p>
        <h1 className="mt-2 text-center font-display text-3xl text-paper">MC FABS Dashboard</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="eyebrow block text-blush">
              Email
            </label>
            <input
              id="email"
              type="email" autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-sm border border-paper/20 bg-transparent px-4 py-3 text-paper"
            />
          </div>
          <div>
            <label htmlFor="password" className="eyebrow block text-blush">
              Password
            </label>
            <input
              id="password"
              type="password" autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-sm border border-paper/20 bg-transparent px-4 py-3 text-paper"
            />
          </div>

          {error && (
            <p role="alert" className="text-marquee-pink">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-sm bg-marquee-pink px-6 py-3 font-semibold text-paper disabled:opacity-60"
          >
            {busy ? 'Signing in\u2026' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-paper/40">
          Private workspace for the MC FABS team.
        </p>
      </div>
    </div>
  )
}
