import type { PageMessage } from '@/lib/types'
import Reveal from './Reveal'

type NeonMessagesProps = {
  messages: PageMessage[]
}

export default function NeonMessages({ messages }: NeonMessagesProps) {
  if (messages.length === 0) return null

  return (
    <section
      aria-labelledby="mensajes-titulo"
      className="story-beat relative px-[clamp(1.25rem,5vw,3rem)] py-14 md:py-24"
    >
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-3">En mis palabras</p>
          <h2
            id="mensajes-titulo"
            className="font-display text-[clamp(1.8rem,7vw,3.25rem)] tracking-[-0.03em] text-[var(--color-paper)]"
          >
            Lo que quiero decirte
          </h2>
        </Reveal>

        <ol className="mt-9 space-y-5 md:mt-14 md:space-y-7">
          {messages.map((message, index) => (
            <li key={message.id}>
              <Reveal delay={index * 0.05}>
                <article className="neon-card relative grid max-w-3xl grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-[var(--radius-lg)] p-5 md:p-7">
                  <span
                    aria-hidden="true"
                    className="neon-text-gradient neon-animate-gradient font-display text-2xl leading-none md:text-3xl"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="font-display text-[clamp(1.35rem,5.2vw,2.1rem)] leading-[1.25] tracking-[-0.02em] text-[var(--color-paper)]">
                    {message.body}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
