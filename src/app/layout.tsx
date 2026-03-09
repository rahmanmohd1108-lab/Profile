import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohammed Rahiman Basha | Full-Stack Developer Portfolio",
  description: "Software Engineer with strong full-stack development expertise, cloud computing (AWS), RESTful API design, and software testing. Experienced in building scalable applications with Node.js, React.js, and modern technologies.",
  keywords: ["Mohammed Rahiman Basha", "Full-Stack Developer", "Software Engineer", "React.js", "Node.js", "AWS", "Python", "JavaScript", "Portfolio"],
  authors: [{ name: "Mohammed Rahiman Basha" }],
  icons: {
    icon: "/hacker-avatar.png",
  },
  openGraph: {
    title: "Mohammed Rahiman Basha | Full-Stack Developer",
    description: "Software Engineer specializing in full-stack development, cloud computing, and scalable applications",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Rahiman Basha | Full-Stack Developer",
    description: "Software Engineer specializing in full-stack development, cloud computing, and scalable applications",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
