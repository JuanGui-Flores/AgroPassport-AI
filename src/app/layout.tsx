// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner"; // <--- Importamos Toaster
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgroPassport AI — Evaluador de Riesgo & Scoring Agrícola",
  description: "Plataforma de inteligencia agroindustrial integrada y scoring crediticio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}>
        <AuthProvider>
          {children}
        </AuthProvider>

        {/* Notificaciones Toast flotantes estilizadas en Slate/Emerald */}
        <Toaster 
          theme="dark" 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#0f172a',
              borderColor: '#1e293b',
              color: '#f8fafc',
            },
          }}
        />
      </body>
    </html>
  );
}