import type { Metadata } from "next";
import { DM_Serif_Display, Outfit, DM_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FacilitatorProvider } from "@/contexts/FacilitatorContext";
import { CreationFlowProvider } from "@/contexts/CreationFlowContext";

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
        className={`${dmSerifDisplay.variable} ${outfit.variable} ${dmMono.variable} font-body bg-canvas text-ink antialiased`}
      >
        <LanguageProvider>
          <FacilitatorProvider>
            <CreationFlowProvider>
              {children}
            </CreationFlowProvider>
          </FacilitatorProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
