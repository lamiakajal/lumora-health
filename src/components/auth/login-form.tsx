"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthField } from "@/components/auth/auth-field";
import { buttonStyles } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { fieldErrors, loginSchema } from "@/lib/validation/auth";

export function LoginForm() {
  const router = useRouter();
  const next = safeRedirectPath(useSearchParams().get("next"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }

    setErrors({});
    setPending(true);
    const { error } = await authClient.signIn.email({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setPending(false);

    if (error) {
      toast.error("We could not sign you in", {
        description: error.message ?? "Check your email and password and try again.",
      });
      return;
    }

    toast.success("Welcome back");
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <AuthField name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
      <AuthField name="password" label="Password" type="password" autoComplete="current-password" error={errors.password} />
      <button type="submit" disabled={pending} className={buttonStyles({ size: "lg", className: "w-full disabled:opacity-70" })}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
