import type { Metadata } from "next";
import { DM_Serif_Display, Outfit, DM_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

const dmMono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-creator",
});

export const metadata: Metadata = {
  title: "SEA-Up Creative",
  description: "AI-powered creative platform for people with intellectual disabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerifDisplay.variable} ${outfit.variable} ${dmMono.variable} ${nunito.variable} font-body bg-canvas text-ink antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
