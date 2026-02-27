import type { Metadata } from "next";
import { Inter, Bangers } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { UIProvider } from '@/context/UIContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

export const metadata: Metadata = {
  title: "Hashi | Creative Collaboration Platform",
  description: "Manage your IP, projects, and creative collaboration with AI-assisted workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bangers&family=Cinzel:wght@400..900&family=Exo+2:ital,wght@0,100..900;1,100..900&family=Noto+Serif+JP:wght@200..900&display=swap" />
      </head>
      <body className={`${inter.variable} ${bangers.variable} font-sans antialiased`}>
        <AuthProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
