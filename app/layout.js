import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gulf Solar | Waiheke Island Solar Installers",
  description:
    "Calculator-led solar estimates for Waiheke Island and the Gulf. Clear ranges, fast results, no pressure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="gulf">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
