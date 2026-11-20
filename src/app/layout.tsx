import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import LayoutClient from "./layout.client";
import { THEME_INIT_SCRIPT } from "@/settings/constants";
import { getServerLocale } from "@/settings/server";

// Inter с кириллицей: кыргызские ө, ү, ң входят в набор cyrillic
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "ORTO — ЖРТ / ОРТ даярдык", template: "%s · ORTO" },
  description:
    "ЖРТ/ОРТго акылдуу даярдануу: тесттер, практика, каталар журналы, интервалдык кайталоо жана аналитика.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f1a" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getServerLocale();

  return (
    // data-theme уточняет inline-скрипт до первой отрисовки → suppressHydrationWarning
    <html lang={locale} data-theme="light" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <LayoutClient locale={locale}>{children}</LayoutClient>
      </body>
    </html>
  );
}
