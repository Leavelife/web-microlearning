"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VirtualLabSimulasi from "@/components/simulasi/kabel-lan/VirtualLabSimulasi";
import Navbar from "@/components/Navbar";

export default function SimulasiKabelLanPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    // Check if user has a valid token
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          // User is not authenticated, redirect to login
          router.push('/login?redirect=/simulasi/kabel-lan');
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login?redirect=/simulasi/kabel-lan');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 text-gray-900 flex items-center justify-center">
        <div className="text-gray-600">Memeriksa autentikasi...</div>
      </main>
    );
  }

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-slate-100 text-gray-900 flex items-center justify-center">
        <div className="text-gray-600">Mengalihkan ke halaman login...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-gray-900">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Simulasi Kabel LAN (RJ-45)</h1>
        <p className="text-gray-600 mb-6">
          Susun kabel sesuai urutan straight (T568B). Kabel dapat diseret dari bawah ke konektor di atas.
        </p>
        <VirtualLabSimulasi />
      </section>
    </main>
  );
}
