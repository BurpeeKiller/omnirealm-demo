import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./layout-client";
import { SmartPWAInstallPrompt } from "@/components/PWA/InstallPrompt";
import { ServiceWorkerRegistration } from "@/components/PWA/ServiceWorkerRegistration";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OmniFit - Coach Fitness IA Premium",
  description: "Votre coach fitness IA personnel pour atteindre vos objectifs",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export function generateViewport() {
  return {
    themeColor: "#00D9B1",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ClientLayout>
          {children}
          <SmartPWAInstallPrompt />
          <ServiceWorkerRegistration />
        </ClientLayout>
      </body>
    </html>
  );
}
