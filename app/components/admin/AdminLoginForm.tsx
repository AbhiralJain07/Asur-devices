"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import Button from "../ui/Button";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin123@gmail.com");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to sign in.");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-sm">
      <div>
        <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-white/70">
          Admin Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          placeholder="admin@example.com"
          required
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-white/70">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          placeholder="Enter admin password"
          required
        />
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in to dashboard"}
      </Button>
    </form>
  );
}

