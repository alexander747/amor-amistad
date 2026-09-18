'use client'

import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import CheckoutCta from '@/components/CheckoutCta'
import LetterHero from '@/components/templates/midnight-letter/LetterHero'
import PhonePreview from './PhonePreview'
import { CountUp, EASE_OUT, OutlineNumber, Reveal, SectionLabel } from './primitives'

const DEMO_NAMES = 'Mariana & Julián'
const DEMO_DATE = '14 de marzo de 2021'
const DEMO_DAYS = 2013

const PARENT = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } } }
const FADE = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_OUT } },
}
const LINE = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.95, ease: EASE_OUT } },
}

const STATS = [
  { value: 24, unit: 'h', label: 'Entrega máxima' },
  { value: 10, unit: '', label: 'Fotos incluidas' },
  { value: 12, unit: 'meses', label: 'De vigencia' },
  { value: 1, unit: '', label: 'Pago, sin cuotas' },
]

const BEATS = [
  {
    number: '01',
    kicker: 'El primer segundo',
    title: 'Abre el link',
    body: 'Llega por WhatsApp con una tarjeta que ya muestra sus nombres y sus días juntos. Un toque y entra: sin apps, sin registros, sin esperas.',
  },
  {
    number: '02',
    kicker: 'La pausa',
    title: 'Raspa la pantalla',
    body: 'Una portada dorada cubre la sorpresa. Deslizá el dedo y se descubre en vivo, como una tarjeta de rasca que nunca se gastó.',
  },
  {
    number: '03',
    kicker: 'El resto',
    title: 'Se revela',
    body: 'Nombres, días, fotos, mensajes y su canción. Una historia completa que se recorre deslizando, hecha para mirar dos veces.',
  },
]

type TemplateInfo = {
  slug: string
  name: string
  concept: string
  status: 'Disponible' | 'Próximamente'
  fonts: string
  palette?: string[]
}

const TEMPLATES: TemplateInfo[] = [
  {
    slug: 'midnight-letter',
    name: 'Midnight Letter',
    concept: 'Editorial cinematográfico',
    status: 'Disponible' as const,
    fonts: 'Fraunces · Instrument Sans',
  },
  {
    slug: 'soft-luxe-paper',
    name: 'Paper Luxe',
    concept: 'Lujo minimal en papel',
    status: 'Próximamente' as const,
    fonts: 'Cormorant Garamond · Jost',
    palette: ['#FAF7F0', '#1A1A1A', '#C8B7A6', '#A6785A'],
  },
  {
    slug: 'neon-corazon',
    name: 'Neon Corazón',
    concept: 'Wrapped vibrante',
    status: 'Próximamente' as const,
    fonts: 'Sora · Outfit',
    palette: ['#120B1A', '#FF0099', '#7F00FF', '#00E5FF'],
  },
]

export function Nav({ brand, checkoutUrl }: { brand: string; checkoutUrl: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_76%,transparent)] backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-[var(--color-paper)] transition-colors hover:text-[var(--color-accent)]"
        >
          {brand}
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/s/demo-latido"
            className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)] sm:inline"
          >
            Ver una demo
          </Link>
          <CheckoutCta
            href={checkoutUrl}
            className="btn btn-brass btn-shimmer !min-h-0 !px-5 !py-2.5 text-sm shadow-[0_0_0_0_rgba(200,162,75,0)] transition-shadow hover:shadow-[0_0_34px_-6px_rgba(200,162,75,0.7)]"
          >
            Crear mi sorpresa
          </CheckoutCta>
        </div>
      </div>
    </header>
  )
}

export function Hero({ checkoutUrl }: { checkoutUrl: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 130])
  const deviceRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -4])

  return (
    <section
      ref={ref}
      className="grain relative isolate overflow-hidden px-[clamp(1.25rem,5vw,3rem)] pb-24 pt-32 md:pb-32 md:pt-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(200,162,75,0.22),transparent_62%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[22%] hidden w-px bg-[var(--color-border)] opacity-40 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[16%] hidden w-px bg-[var(--color-border)] opacity-25 lg:block"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-12 lg:gap-8">
        <motion.div
          className="lg:col-span-7"
          variants={PARENT}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <motion.p variants={FADE} className="mb-7">
            <SectionLabel>Páginas sorpresa · Link + QR</SectionLabel>
          </motion.p>

          <h1 className="display-hero font-display text-[var(--color-paper)]">
            <span className="-mb-[0.14em] -mt-[0.08em] block overflow-hidden pb-[0.14em] pt-[0.08em]">
              <motion.span variants={LINE} className="block">
                Sorpresas
              </motion.span>
            </span>
            <span className="-mb-[0.14em] -mt-[0.06em] block overflow-hidden pb-[0.14em] pt-[0.08em]">
              <motion.span
                variants={LINE}
                className="block text-[var(--color-accent)]"
              >
                que se sienten.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={FADE}
            className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-text-muted)]"
          >
            Convertí fotos, mensajes y una canción en una página privada que se
            revela raspando la pantalla. Se entrega en un link y en un QR para
            imprimir.
          </motion.p>

          <motion.div
            variants={FADE}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <CheckoutCta
              href={checkoutUrl}
              className="btn btn-brass btn-shimmer w-full shadow-[0_0_0_0_rgba(200,162,75,0)] transition-shadow hover:shadow-[0_0_44px_-8px_rgba(200,162,75,0.75)] sm:w-auto"
            >
              Crear mi sorpresa
            </CheckoutCta>
            <Link href="/s/demo-latido" className="btn btn-outline w-full sm:w-auto">
              Ver una demo
            </Link>
          </motion.div>

          <motion.p
            variants={FADE}
            className="mt-7 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]"
          >
            Pago único · Listo en 24 h · Compartir es opcional
          </motion.p>
        </motion.div>

        <motion.div
          className="lg:col-span-5 lg:-mr-[6%]"
          style={{ y: deviceY, rotate: deviceRotate }}
        >
          <PhonePreview />
        </motion.div>
      </div>
    </section>
  )
}

export function StatsBand() {
  return (
    <section
      aria-label="Datos del producto"
      className="border-y border-[var(--color-border)]"
    >
      <dl className="container-page grid grid-cols-2 gap-px bg-[var(--color-border)] md:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 bg-[var(--color-bg)] px-5 py-8 md:px-8 md:py-10"
          >
            <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-muted)]">
              {stat.label}
            </dt>
            <dd className="order-1 flex items-baseline gap-2 font-display text-[clamp(2.2rem,6vw,3.4rem)] leading-none text-[var(--color-paper)]">
              <CountUp value={stat.value} />
              {stat.unit && (
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  {stat.unit}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function Moment() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 70%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      ref={ref}
      id="el-momento"
      aria-labelledby="momento-titulo"
      className="relative px-[clamp(1.25rem,5vw,3rem)] py-24 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionLabel>El momento</SectionLabel>
            <h2
              id="momento-titulo"
              className="mt-6 font-display text-[clamp(2.2rem,6.5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-paper)]"
            >
              Tres tiempos que nadie se salta.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-[var(--color-text-muted)]">
              No es un scroll más. Es una secuencia: llega, raspa, se revela. La
              misma coreografía en cualquier celular.
            </p>
          </div>
        </div>

        <div className="relative lg:col-span-8">
          <div
            aria-hidden="true"
            className="absolute left-0 top-2 hidden h-full w-px bg-[var(--color-border)] opacity-50 md:block"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: lineScale }}
            className="absolute left-0 top-2 hidden h-full w-px origin-top bg-[var(--color-accent)] md:block"
          />

          <ol className="space-y-20 md:space-y-32 md:pl-12">
            {BEATS.map((beat, index) => (
              <li key={beat.number}>
                <Reveal delay={index * 0.05}>
                  <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start md:gap-10">
                    <OutlineNumber
                      value={beat.number}
                      className="text-[clamp(4.5rem,14vw,9rem)]"
                    />
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-accent)]">
                        {beat.kicker}
                      </span>
                      <h3 className="mt-4 font-display text-[clamp(1.9rem,5vw,3rem)] leading-tight tracking-[-0.02em] text-[var(--color-paper)]">
                        {beat.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-text-muted)]">
                        {beat.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export function Templates() {
  return (
    <section
      id="plantillas"
      aria-labelledby="plantillas-titulo"
      className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-24 md:py-36"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <SectionLabel>Plantillas</SectionLabel>
          <h2
            id="plantillas-titulo"
            className="mt-6 font-display text-[clamp(2.2rem,6.5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-paper)]"
          >
            Una dirección para cada historia.
          </h2>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Live template — real component, no fake screenshot. */}
          <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="relative flex-1 overflow-hidden bg-[var(--color-bg)] px-6 pb-14 pt-10">
              <div
                aria-hidden="true"
                className="preview-screen mx-auto w-full max-w-[270px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]"
              >
                <div className="flex h-[300px] flex-col justify-center">
                  <LetterHero
                    names={DEMO_NAMES}
                    dateLabel={DEMO_DATE}
                    days={DEMO_DAYS}
                    countDays={DEMO_DAYS}
                    className="h-auto min-h-0"
                    showScrollHint={false}
                  />
                </div>
              </div>
              <span className="absolute left-6 top-6 rounded-full border border-[var(--color-accent)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
                Disponible
              </span>
            </div>
            <div className="border-t border-[var(--color-border)] px-6 py-6">
              <h3 className="font-display text-2xl text-[var(--color-paper)]">
                Midnight Letter
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Editorial cinematográfico, oscuro y con brass.
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Fraunces · Instrument Sans
              </p>
            </div>
          </article>

          {TEMPLATES.slice(1).map((template) => (
            <article
              key={template.slug}
              className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <div className="relative flex flex-1 flex-col justify-between gap-8 px-6 py-10">
                <span className="self-start rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  Próximamente
                </span>
                <div>
                  <div aria-hidden="true" className="flex gap-2">
                    {template.palette?.map((color) => (
                      <span
                        key={color}
                        className="h-10 flex-1 rounded-[var(--radius-sm)] border border-[var(--color-border)]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    {template.fonts}
                  </p>
                </div>
              </div>
              <div className="border-t border-[var(--color-border)] px-6 py-6">
                <h3 className="font-display text-2xl text-[var(--color-paper)]">
                  {template.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {template.concept}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
          Las plantillas nuevas se activan sin costo adicional.
        </p>
      </div>
    </section>
  )
}
