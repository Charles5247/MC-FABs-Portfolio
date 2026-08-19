/** Simple success/error banner shown after save/delete actions. */
export default function StatusBanner({ status }) {
  if (!status) return null
  const isError = status.type === 'error'
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`mb-4 rounded-sm border p-3 text-sm ${
        isError
          ? 'border-marquee-pink/50 bg-marquee-pink/10 text-marquee-pink'
          : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700'
      }`}
    >
      {status.message}
    </div>
  )
}
