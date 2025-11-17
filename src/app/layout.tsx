import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomThemeProvider } from "@/lib/theme/provider";
import { QueryProvider } from "@/components/query-provider";
import { ZyloProvider } from "@/lib/zylo/provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "rooted - Grounded in Nature, rooted in Wellness",
  description: "A holistic wellness platform designed for natural living. Track your journey, practice mindfulness, and build sustainable daily rituals grounded in nature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {}
      
        {/* PHOENIX_EDITOR_INJECTION_START */}
        {(process.env.NODE_ENV === 'development' ||
          process.env.NEXT_PUBLIC_ENABLE_PHOENIX_EDITOR === 'true') && (
          <>
            <link rel="stylesheet" href="/phoenix-editor/helper.css?v=1763344993003" />
            <script
              src="/phoenix-editor/sourceMapTracker.js?v=1763344993003"
              data-phoenix-sourcemap="true"
              defer
            />
            <script
              src="/phoenix-editor/helper.js?v=1763344993003"
              data-phoenix-enabled="true"
              defer
            />
            <script
              src="/phoenix-editor/visualEditExtension.js?v=1763344993003"
              data-phoenix-visual-edit="true"
              defer
            />
            <script
              src="/phoenix-editor/contextIntegration.js?v=1763344993003"
              data-phoenix-context="true"
              defer
            />
            <script
              src="/phoenix-editor/inlineTextEditor.js?v=1763344993003"
              data-phoenix-text-edit="true"
              defer
            />
            <script
              src="/phoenix-editor/inlineClassEditor.js?v=1763344993003"
              data-phoenix-class-edit="true"
              defer
            />
          </>
        )}
        {/* PHOENIX_EDITOR_INJECTION_END */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ZyloProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <CustomThemeProvider>
                <TooltipProvider>
                  {children}
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </CustomThemeProvider>
            </ThemeProvider>
          </ZyloProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
