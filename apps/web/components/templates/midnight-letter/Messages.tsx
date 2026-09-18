import type { PageMessage } from '@/lib/types'
import RevealOnScroll from './RevealOnScroll'

type MessagesProps = {
  messages: PageMessage[]
}

export default function Messages({ messages }: MessagesProps) {
  if (messages.length === 0) return null

  return (
    <section aria-labelledby="mensajes-titulo" className="py-16 md:py-24">
      <div className="container-page">
        <RevealOnScroll>
          <p className="eyebrow mb-3">En mis palabras</p>
          <h2
            id="mensajes-titulo"
            className="font-display text-[clamp(1.75rem,6vw,3rem)] text-[var(--color-paper)]"
          >
            Lo que quiero decirte
          </h2>
        </RevealOnScroll>

        <ol className="mt-12 space-y-16 md:space-y-24">
          {messages.map((message, index) => (
            <li key={message.id}>
              <RevealOnScroll>
                <article className="mx-auto max-w-3xl">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-4 font-display text-[clamp(1.4rem,5vw,2.4rem)] leading-[1.25] text-[var(--color-paper)]">
                    {message.body}
                  </p>
                </article>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
