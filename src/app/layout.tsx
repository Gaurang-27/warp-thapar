import type { Metadata } from "next";
import { Geist, Geist_Mono , Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets : ['latin'],
  weight : ['400','900'],
})

export const metadata: Metadata = {
  title: "Warp @ Thapar",
  description: "Warp services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <Providers>
           <html lang="en">
      <body
        className={`${montserrat.className} ${geistMono.variable} antialiased bg-orange-50`}
      >
        {children}
      </body>
    </html>
     </Providers>
  );
}
