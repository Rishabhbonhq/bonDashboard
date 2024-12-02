import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Bon",
  description: "Bon Admin Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={clsx("font-sans antialiased", fontSans.className)}>
       <Toaster position="top-right"/>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
