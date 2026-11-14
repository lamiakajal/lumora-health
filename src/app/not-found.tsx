import { NotFoundPulse } from "@/components/not-found/not-found-pulse";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "../../site.config";
import { toTelHref } from "@/lib/format";
import Link from "next/link";

const helpfulLinks = [
  { label: "Find a doctor", text: "Browse our physicians and specialists", href: "/doctors" },
  { label: "Our services", text: "See every kind of care we offer", href: "/services" },
  { label: "Patient portal", text: "Visits, results and receipts", href: "/portal" },
  { label: "Contact us", text: "We are happy to point you the right way", href: "/contact" },
];

export default function NotFound() {
  return (
    <main id="main" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 -z-10 size-96 animate-float rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-48 -z-10 size-[26rem] animate-float rounded-full bg-accent/15 blur-3xl [animation-delay:-3s]"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center sm:py-24">
        <NotFoundPulse />

        <Reveal delay={0.1}>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            We can&rsquo;t find that page
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The page may have moved, or the link may have a typo. The good news: your care
            team is still here. Try one of these instead.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg" arrow>
            Back to home
          </ButtonLink>
          <ButtonLink href="/book" size="lg" variant="outline">
            Book an appointment
          </ButtonLink>
        </Reveal>

        <ul className="mt-14 grid w-full gap-4 text-left sm:grid-cols-2">
          {helpfulLinks.map((link, index) => (
            <li key={link.href}>
              <Reveal delay={0.1 + index * 0.08} className="h-full">
                <Link
                  href={link.href}
                  className="group block h-full rounded-card border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lift"
                >
                  <span className="font-display text-lg font-bold group-hover:text-primary">
                    {link.label}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{link.text}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-muted-foreground">
          Need help right now? Call our 24/7 nurse line at{" "}
          <a
            href={toTelHref(siteConfig.contact.emergencyPhone)}
            className="font-semibold text-foreground hover:text-primary"
          >
            {siteConfig.contact.emergencyPhone}
          </a>
          . In an emergency, call 911.
        </p>
      </div>
    </main>
  );
}
