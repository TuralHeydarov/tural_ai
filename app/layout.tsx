import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Tural.AI",
  description: "AI-powered platform by Tural",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-900">
        <Sidebar />
        <main className="ml-64 min-h-screen transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
