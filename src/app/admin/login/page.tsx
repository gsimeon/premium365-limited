import { isSupabaseConfigured } from "@/lib/catalogue";
import { AdminLoginForm } from "./admin-login-form";

export const metadata = { 
  title: "Staff & Operations Sign In | Premium 365 Limited",
  description: "Secure administrative access for Premium 365 staff, inventory controllers, and operators.",
};

type SearchParams = Promise<{ error?: string; sent?: string }>;

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <section className="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative overflow-hidden bg-slate-50/60">
      {/* Background Grid Pattern & Ambient Gradients */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/80 via-transparent to-transparent pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <AdminLoginForm 
        configured={configured}
        error={params.error}
        sent={params.sent}
      />
    </section>
  );
}
