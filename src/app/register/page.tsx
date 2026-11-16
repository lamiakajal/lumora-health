import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create your account",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <main id="main">
      <AuthShell
        title="Create your account"
        subtitle="It takes less than a minute."
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary-deep hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthShell>
    </main>
  );
}
