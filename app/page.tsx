import { Suspense } from "react";
import HeroSection from "@/components/landing/hero-section";
import Footer from "@/components/landing/footer";
import { AuthButton } from "@/components/landing/auth-button";
import ShowAdditionalSectionsToggle from "@/components/landing/show-additional-sections-toggle";

function NavbarWithAuth() {
	return (
		<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
				<div className="flex gap-5 items-center font-semibold">
					<a href={"/"}>SupaNext Starter Kit2</a>
				</div>
				<Suspense
					fallback={
						<div className="h-8 w-24 animate-pulse bg-muted rounded" />
					}
				>
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
			<main className="flex flex-col gap-[32px] row-start-2 items-center min-h-screen w-full">
				<HeroSection />
				<ShowAdditionalSectionsToggle />
			</main>
			<Footer />
		</>
	);
}
