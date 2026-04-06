import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/cms/auth";

import AdminLoginForm from "../../components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-background-primary px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-neon-blue">
            Secure Admin Access
          </p>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Manage the landing page without leaving the existing project stack
          </h1>
          <p className="max-w-2xl text-lg text-white/65">
            Sign in as an administrator to manage testimonials, blogs, pricing plans, and contact submissions. All updates are validated server-side and synced back to the public site without a reload.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
