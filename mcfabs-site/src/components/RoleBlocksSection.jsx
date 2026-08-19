import RoleBlock from './RoleBlock'
import { ROLE_BLOCKS } from '../lib/constants'

export default function RoleBlocksSection() {
  return (
    <section className="bg-plum py-16 sm:py-24" aria-labelledby="roles-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <p className="eyebrow text-spark-gold">What Faith Does</p>
        <h2 id="roles-heading" className="mt-3 font-display text-3xl text-paper sm:text-4xl">
          Every Room, One Voice
        </h2>
        <div className="mt-8">
          {ROLE_BLOCKS.map((role) => (
            <RoleBlock key={role.title} {...role} />
          ))}
        </div>
      </div>
    </section>
  )
}
