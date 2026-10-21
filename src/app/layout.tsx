import imageAsset0 from "../../public/icon.png";
import type { Metadata } from "next";
import { MotionConfig } from "motion/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Cursor from "@/components/cursor";
import "./global.css";

export const metadata: Metadata = {
  title: "Grailord Antonio — Social Media Manager",
  description:
    "I help businesses grow their social media presence, create strategic content that connects with the right audience, and streamline lead management through CRM and marketing automation.",
  robots: { index: false, follow: false },
  icons: { icon: imageAsset0.src },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="geist_dbbf8c4b-module__5qCx7q__variable antialiased"
    >
      <head>
        <link
          rel="preload"
          href="/fonts/caa3a2e1cccd8315-s.p.09~u27dqhyhd6.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-white text-[#111111] font-sans">
        <MotionConfig reducedMotion="user">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-[#111111] focus:rounded-lg focus:shadow-lg"
          >
            Skip to content
          </a>
          <Header />
          {children}
          <Footer />
          <Cursor />
        </MotionConfig>
      </body>
    </html>
  );
}
