import Link from "next/link";
import { Suspense } from "react";
import { hasEnvVars } from "@/lib/utils";
import { AuthButton } from "@/components/landing/auth-button";
import { EnvVarWarning } from "@/components/landing/env-var-warning";

export default function Navbar() {
	return (
		<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
				<div className="flex gap-5 items-center font-semibold">
					<Link href={"/"}>SupaNext Starter Template</Link>
				</div>
				{!hasEnvVars ? (
					<EnvVarWarning />
				) : (
					<Suspense
						fallback={
							<div className="h-8 w-24 animate-pulse bg-muted rounded" />
						}
					>
						<AuthButton />
					</Suspense>
				)}
			</div>
		</nav>
	);
}
