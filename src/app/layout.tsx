// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext"; // <--- 1. Importamos el AuthProvider
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 2. Envolvemos los hijos con el proveedor de autenticación y RBAC */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}