import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مدك | منصة الرعاية الصحية بين يديك",
  description:
    "مدك هو تطبيق رعاية صحية عن بُعد يربطك بأفضل الأطباء، يتيح الحجز والاستشارة عبر الفيديو والدردشة، وإصدار الوصفات الطبية إلكترونيًا.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${plexArabic.variable} font-body bg-sand text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}