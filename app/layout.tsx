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
