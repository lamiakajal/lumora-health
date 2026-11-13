import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MarqueeStrip } from "@/components/layout/marquee-strip";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XIcon,
} from "@/components/ui/icons";
import { toTelHref } from "@/lib/format";
import { footerNav } from "@/lib/navigation";
import { siteConfig } from "../../../site.config";

const socials = [
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "X", href: siteConfig.social.x, Icon: XIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedinIcon },
];

// Update once a year. (With Cache Components enabled, `new Date()` is not allowed while rendering.)
const COPYRIGHT_YEAR = 2026;

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[15px] text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { contact, hours } = siteConfig;

  return (
    <footer className="mt-24">
      <MarqueeStrip />

      <div className="border-t bg-soft text-muted-foreground">
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="/" aria-label={`${siteConfig.name} home`}>
                <Logo />
              </Link>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed">
                {siteConfig.description}
              </p>
              <ul className="mt-6 flex gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="grid size-10 place-items-center rounded-full border bg-card text-foreground/80 transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Icon className="size-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
              <LinkColumn title="Care" links={footerNav.care} />
              <LinkColumn title="Patients" links={footerNav.patients} />
              <LinkColumn title="Company" links={footerNav.company} />
            </div>
          </div>

          <div className="mt-14 grid gap-8 rounded-card border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-3">
              <MapPinIcon className="mt-0.5 size-5 shrink-0 text-primary" />
              <address className="text-sm not-italic leading-relaxed">
                {contact.address.street}
                <br />
                {contact.address.city}, {contact.address.region} {contact.address.postalCode}
              </address>
            </div>
            <div className="flex gap-3">
              <PhoneIcon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div className="text-sm leading-relaxed">
                <a href={toTelHref(contact.phone)} className="hover:text-primary">
                  {contact.phone}
                </a>
                <br />
                <span className="text-muted-foreground/80">Nurse line: </span>
                <a href={toTelHref(contact.emergencyPhone)} className="hover:text-primary">
                  {contact.emergencyPhone}
                </a>
              </div>
            </div>
            <div className="flex gap-3">
              <MailIcon className="mt-0.5 size-5 shrink-0 text-primary" />
              <a href={`mailto:${contact.email}`} className="text-sm hover:text-primary">
                {contact.email}
              </a>
            </div>
            <div className="flex gap-3">
              <ClockIcon className="mt-0.5 size-5 shrink-0 text-primary" />
              <ul className="space-y-1 text-sm">
                {hours.map((item) => (
                  <li key={item.days}>
                    <span className="font-semibold text-foreground">{item.days}:</span> {item.time}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 rounded-xl border bg-card px-4 py-3 text-[13px] leading-relaxed text-muted-foreground">
            If you are experiencing a medical emergency, call <strong className="text-foreground">911</strong>{" "}
            right away. Information on this website is for general purposes and is not a
            substitute for professional medical advice.
          </p>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t pt-6 text-[13px] md:flex-row md:items-center">
            <p>
              &copy; {COPYRIGHT_YEAR} {siteConfig.name}. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerNav.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p>
              Designed &amp; developed by{" "}
              <a
                href={siteConfig.developer.url}
                target="_blank"
                rel="author noopener"
                className="font-semibold text-foreground hover:text-primary"
              >
                {siteConfig.developer.name}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
