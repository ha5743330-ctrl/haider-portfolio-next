import { DM_Sans, Unbounded } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"], weight: ["500", "800"], display: "swap" });
const dm = DM_Sans({ variable: "--font-dm", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${unbounded.variable} ${dm.variable}`}>
      <body>{children}</body>
    </html>
  );
}
