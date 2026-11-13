import { Logo } from "@/components/brand/logo";
import { ToastDemo } from "@/components/dev/toast-demo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "../../site.config";

const placeholders = [
  {
    title: "Same-week appointments",
    text: "Primary care and specialist visits, booked online in under two minutes.",
  },
  {
    title: "Telehealth visits",
    text: "Meet your doctor by secure video from home, wherever you live in the US or Canada.",
  },
  {
    title: "Transparent pricing",
    text: "See what a visit costs before you book, with or without insurance.",
  },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="py-24 sm:py-32">
          <p className="mb-4 inline-flex rounded-full bg-soft px-4 py-1.5 text-sm font-semibold text-primary-deep">
            Design system preview
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-10">
            <ToastDemo />
          </div>
        </section>

        {placeholders.map((item) => (
          <section key={item.title} className="py-28">
            <div className="rounded-card border bg-card p-10 shadow-soft">
              <h2 className="font-display text-2xl font-bold">{item.title}</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">{item.text}</p>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
