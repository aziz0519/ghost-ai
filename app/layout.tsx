import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkAuthGate } from "@/components/auth/clerk-auth-gate";
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
  title: "Ghost AI",
  description: "Secure editor workspace with Clerk authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorPrimary: "var(--accent-primary)",
          colorPrimaryForeground: "var(--primary-foreground)",
          colorForeground: "var(--text-primary)",
          colorBackground: "var(--bg-surface)",
          colorInput: "var(--bg-subtle)",
          colorInputForeground: "var(--text-primary)",
          colorMutedForeground: "var(--text-secondary)",
          colorNeutral: "var(--bg-elevated)",
          colorBorder: "var(--border-default)",
          colorDanger: "var(--state-error)",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-base text-foreground">
          <ClerkAuthGate>{children}</ClerkAuthGate>
        </body>
      </html>
    </ClerkProvider>
  );
}
