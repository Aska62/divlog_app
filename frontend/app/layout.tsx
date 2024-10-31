import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DivLog",
  description: "DivLog is a scuba diving Log application with which you can log your dive and plan next dive, and connect with other divers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-baseWhite dark:bg-baseBlack font-base antialiased text-darkBlue dark:text-iceBlue"
      >
        {children}
      </body>
    </html>
  );
}
