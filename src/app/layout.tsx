import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "../components/Providers";
export const metadata: Metadata = {
    title: "বাজার দর | BazarDor",
    description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন।"
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang="bn">
        <body>
            <Providers />
            <Header />
            <main className="main-content">{children}
            </main>
            <Footer />
        </body>
    </html>
}
