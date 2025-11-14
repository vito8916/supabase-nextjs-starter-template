import { Suspense } from "react";
import HeroSection from "@/components/landing/hero-section";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { AuthButton } from "@/components/landing/auth-button";

function NavbarWithAuth() {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                    <a href={"/"}>SupaNext Starter Kit2</a>
                </div>
                <Suspense fallback={<div className="h-8 w-24 animate-pulse bg-muted rounded" />}>
                    <AuthButton />
                </Suspense>
            </div>
        </nav>
    );
}

export default function Home() {
    return (
        <>
            <NavbarWithAuth />
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-[32px] row-start-2 items-center">
                    <HeroSection />
                </main>
            </div>
            <Footer />
        </>
    );
}
