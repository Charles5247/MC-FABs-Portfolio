/**
 * Repeatable role/expertise block. Renders a title, description paragraph,
 * and an optional client list (only rendered when non-empty).
 */
export default function RoleBlock({ title, description, clients = [] }) {
  return (
    <div className="border-t border-dashed border-spark-gold/50 py-8 first:border-t-0">
      <h3 className="font-display text-2xl text-paper">{title}</h3>
      <p className="mt-3 max-w-2xl text-blush">{description}</p>
      {clients.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-3" aria-label={`${title} clients`}>
          {clients.map((c) => (
            <li key={c} className="eyebrow rounded-sm border border-paper/20 px-3 py-1 text-paper/70">
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
