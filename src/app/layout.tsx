import type { Metadata, Viewport } from "next";
import { Manrope, Space_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abhii.online"),
  title: "Abhijeet Shrivastava — Creative Developer & 3D Designer",
  description:
    "Portfolio of Abhijeet Shrivastava, a creative developer and 3D designer building interactive web experiences with Three.js, React and thoughtful digital design.",
  keywords: [
    "Abhijeet Shrivastava",
    "creative developer",
    "3D web developer",
    "Three.js developer",
    "React Three Fiber",
    "interactive designer",
    "India",
  ],
  authors: [{ name: "Abhijeet Shrivastava" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Abhijeet Shrivastava — Creative Developer & 3D Designer",
    description: "Interactive web experiences shaped through code, motion and 3D design.",
    siteName: "Abhii — Creative Developer Portfolio",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhijeet Shrivastava — Creative Developer & 3D Designer",
    description: "Interactive web experiences shaped through code, motion and 3D design.",
    images: ["/og-image.png"],
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#07080b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
