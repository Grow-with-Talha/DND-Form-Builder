import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import DesignercontextProvider from "@/components/context/DesignerContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DND form Builder",
  description: "Build your forms with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta lang="en" />
      </head>
      <body>
        <DesignercontextProvider  >
          <ThemeProvider attribute="class">
            <ClerkProvider>
              <NextTopLoader
                color="#3673d6"
              />
              <div>
                {children}
                <Toaster />
              </div>
            </ClerkProvider>
          </ThemeProvider>
        </DesignercontextProvider>
      </body>
    </html>
  );
}
