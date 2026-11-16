"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthField } from "@/components/auth/auth-field";
import { buttonStyles } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { fieldErrors, registerSchema } from "@/lib/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      confirmPassword: String(data.get("confirmPassword") ?? ""),
    });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      return;
    }

    setErrors({});
    setPending(true);
    const { error } = await authClient.signUp.email({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setPending(false);

    if (error) {
      toast.error("We could not create your account", {
        description: error.message ?? "Please try again in a moment.",
      });
      return;
    }

    toast.success("Account created", { description: "You are signed in." });
    router.push("/portal");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <AuthField name="name" label="Full name" autoComplete="name" placeholder="Your full name" error={errors.name} />
      <AuthField name="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
      <AuthField name="password" label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={errors.password} />
      <AuthField name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" error={errors.confirmPassword} />
      <button type="submit" disabled={pending} className={buttonStyles({ size: "lg", className: "w-full disabled:opacity-70" })}>
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
