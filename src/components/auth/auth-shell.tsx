import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/logo";
import { CheckIcon } from "@/components/ui/icons-medical";
import { Reveal } from "@/components/ui/reveal";

const perks = [
  "Book and manage visits in minutes",
  "See your results and receipts",
  "Message your care team securely",
];

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

/** Two-column layout for the sign in and register pages. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="mx-auto grid max-w-6xl items-stretch gap-0 px-5 py-12 lg:grid-cols-2 lg:py-20">
      <Reveal className="rounded-card border bg-card p-8 shadow-soft sm:p-10 lg:rounded-r-none">
        <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
      </Reveal>

      <div className="relative hidden overflow-hidden rounded-r-card bg-gradient-to-br from-[#0d9488] via-[#0b7a82] to-[#0b4f6c] p-10 text-white lg:block">
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 animate-float rounded-full bg-white/10" />
        <div aria-hidden="true" className="absolute -bottom-20 -left-10 size-72 animate-float rounded-full bg-white/10 [animation-delay:-3s]" />
        <div className="relative flex h-full flex-col justify-between">
          <LogoMark loop className="size-16 drop-shadow-xl" />
          <div>
            <p className="font-display text-3xl font-bold leading-tight">Your care, all in one place.</p>
            <ul className="mt-6 space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 font-semibold">
                  <span className="grid size-7 place-items-center rounded-full bg-white text-[#0b4f6c]">
                    <CheckIcon className="size-4" strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
