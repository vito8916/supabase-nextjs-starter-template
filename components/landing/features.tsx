"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	ListCheckIcon,
	ShieldCheckIcon,
	CreditCardIcon,
	DatabaseIcon,
	RocketIcon,
	ZapIcon,
} from "lucide-react";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
	},
};

const featuresList = [
	{
		icon: ShieldCheckIcon,
		title: "Production Ready",
		description:
			"Complete SaaS template with authentication, database, subscriptions, and more.",
		brandIcon: "/assets/icons/brands/supabase.svg",
	},
	{
		icon: ZapIcon,
		title: "Authentication Flow",
		description:
			"Sign up, sign in, and reset password with ease. Complete authentication flow with email and social logins.",
		brandIcon: "/assets/icons/brands/supabase.svg",
	},
	{
		icon: CreditCardIcon,
		title: "Stripe Subscriptions",
		description:
			"Real use cases for subscriptions, including billing, payment methods, webhooks and more.",
		brandIcon: "/assets/icons/brands/stripe_logo.webp",
	},
	{
		icon: DatabaseIcon,
		title: "Supabase Integration",
		description:
			"Initial database setup to get you started with database, authentication, and subscriptions.",
		brandIcon: "/assets/icons/brands/supabase.svg",
	},
	{
		icon: RocketIcon,
		title: "Next.js v16.2",
		description:
			"Latest Next.js features, including App Router, Server Components, and more.",
		brandIcon: "/assets/icons/brands/nextjs_icon_dark.svg",
	},
];

export const Features = () => {
	return (
		<section className="py-16 sm:py-20 lg:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0 }}
				>
					{/* Header — occupies 1 col at every breakpoint: no orphaned cards */}
					<motion.div variants={itemVariants} className="flex flex-col gap-6">
						<Badge className="text-xs font-medium uppercase w-fit">
							<ListCheckIcon className="h-4 w-4 mr-2" />
							Features
						</Badge>
						<div className="space-y-3">
							<h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
								Unlock Synergy, Seamless Integrations
							</h2>
							<p className="text-muted-foreground lg:text-lg">
								Explore seamless integrations with other tools and platforms,
								enhancing productivity and workflow efficiency.
							</p>
						</div>
					</motion.div>

					{/* Feature Cards */}
					{featuresList.map((feature, index) => (
						<motion.div key={index} variants={itemVariants}>
							<Card className="group border-border/50 transition-all hover:border-border hover:shadow-md h-full">
								<CardHeader className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="grid size-12 shrink-0 place-content-center rounded-md border bg-background group-hover:border-primary/20 transition-colors">
											<feature.icon className="h-6 w-6 text-primary" />
										</div>
										<div className="grid size-8 shrink-0 place-content-center">
											<Image
												width={20}
												height={20}
												src={feature.brandIcon}
												alt={`${feature.title} logo`}
												className="h-5 w-auto saturate-0 transition-all group-hover:saturate-100"
											/>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									<h3 className="font-semibold text-lg tracking-tight">
										{feature.title}
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};
