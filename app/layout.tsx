import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "PhishWise - Phishing Awareness Training",
  description:
    "Prepare Today. Prevent Tomorrow. - Personal phishing awareness training for individuals and small groups",
  keywords: ["phishing", "cybersecurity", "training", "awareness", "security"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
