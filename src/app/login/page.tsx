import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main id="main">
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to manage your appointments."
        footer={
          <>
            New to Lumora Health?{" "}
            <Link href="/register" className="font-bold text-primary-deep hover:underline">
              Create an account
            </Link>
          </>
        }
      >
        {/* The form reads ?next= from the URL, so it sits behind Suspense. */}
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" aria-busy="true" />}>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </main>
  );
}
