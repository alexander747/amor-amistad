'use client'

import Link from 'next/link'
import CheckoutCta from '@/components/CheckoutCta'
import { OutlineNumber, Reveal, SectionLabel } from './primitives'

const INCLUDES = [
  {
    number: '01',
    title: 'Página privada',
    body: 'Link único, fuera de buscadores. Solo quien lo recibe puede abrirla.',
  },
  {
    number: '02',
    title: 'Hasta 10 fotos',
    body: 'En una galería editorial que se ve bien en el celular y en la pantalla grande.',
  },
  {
    number: '03',
    title: 'Mensajes con tus palabras',
    body: 'Escritos por vos, o sugeridos con IA y editados antes de publicar (fase 2).',
  },
  {
    number: '04',
    title: 'Su canción',
    body: 'Embed de YouTube. Nunca alojamos audio ni video propios.',
  },
  {
    number: '05',
    title: 'QR imprimible',
    body: 'Con alta tolerancia para pegarlo en una tarjeta física o en el regalo.',
  },
  {
    number: '06',
    title: 'Tarjeta 1080×1920',
    body: 'Lista para sus historias y descargable en un toque. Compartir es opcional.',
  },
]

const PRICE_ITEMS = [
  'Página personalizada con la plantilla Midnight Letter',
  'Hasta 10 fotos, mensajes y una canción',
  'Open Graph a medida para WhatsApp',
  'Tarjeta vertical 1080×1920 descargable',
  'QR imprimible con alta tolerancia',
  'Vigencia de 12 meses',
]

const FAQ = [
  {
    q: '¿Qué necesita la otra persona para verlo?',
    a: 'Solo abrir el link o escanear el QR. No tiene que descargar nada ni crear una cuenta.',
  },
  {
    q: '¿Puedo usar mis propias fotos y una canción?',
    a: 'Sí. Subís tus fotos y pegás el link de YouTube de la canción que quieras. La música se reproduce dentro de YouTube.',
  },
  {
    q: '¿La página es privada?',
    a: 'Sí. Cada página tiene un enlace único que no aparece en buscadores. Vos decidís con quién lo compartís.',
  },
  {
    q: '¿En cuánto tiempo la recibo?',
    a: 'Recibís tu página y el QR por correo en un plazo de 24 horas después de enviar tus datos.',
  },
  {
    q: '¿Puedo pedir cambios?',
    a: 'Sí. Tenés una ronda de ajustes sobre el contenido que enviaste: textos, fotos o fecha. Escribinos y lo corregimos.',
  },
]

type PricingProps = {
  price: string
  currency: string
  checkoutUrl: string
}

// Precio ancla dentro del rango sugerido en PLAN §13. El valor final sigue
// pendiente del bloqueante de comisiones de Mercado Pago (ver page.tsx).
const PRICE_ANCHOR = '$39.900'

export function Includes() {
  return (
    <section
      id="lo-que-incluye"
      aria-labelledby="incluye-titulo"
      className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-24 md:py-36"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <SectionLabel>Lo que incluye</SectionLabel>
          <h2
            id="incluye-titulo"
            className="mt-6 font-display text-[clamp(2.2rem,6.5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-paper)]"
          >
            Cada detalle, contado sin adornos.
          </h2>
        </div>

        <ul className="mt-16 border-t border-[var(--color-border)]">
          {INCLUDES.map((item, index) => (
            <li key={item.number}>
              <Reveal delay={index * 0.04}>
                <div className="numeral-row group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-b border-[var(--color-border)] py-8 md:grid-cols-[7rem_18rem_1fr] md:gap-x-10 md:py-10">
                  <span className="numeral font-display text-[clamp(2.6rem,8vw,4.5rem)] leading-none">
                    {item.number}
                  </span>
                  <h3 className="font-display text-[clamp(1.4rem,4vw,2rem)] text-[var(--color-paper)]">
                    {item.title}
                  </h3>
                  <p className="col-span-2 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-1">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Pricing({ price, currency, checkoutUrl }: PricingProps) {
  return (
    <section
      id="precio"
      aria-labelledby="precio-titulo"
      className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-24 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel>Pago único</SectionLabel>
          <h2
            id="precio-titulo"
            className="mt-6 font-display text-[clamp(2.2rem,6.5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-paper)]"
          >
            Una sorpresa completa, sin suscripciones.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
            Pagás una vez y la página queda viva 12 meses. El QR y el link son
            tuyos desde el primer día.
          </p>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
            Pago seguro con Mercado Pago · COP
          </p>
        </div>

        <div className="lg:col-span-7">
          <article className="grain relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-paper)] text-[#0B0B0C] shadow-[0_50px_130px_-50px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between px-7 pt-7 md:px-10 md:pt-9">
              <span className="font-mono text-[11px] uppercase tracking-[0.26em]">
                Latido · Comprobante
              </span>
              <span className="hidden font-mono text-[11px] uppercase tracking-[0.26em] opacity-60 sm:inline">
                N.º 0001
              </span>
            </div>

            <div className="relative my-7 h-px md:my-9">
              <div className="perforation h-px w-full opacity-50" />
              <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--color-bg)]" />
              <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--color-bg)]" />
            </div>

            <div className="px-7 md:px-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] opacity-70">
                Incluye
              </p>
              <ul className="mt-5 space-y-3">
                {PRICE_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 text-sm leading-snug"
                  >
                    <span aria-hidden="true" className="font-mono opacity-50">
                      —
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-9 px-7 md:px-10">
              <div className="flex items-end justify-between gap-4 border-t border-dashed border-black/25 pt-7">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.26em] opacity-70">
                    Total
                  </p>
                  <p className="mt-2 font-mono text-sm opacity-45 line-through">
                    {PRICE_ANCHOR}
                  </p>
                </div>
                <p className="flex items-end gap-2">
                  <span className="font-display text-[clamp(2.2rem,8vw,4rem)] leading-none">
                    {price}
                  </span>
                  <span className="pb-2 font-mono text-xs uppercase tracking-[0.22em] opacity-70">
                    {currency}
                  </span>
                </p>
              </div>
            </div>

            <div className="px-7 pb-9 pt-8 md:px-10">
              <CheckoutCta
                href={checkoutUrl}
                className="btn btn-brass btn-shimmer w-full shadow-[0_0_0_0_rgba(200,162,75,0)] transition-shadow hover:shadow-[0_0_46px_-8px_rgba(200,162,75,0.85)]"
              >
                Crear mi sorpresa
              </CheckoutCta>
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] opacity-60">
                Confirmación inmediata · Entrega en 24 h
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  return (
    <section
      id="preguntas"
      aria-labelledby="faq-titulo"
      className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-24 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel>Preguntas</SectionLabel>
          <h2
            id="faq-titulo"
            className="mt-6 font-display text-[clamp(2.2rem,6.5vw,4rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-paper)]"
          >
            Antes de empezar.
          </h2>
        </div>

        <div className="lg:col-span-8">
          <div className="border-t border-[var(--color-border)]">
            {FAQ.map((item, index) => (
              <details
                key={item.q}
                className="group border-b border-[var(--color-border)]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 marker:content-none md:py-7">
                  <span className="flex items-baseline gap-4 md:gap-6">
                    <span className="font-mono text-[11px] tracking-[0.24em] text-[var(--color-accent)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[clamp(1.2rem,3.2vw,1.7rem)] leading-snug text-[var(--color-paper)]">
                      {item.q}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 font-mono text-xl leading-none text-[var(--color-accent)] transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pb-7 pl-8 text-base leading-relaxed text-[var(--color-text-muted)] md:pl-12">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function FinalCta({ checkoutUrl }: { checkoutUrl: string }) {
  return (
    <section className="grain relative isolate overflow-hidden border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-28 text-center md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,162,75,0.2),transparent_62%)] blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-3xl">
        <Reveal>
          <p className="eyebrow mb-6">Última llamada</p>
          <h2 className="font-display text-[clamp(2.6rem,10vw,6rem)] leading-[0.9] tracking-[-0.035em] text-[var(--color-paper)]">
            Alguien especial merece esto.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-7 max-w-md text-lg leading-relaxed text-[var(--color-text-muted)]">
            Creá su página hoy y entregá una sorpresa que se siente.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CheckoutCta
              href={checkoutUrl}
              className="btn btn-brass btn-shimmer w-full shadow-[0_0_0_0_rgba(200,162,75,0)] transition-shadow hover:shadow-[0_0_46px_-8px_rgba(200,162,75,0.8)] sm:w-auto"
            >
              Crear mi sorpresa
            </CheckoutCta>
            <Link href="/s/demo-latido" className="btn btn-outline w-full sm:w-auto">
              Ver una demo
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer({ brand }: { brand: string }) {
  return (
    <footer className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <span className="font-display text-2xl text-[var(--color-paper)]">
            {brand}
          </span>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">
            Las páginas son privadas y no se indexan en buscadores. Tratamos los
            datos personales conforme a la Ley 1581 de 2012.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Secciones">
          {[
            { href: '#el-momento', label: 'El momento' },
            { href: '#plantillas', label: 'Plantillas' },
            { href: '#lo-que-incluye', label: 'Lo que incluye' },
            { href: '#precio', label: 'Precio' },
            { href: '#preguntas', label: 'Preguntas' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-6xl flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-6 md:flex-row md:items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} {brand}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
          Hecho en Colombia
        </p>
      </div>
    </footer>
  )
}
