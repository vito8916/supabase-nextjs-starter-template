import HeroSection from "@/components/landing/hero-section";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-[32px] row-start-2 items-center">
                    <HeroSection />
                </main>
            </div>
            <Footer />
        </>
    );
}
