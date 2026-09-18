import type { PageMessage } from '@/lib/types'
import Reveal from './Reveal'

type PaperMessagesProps = {
  messages: PageMessage[]
}

/**
 * Beat 3. Large serif quotes with generous air. Each message reads like a line
 * set on fine stationery: a copper quote mark, the words, and a small label.
 */
export default function PaperMessages({ messages }: PaperMessagesProps) {
  if (messages.length === 0) return null

  return (
    <section
      aria-labelledby="mensajes-titulo"
      className="story-beat px-[clamp(1.25rem,5vw,3rem)] py-14 md:py-24"
    >
      <div className="container-page">
        <Reveal>
          <header className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-4">En mis palabras</p>
            <h2
              id="mensajes-titulo"
              className="font-display text-[clamp(1.9rem,6vw,3.1rem)] leading-[1.1] tracking-[-0.015em] text-[var(--color-paper)]"
            >
              Lo que quiero decirte
            </h2>
            <span
              aria-hidden="true"
              className="mx-auto mt-6 block h-px w-16 bg-[var(--color-accent)] opacity-60"
            />
          </header>
        </Reveal>

        <ol className="mx-auto mt-12 max-w-2xl space-y-12 md:mt-20 md:space-y-20">
          {messages.map((message, index) => (
            <li key={message.id}>
              <Reveal delayMs={index * 80}>
                <blockquote className="text-center">
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-6 block h-px w-8 bg-[var(--color-accent)] opacity-60"
                  />
                  <p className="font-display text-[clamp(1.6rem,5.8vw,2.7rem)] italic leading-[1.32] tracking-[-0.01em] text-[var(--color-paper)]">
                    {message.body}
                  </p>
                  <footer className="mt-5 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--pl-copper-ink)]">
                    Mensaje {String(index + 1).padStart(2, '0')}
                  </footer>
                </blockquote>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
