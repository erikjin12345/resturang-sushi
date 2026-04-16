import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import ClientProviders from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Träkvista & Abrahamsbergs Sushi",
  description:
    "Familjeägda sushirestauranger i Stockholm — Träkvista Sushi och Abrahamsbergs Sushi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${inter.variable} ${playfair.variable} ${notoSerifJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
