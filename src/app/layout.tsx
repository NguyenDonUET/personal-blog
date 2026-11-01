import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const dmSans = localFont({
  src: [
    {
      path: "../../public/assets/fonts/DM_Sans/DMSans-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/DM_Sans/DMSans-Italic-VariableFont_opsz,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const firaCode = localFont({
  src: "../../public/assets/fonts/Fira_Code/FiraCode-VariableFont_wght.ttf",
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paulina's Blog",
  description: "A personal blog documenting a front-end development journey.",
  icons: {
    icon: "/assets/images/favicon-32x32.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${firaCode.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="site-body min-h-full flex flex-col antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
