"use client";

import { signIn } from "next-auth/react";
import { Wallet } from "lucide-react";

export default function LoginPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes blob1 {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes blob2 {
          0%,100% { border-radius: 40% 60% 60% 40% / 40% 60% 40% 60%; }
          50%      { border-radius: 60% 40% 40% 60% / 60% 40% 60% 40%; }
        }

        .fade-up-1 { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.25s both; }
        .fade-up-3 { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.4s both; }
        .fade-up-4 { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) 0.55s both; }

        .logo-float { animation: float 4s ease-in-out infinite; }

        .btn-login {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-login:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.35);
        }
        .btn-login:active { transform: translateY(0); }
        .btn-login::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .card-glow {
          box-shadow:
            0 0 0 1px rgba(37,99,235,0.08),
            0 4px 6px -1px rgba(0,0,0,0.05),
            0 20px 60px -10px rgba(37,99,235,0.12);
        }
      `}</style>

      <main className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden bg-gray-50">
        <div
          className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 opacity-20"
          style={{ background: "radial-gradient(circle, #93c5fd, #3b82f6)", animation: "blob1 8s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 opacity-15"
          style={{ background: "radial-gradient(circle, #bfdbfe, #60a5fa)", animation: "blob2 10s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/4 w-64 h-64 opacity-10"
          style={{ background: "radial-gradient(circle, #dbeafe, #93c5fd)", animation: "blob1 12s ease-in-out infinite reverse" }}
        />
        <div className="relative w-full max-w-md rounded-3xl bg-white p-10 card-glow">
          <div className="fade-up-1 flex justify-center mb-8">
            <div
              className="logo-float flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
            >
              <Wallet className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="fade-up-2 text-center mb-2">
            <h1 className="text-3xl font-bold text-blue-600">
              WalletWise
            </h1>
          </div>
          <div className="fade-up-3 text-center mb-8">
            <p className="text-sm text-gray-500">
              Zaloguj się, aby zarządzać swoimi finansami
            </p>
          </div>
          <div className="fade-up-3 flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300 uppercase tracking-widest">logowanie</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="fade-up-4">
            <button
              type="button"
              className="btn-login w-full rounded-2xl px-6 py-3.5 text-sm font-medium text-white tracking-wide"
              onClick={() => signIn("keycloak", { callbackUrl: "/" }, { prompt: "login" })}
            >
              Zaloguj się przez Keycloak
            </button>
          </div>
        </div>
      </main>
    </>
  );
}