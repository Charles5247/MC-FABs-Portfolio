/**
 * Format an ISO date/timestamp string for display. Returns null for
 * null/undefined input so callers can conditionally render a fallback.
 */
export function formatDate(value, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', options)
}
