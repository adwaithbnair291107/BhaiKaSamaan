import type { Metadata } from "next";
import { GlobalClickLoader } from "@/components/global-click-loader";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "BhaiKaSamaan",
  description: "Bhai Ka Samaan, Junior Ke Kaam, Kam Hai Daam."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Suspense fallback={null}>
          <GlobalClickLoader />
        </Suspense>
        <div className="min-h-screen">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
