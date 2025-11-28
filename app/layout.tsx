import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { AIPanel } from "@/components/ai-panel";

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
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <AIPanel />
        </div>
      </body>
    </html>
  );
}
