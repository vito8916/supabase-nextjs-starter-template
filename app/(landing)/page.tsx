import HeroSection from "@/components/landing/hero-section";
import ShowAdditionalSectionsToggle from "@/components/landing/show-additional-sections-toggle";

export default function Home() {
	return (
		<div className="flex flex-col gap-[32px] row-start-2 items-center min-h-screen w-full">
			<HeroSection />
			<ShowAdditionalSectionsToggle />
		</div>
	);
}
