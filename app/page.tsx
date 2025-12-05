import HeroSection from "@/components/landing/hero-section";
import Footer from "@/components/landing/footer";
import ShowAdditionalSectionsToggle from "@/components/landing/show-additional-sections-toggle";
import Navbar from "@/components/landing/navbar";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="flex flex-col gap-[32px] row-start-2 items-center min-h-screen w-full">
				<HeroSection />
				<ShowAdditionalSectionsToggle />
			</main>
			<Footer />
		</>
	);
}
