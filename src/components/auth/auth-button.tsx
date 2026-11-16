"use client";

import { ButtonLink } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

/** Where the account button should point, based on whether someone is signed in. */
export function useAccountLink() {
  const { data } = authClient.useSession();
  return data
    ? { href: "/portal", label: "My account" }
    : { href: "/login", label: "Sign in" };
}

export function AuthButton({ className }: { className?: string }) {
  const { href, label } = useAccountLink();
  return (
    <ButtonLink href={href} variant="ghost" className={className}>
      {label}
    </ButtonLink>
  );
}
