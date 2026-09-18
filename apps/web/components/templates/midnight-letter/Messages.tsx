import type { PageMessage } from '@/lib/types'
import RevealOnScroll from './RevealOnScroll'

type MessagesProps = {
  messages: PageMessage[]
}

export default function Messages({ messages }: MessagesProps) {
  if (messages.length === 0) return null

  return (
    <section aria-labelledby="mensajes-titulo" className="story-beat py-12 md:py-24">
      <div className="container-page">
        <RevealOnScroll>
          <p className="eyebrow mb-3">En mis palabras</p>
          <h2
            id="mensajes-titulo"
            className="font-display text-[clamp(1.75rem,6vw,3rem)] tracking-[-0.02em] text-[var(--color-paper)]"
          >
            Lo que quiero decirte
          </h2>
        </RevealOnScroll>

        <ol className="mt-8 md:mt-16">
          {messages.map((message, index) => (
            <li
              key={message.id}
              className="border-t border-[var(--color-border)] py-6 first:border-t-0 first:pt-0 md:py-10"
            >
              <RevealOnScroll>
                <article className="mx-auto grid max-w-3xl grid-cols-[auto_1fr] gap-x-5 gap-y-3">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] uppercase leading-6 tracking-[0.32em] text-[var(--color-accent)]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="font-display text-[clamp(1.6rem,5.5vw,2.6rem)] leading-[1.22] tracking-[-0.02em] text-[var(--color-paper)]">
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
