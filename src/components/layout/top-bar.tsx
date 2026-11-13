import { ClockIcon, MailIcon, MapPinIcon } from "@/components/ui/icons";
import { toTelHref } from "@/lib/format";
import Link from "next/link";
import { siteConfig } from "../../../site.config";

export function TopBar() {
  const { contact, hours } = siteConfig;

  return (
    <div className="hidden border-b border-white/10 bg-[#082029] text-[13px] text-white/80 md:block">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-5">
        <div className="flex items-center gap-6">
          <a
            href={toTelHref(contact.emergencyPhone)}
            className="inline-flex items-center gap-2 font-semibold text-white hover:text-primary"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-red-500" />
            </span>
            24/7 nurse line: {contact.emergencyPhone}
          </a>
          <span className="hidden items-center gap-2 lg:inline-flex">
            <ClockIcon className="size-4" />
            {hours[0].days}: {hours[0].time}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={`mailto:${contact.email}`}
            className="hidden items-center gap-2 hover:text-white lg:inline-flex"
          >
            <MailIcon className="size-4" />
            {contact.email}
          </a>
          <Link href="/locations" className="inline-flex items-center gap-2 hover:text-white">
            <MapPinIcon className="size-4" />
            Find a location
          </Link>
        </div>
      </div>
    </div>
  );
}
