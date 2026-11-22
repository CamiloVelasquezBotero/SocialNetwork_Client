import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ToastNotification from "@/components/ui/ToastNotification";
import DarkModeInit from "@/components/ui/DarkModeInit";
import MessagePopupNotification from "@/components/ui/MessagePopupNotification";

export const metadata: Metadata = {
  title: "Chat App - Realtime Socket.io & Next.js",
  description: "Social Network with real-time chat powered by Socket.io and Next.js"
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {

  return (
    <html lang="en" className="h-full">
      <body className="bg-slate-200 dark:bg-gray-900 transition-colors duration-300 h-screen h-[100dvh] flex flex-col overflow-hidden">
        <DarkModeInit />
        <Header />
        <main className="flex-1 min-h-0 flex flex-col overflow-y-auto">
          {children}
        </main>
        <ToastNotification />
        <MessagePopupNotification />
      </body>
    </html>
  );
}
