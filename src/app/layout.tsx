import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Navigation } from "@/components/layout/Navigation";
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
  title: "Hangul Automata — 유한 오토마타로 이해하는 한글 입력",
  description:
    "DFA, Mealy Machine, 영한 변환기를 인터랙티브하게 시각화합니다. 도깨비불 현상 포함.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navigation />
          <main className="snap-y snap-mandatory overflow-y-auto h-[calc(100dvh-3.5rem)] scroll-smooth overscroll-none">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
