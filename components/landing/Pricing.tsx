"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const pricingData = [
	"Seamless integration",
	"Real-time data visualization",
	"Advanced predictive analytics",
	"Collaborative environment",
	"Responsive customer support",
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.5,
			staggerChildren: 0.15,
			delayChildren: 0.2,
		},
	},
};

const headerVariants = {
	hidden: {
		opacity: 0,
		y: 25,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			ease: [0.25, 0.46, 0.45, 0.94],
		},
	},
};

const cardVariants = {
	hidden: {
		opacity: 0,
		y: 30,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			ease: [0.25, 0.46, 0.45, 0.94],
		},
	},
};

const pricingVariants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 0.2,
		},
	},
};

const featuresVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.3,
		},
	},
};

const featureItemVariants = {
	hidden: {
		opacity: 0,
		x: -15,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.5,
			ease: [0.25, 0.46, 0.45, 0.94],
		},
	},
};

const buttonVariants = {
	hidden: {
		opacity: 0,
		y: 15,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 0.5,
		},
	},
};

const badgeVariants = {
	hidden: {
		opacity: 0,
		scale: 0.8,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: [0.25, 0.46, 0.45, 0.94],
			delay: 0.4,
		},
	},
};

export const Pricing = () => {
	const [billingCycle, setBillingCycle] = useState("monthly");

  const handleOnClick = (plan: string) => {
    toast.success(`Get started clicked for ${plan}`, {
      description: `You've selected the ${billingCycle} ${plan} plan`,
    });
  };

	return (
		<section className="w-full flex justify-center bg-background relative">
			<div className="pb-20 pt-12 bg-background w-full max-w-6xl">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
				>
					<div className="container mx-auto px-4">
						<motion.div variants={headerVariants} className="max-w-2xl mx-auto text-center mb-16">
							<motion.div variants={headerVariants}>
								<Badge
									variant="secondary"
									className="block-subtitle"
								>
									Find Your Perfect Fit
								</Badge>
							</motion.div>
							<motion.h2 variants={headerVariants} className="mt-6 mb-6 text-4xl lg:text-5xl font-bold font-heading text-primaryText">
								Choose your best plan
							</motion.h2>
							<motion.p variants={headerVariants} className="mb-6 text-secondaryText">
								Select the plan that suits your needs and
								benefit from our analytics tools.
							</motion.p>
							<motion.div variants={headerVariants}>
								<Tabs
									value={billingCycle}
									onValueChange={setBillingCycle}
									className="w-full"
								>
									<TabsList className="grid w-full max-w-[400px] grid-cols-2 mx-auto">
										<TabsTrigger
											className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground text-foreground"
											value="monthly"
										>
											Monthly
										</TabsTrigger>
										<TabsTrigger
											className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground text-foreground"
											value="yearly"
										>
											Yearly
										</TabsTrigger>
									</TabsList>
								</Tabs>
							</motion.div>
						</motion.div>
						<div className="flex flex-col lg:flex-row items-center mt-20 gap-8 lg:gap-6 w-full">
							<motion.div variants={cardVariants}>
								<Card className="w-full px-4 mb-8 lg:mb-0 hover:shadow-lg transition-shadow duration-300">
									<CardHeader>
										<CardTitle>Beginner</CardTitle>
										<CardDescription>
											<motion.div variants={pricingVariants} className="flex justify-start items-end">
												<div className="text-4xl sm:text-5xl font-bold text-foreground text-left mt-4 mr-2">
													{billingCycle === "monthly" ? "$0" : "$0"}
												</div>
												<div className="text-muted-foreground">
													{billingCycle === "monthly" ? "/ month" : "/ year"}
												</div>
											</motion.div>
											The perfect way to get started and get used to our tools.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<motion.ul variants={featuresVariants} className="mb-8 space-y-3">
											{pricingData.map((text, index) => (
												<motion.li
													variants={featureItemVariants}
													className="flex items-center"
													key={`${text}-${index}`}
												>
													<Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
													<span className="text-foreground">
														{text}
													</span>
												</motion.li>
											))}
										</motion.ul>
										<motion.div variants={buttonVariants}>
											<Button
												className="w-full mt-16"
												size="lg"
												onClick={() => handleOnClick("Beginner")}
											>
												Get Started
											</Button>
										</motion.div>
									</CardContent>
								</Card>
							</motion.div>
							<motion.div variants={cardVariants}>
								<Card className="w-full px-4 mb-8 lg:mb-0 relative hover:shadow-lg transition-shadow duration-300">
									<CardHeader>
										<CardTitle>Standard</CardTitle>
										<CardDescription>
											<motion.div variants={pricingVariants} className="flex justify-start items-end">
												<div className="text-4xl sm:text-5xl font-bold text-foreground text-left mt-4 mr-2">
													{billingCycle === "monthly" ? "$19" : "$180"}
												</div>
												<div className="text-muted-foreground">
													{billingCycle === "monthly" ? "/ month" : "/ year"}
												</div>
											</motion.div>
											Unlock more features and elevate your data analysis.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<motion.div variants={badgeVariants}>
											<Badge
												variant="secondary"
												className="bg-primary text-primary-foreground border-primary/20 mb-4"
											>
												Most Popular
											</Badge>
										</motion.div>
										<motion.ul variants={featuresVariants} className="mb-8 space-y-3">
											{pricingData.map((text, index) => (
												<motion.li
													variants={featureItemVariants}
													className="flex items-center"
													key={`${text}-${index}`}
												>
													<Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
													<span className="text-foreground">
														{text}
													</span>
												</motion.li>
											))}
										</motion.ul>
										<motion.div variants={buttonVariants}>
											<Button
												className="w-full mt-20"
												size="lg"
												onClick={() => handleOnClick("Standard")}
											>
												Get Started
											</Button>
										</motion.div>
									</CardContent>
								</Card>
							</motion.div>
							<motion.div variants={cardVariants}>
								<Card className="w-full px-4 mb-8 lg:mb-0 hover:shadow-lg transition-shadow duration-300">
									<CardHeader>
										<CardTitle>Premium</CardTitle>
										<CardDescription>
											<motion.div variants={pricingVariants} className="flex justify-start items-end">
												<div className="text-4xl sm:text-5xl font-bold text-foreground text-left mt-4 mr-2">
													{billingCycle === "monthly"
														? "$36"
														: "$390"}
												</div>
												<div className="text-muted-foreground">
													{billingCycle === "monthly"
														? "/ month"
														: "/ year"}
												</div>
											</motion.div>
											Experience the full power of our analytic platform
										</CardDescription>
									</CardHeader>
									<CardContent>
										<motion.ul variants={featuresVariants} className="mb-8 space-y-3">
											{pricingData.map((text, index) => (
												<motion.li
													variants={featureItemVariants}
													className="flex items-center"
													key={`${text}-${index}`}
												>
													<Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
													<span className="text-foreground">
														{text}
													</span>
												</motion.li>
											))}
										</motion.ul>
										<motion.div variants={buttonVariants}>
											<Button
												className="w-full mt-16"
												size="lg"
												onClick={() => handleOnClick("Premium")}
											>
												Get Started
											</Button>
										</motion.div>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
