import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartProvider } from "@/components/cart/cart-provider";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Premium 365 Limited | Enterprise Technology, IT Services & Professional Academy",
    template: "%s | Premium 365 Limited",
  },
  description:
    "UK provider of enterprise technology hardware, tailored IT consulting, bespoke software engineering, cybersecurity assessments, data analytics, and hands-on professional IT training.",
  keywords: [
    "Premium 365",
    "UK IT services",
    "business laptops",
    "cybersecurity consulting Birmingham",
    "Power BI analytics",
    "cloud migration",
    "IT hardware procurement",
    "tech academy UK",
  ],
  authors: [{ name: "Premium 365 Limited" }],
  creator: "Premium 365 Limited",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://premium365.uk"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Premium 365 Limited",
    title: "Premium 365 Limited | Technology, Delivered Better",
    description:
      "Enterprise technology products, IT consulting, software development, cybersecurity, data analytics, and professional IT training.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <CartProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-140px)]">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
