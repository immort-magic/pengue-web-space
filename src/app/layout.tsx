import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "./jack-space.css";

export const metadata: Metadata = {
  title: "Pengue's Space",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
