import { Geist, Geist_Mono } from "next/font/google";
import { NotificationProvider } from "@/components/context/NotificationContext";
import { GamificationProvider } from "@/components/gamification/GamificationProvider"
import GamificationRenderer from "@/components/gamification/GamificationRenderer"
import GamificationToast from "@/components/gamification/GamificationToast"
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
  title: "MICROLAB",
  description: "Platfrom microlearning interaktif untuk siswa SMK TKJ dengan sistem progres, quiz, dan virtual lab.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className="min-h-full flex flex-col">
        <NotificationProvider >
          <GamificationProvider>
            {children}
            <GamificationRenderer />
            <GamificationToast />
          </GamificationProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
