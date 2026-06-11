import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "SmileAtEase",
  description: "Feel more prepared before your dental visit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
