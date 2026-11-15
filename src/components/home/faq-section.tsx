import { FaqAccordion } from "@/components/home/faq-accordion";
import { ButtonLink } from "@/components/ui/button";
import { HeadsetIcon } from "@/components/ui/icons-medical";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqCopy, featuredFaqs } from "@/data/faqs";
import { toTelHref } from "@/lib/format";
import { siteConfig } from "../../../site.config";

export function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="mx-auto mt-24 grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr]"
    >
      <Reveal>
        <SectionHeading
          id="faq-title"
          eyebrow={faqCopy.eyebrow}
          title={faqCopy.title}
          description={faqCopy.description}
          align="left"
        />

        <div className="mt-8 rounded-card border bg-soft p-6">
          <span className="grid size-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
            <HeadsetIcon className="size-6" />
          </span>
          <p className="mt-4 font-display text-lg font-bold">Still have a question?</p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Our nurses answer the phone 24 hours a day, 7 days a week.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={toTelHref(siteConfig.contact.emergencyPhone)}
              className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              Call {siteConfig.contact.emergencyPhone}
            </a>
            <ButtonLink href="/faq" variant="outline" arrow>
              All FAQs
            </ButtonLink>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <FaqAccordion items={featuredFaqs} />
      </Reveal>
    </section>
  );
}
