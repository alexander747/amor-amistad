import type { Metadata } from 'next'
import CheckoutCta from '@/components/CheckoutCta'
import MetaPixel from '@/components/MetaPixel'
import { getBrandName, getCheckoutUrl, getMetaPixelId } from '@/lib/env'

export const metadata: Metadata = {
  title: `${getBrandName()} — Sorpresas que se sienten`,
  description:
    'Creá una página sorpresa personalizada con fotos, mensajes y su canción. Se entrega en un link y un QR para imprimir. Sin apps, lista para compartir.',
  alternates: { canonical: '/' },
  openGraph: {
    title: `${getBrandName()} — Sorpresas que se sienten`,
    description:
      'Fotos, mensajes y su canción en una página secreta que se revela raspando. Link + QR imprimible.',
    type: 'website',
  },
}

// TODO(latido): PLAN §13/§24 — precio final BLOQUEANTE. Rango sugerido
// $19.900–$39.900 COP; se muestra un valor intermedio hasta confirmar comisión MP.
const PRICE_LABEL = '$29.900'
const CURRENCY_LABEL = 'COP'

const STEPS = [
  {
    number: '01',
    title: 'Contanos su historia',
    body: 'Completás un formulario corto con sus nombres, la fecha, fotos, mensajes y una canción de YouTube.',
  },
  {
    number: '02',
    title: 'Armamos la página',
    body: 'Diseñamos una página privada y cinematográfica, lista para abrir desde el celular. Se entrega en 24 horas.',
  },
  {
    number: '03',
    title: 'Entregá el link o el QR',
    body: 'Recibís el link y un QR imprimible. Esa persona raspa la pantalla y la sorpresa se revela.',
  },
]

const FEATURES = [
  {
    title: 'Vista previa que enamora',
    body: 'Al pegar el link en WhatsApp se ve una tarjeta con sus nombres y sus días juntos. Imposible no abrirlo.',
  },
  {
    title: 'Raspá para revelar',
    body: 'Una portada dorada que se descubre con el dedo. Un momento, no un scroll más.',
  },
  {
    title: 'Historia en 9:16',
    body: 'Al final puede descargar una tarjeta vertical lista para sus historias. Compartir es opcional, siempre.',
  },
  {
    title: 'QR para imprimir',
    body: 'Incluye un QR de alta resistencia para pegar en una tarjeta física o en el regalo.',
  },
  {
    title: 'Sin instalar nada',
    body: 'Abre en el navegador del celular. No hay app, no hay registro, no hay fricción.',
  },
  {
    title: 'Hecho en Colombia',
    body: 'Pagos en pesos con los medios de Mercado Pago y atención en español.',
  },
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
]

export default function LandingPage() {
  const pixelId = getMetaPixelId()
  const checkoutUrl = getCheckoutUrl()
  const brand = getBrandName()

  return (
    <>
      {pixelId && <MetaPixel pixelId={pixelId} />}

      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <span className="font-display text-xl tracking-tight text-[var(--color-paper)]">
            {brand}
          </span>
          <CheckoutCta href={checkoutUrl} className="btn btn-brass !min-h-0 !px-5 !py-2.5 text-sm">
            Crear la mía
          </CheckoutCta>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="grain relative overflow-hidden px-[clamp(1.25rem,5vw,3rem)] pb-20 pt-16 md:pb-28 md:pt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(200,162,75,0.20),transparent_65%)] blur-2xl"
          />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow mb-5">Páginas sorpresa para parejas</p>
              <h1 className="display-fluid font-display text-[var(--color-paper)]">
                Sorpresas que se sienten.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--color-text-muted)]">
                Convertí fotos, mensajes y su canción en una página secreta que
                se revela raspando la pantalla. Se entrega en un link y en un QR
                para imprimir.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CheckoutCta href={checkoutUrl} className="btn btn-brass w-full sm:w-auto">
                  Crear mi sorpresa
                </CheckoutCta>
                <a href="#como-funciona" className="btn btn-outline w-full sm:w-auto">
                  Ver cómo funciona
                </a>
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Pago seguro · Listo en 24 h · Compartir es opcional
              </p>
            </div>

            {/* CSS-only preview */}
            <div
              aria-hidden="true"
              className="relative mx-auto w-full max-w-[320px] select-none"
            >
              <div className="card grain relative overflow-hidden p-5">
                <div className="rounded-[var(--radius-md)] bg-gradient-to-br from-[#1F1B16] to-[#0B0B0C] p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent)]">
                    Para Mariana &amp; Julián
                  </p>
                  <p className="mt-4 font-display text-3xl leading-tight text-[var(--color-paper)]">
                    Feliz aniversario
                  </p>
                  <div className="mt-6 flex items-end gap-3 border-t border-[var(--color-border)] pt-5">
                    <span className="font-display text-5xl text-[var(--color-accent)]">
                      1.082
                    </span>
                    <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                      días
                      <br />
                      juntos
                    </span>
                  </div>
                  <div className="mt-6 h-10 w-full rounded-full bg-[linear-gradient(110deg,#C8A24B_0%,#8A6E2E_45%,#C8A24B_100%)] opacity-90" />
                  <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
                    Raspá acá
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section
          id="como-funciona"
          aria-labelledby="como-funciona-titulo"
          className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-20 md:py-28"
        >
          <div className="container-page">
            <p className="eyebrow mb-3">Cómo funciona</p>
            <h2
              id="como-funciona-titulo"
              className="max-w-2xl font-display text-[clamp(1.9rem,6vw,3.25rem)] text-[var(--color-paper)]"
            >
              Tres pasos y queda lista.
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.number} className="border-t border-[var(--color-border)] pt-6">
                  <span className="font-mono text-xs tracking-[0.3em] text-[var(--color-accent)]">
                    {step.number}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-[var(--color-paper)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--color-text-muted)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Beneficios */}
        <section
          aria-labelledby="beneficios-titulo"
          className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-20 md:py-28"
        >
          <div className="container-page">
            <p className="eyebrow mb-3">Lo que incluye</p>
            <h2
              id="beneficios-titulo"
              className="max-w-2xl font-display text-[clamp(1.9rem,6vw,3.25rem)] text-[var(--color-paper)]"
            >
              Cada detalle pensado.
            </h2>
            <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <article key={feature.title} className="bg-[var(--color-surface)] p-7">
                  <h3 className="font-display text-xl text-[var(--color-paper)]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Precio */}
        <section
          id="precio"
          aria-labelledby="precio-titulo"
          className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-20 md:py-28"
        >
          <div className="container-page">
            <div className="mx-auto max-w-xl">
              <div className="card grain relative overflow-hidden p-8 md:p-10">
                <p className="eyebrow mb-4">Pago único</p>
                <h2
                  id="precio-titulo"
                  className="font-display text-[clamp(1.75rem,6vw,2.75rem)] text-[var(--color-paper)]"
                >
                  Una sorpresa completa
                </h2>
                <p className="mt-6 flex items-end gap-2">
                  <span className="font-display text-5xl text-[var(--color-accent)]">
                    {PRICE_LABEL}
                  </span>
                  <span className="pb-2 font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    {CURRENCY_LABEL}
                  </span>
                </p>
                <ul className="mt-8 space-y-3 text-sm text-[var(--color-text-muted)]">
                  {[
                    'Página personalizada con plantilla Midnight Letter',
                    'Hasta 10 fotos, mensajes y una canción',
                    'Open Graph personalizado para WhatsApp',
                    'Tarjeta vertical 1080×1920 descargable',
                    'QR imprimible con alta tolerancia',
                    'Vigencia de 12 meses',
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="text-[var(--color-accent)]">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <CheckoutCta
                  href={checkoutUrl}
                  className="btn btn-brass mt-10 w-full"
                >
                  Crear mi sorpresa
                </CheckoutCta>
                <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  Pago seguro con Mercado Pago
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-titulo"
          className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-20 md:py-28"
        >
          <div className="container-page max-w-3xl">
            <p className="eyebrow mb-3">Preguntas frecuentes</p>
            <h2
              id="faq-titulo"
              className="font-display text-[clamp(1.9rem,6vw,3.25rem)] text-[var(--color-paper)]"
            >
              Antes de empezar
            </h2>
            <div className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {FAQ.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg text-[var(--color-paper)] marker:content-none">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="font-mono text-[var(--color-accent)] transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-24 text-center">
          <div className="container-page max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,7vw,3.5rem)] text-[var(--color-paper)]">
              Alguien especial merece esto.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--color-text-muted)]">
              Creá su página hoy y entregá una sorpresa que se siente.
            </p>
            <div className="mt-9 flex justify-center">
              <CheckoutCta href={checkoutUrl} className="btn btn-brass w-full sm:w-auto">
                Crear mi sorpresa
              </CheckoutCta>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] px-[clamp(1.25rem,5vw,3rem)] py-10">
        <div className="container-page flex flex-col items-center gap-4 text-center">
          <span className="font-display text-lg text-[var(--color-paper)]">{brand}</span>
          <p className="max-w-md text-xs leading-relaxed text-[var(--color-text-muted)]">
            Las páginas son privadas y no se indexan en buscadores. Tratamos los
            datos personales conforme a la Ley 1581 de 2012.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} {brand}
          </p>
        </div>
      </footer>
    </>
  )
}
