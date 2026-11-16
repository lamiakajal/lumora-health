"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { buttonStyles } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const { error } = await authClient.signOut();
    setPending(false);
    if (error) {
      toast.error("We could not sign you out", { description: "Please try again." });
      return;
    }
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className={buttonStyles({ variant: "outline", className: "disabled:opacity-70" })}
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
