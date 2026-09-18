'use client'

import { Faq, FinalCta, Footer, Includes, Pricing } from './Details'
import { Hero, Moment, Nav, StatsBand, Templates } from './Showcase'

type LandingProps = {
  brand: string
  checkoutUrl: string
  price: string
  currency: string
}

export default function Landing({
  brand,
  checkoutUrl,
  price,
  currency,
}: LandingProps) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--color-accent)] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#0B0B0C]"
      >
        Saltar al contenido
      </a>

      <Nav brand={brand} checkoutUrl={checkoutUrl} />

      <main id="contenido">
        <Hero checkoutUrl={checkoutUrl} />
        <StatsBand />
        <Moment />
        <Templates />
        <Includes />
        <Pricing price={price} currency={currency} checkoutUrl={checkoutUrl} />
        <Faq />
        <FinalCta checkoutUrl={checkoutUrl} />
      </main>

      <Footer brand={brand} />
    </>
  )
}
