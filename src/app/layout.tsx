import type { Metadata } from "next";
import Script from "next/script";
import { Cinzel } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import AuroraBackground from "@/components/AuroraBackground";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "NailAI - 暗夜珍宝阁 | AI美学工作室",
  description: "上传你的灵感碎片，AI为你打造一枚可穿戴的美学藏品。",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${cinzel.variable} antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" style={{ background: "var(--bg-void)", color: "var(--ink-secondary)" }}>
        <AuroraBackground />
        <Navigation />
        <main
          className="relative z-[2] pt-[60px] min-h-screen"
          style={{ animation: "pageEnter 0.6s ease-out" }}
        >
          {children}
        </main>
        <Script id="unicorn-init-poll" strategy="afterInteractive">
          {`
            (function() {
              // 动态加载 UnicornStudio SDK
              if (!document.getElementById('us-sdk')) {
                var s = document.createElement('script');
                s.id = 'us-sdk';
                s.src = '/libs/unicornStudio.umd.js';
                document.head.appendChild(s);
              }
              // 轮询初始化
              var tries = 0;
              var poll = setInterval(function() {
                tries++;
                if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
                  window.UnicornStudio.init();
                  clearInterval(poll);
                }
                if (tries > 50) clearInterval(poll);
              }, 300);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
