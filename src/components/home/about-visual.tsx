import Image from "next/image";
import type { ComponentType, SVGProps } from "react";
import { HeartPulseIcon, ShieldCheckIcon, VideoIcon } from "@/components/ui/icons-medical";
import { about } from "@/lib/home-sections";
import { findPublicImage } from "@/lib/public-images";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

function MiniCard({ icon: Icon, title, text }: { icon: IconType; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-card border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft text-primary">
        <Icon className="size-6" />
      </span>
      <div className="leading-snug">
        <p className="font-display text-[15px] font-bold">{title}</p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export function AboutVisual() {
  // Add public/images/team-smiling.webp (or .jpg/.png) and it is used automatically.
  const photo = findPublicImage("/images/team-smiling");

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-card border bg-gradient-to-br from-[#0d9488] to-[#0b5d6b] shadow-lift">
        {photo ? (
          <Image
            src={photo}
            alt="A smiling team of Lumora Health doctors and nurses"
            fill
            sizes="(min-width: 1024px) 600px, 92vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-white">
            <HeartPulseIcon className="size-24 opacity-90" />
          </div>
        )}
      </div>

      <div className="absolute right-3 top-3 animate-float rounded-2xl border bg-card/95 p-4 shadow-lift backdrop-blur sm:-right-4 sm:top-6">
        <p className="font-display text-3xl font-bold text-primary">{about.badge.value}</p>
        <p className="text-sm text-muted-foreground">{about.badge.label}</p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <MiniCard
          icon={ShieldCheckIcon}
          title="Safe and secure"
          text="Private by design, with encrypted records."
        />
        <MiniCard
          icon={VideoIcon}
          title="Care from anywhere"
          text="Secure video visits across the US and Canada."
        />
      </div>
    </div>
  );
}
