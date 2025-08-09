import Image from "next/image";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {ListCheckIcon, ShieldCheckIcon, CreditCardIcon, DatabaseIcon, RocketIcon, ZapIcon} from "lucide-react";

function Features() {
    const features = [
        {
            icon: ShieldCheckIcon,
            title: "Production Ready",
            description: "Complete SaaS template with authentication, database, subscriptions, and more.",
            brandIcon: "/assets/icons/brands/supabase.svg"
        },
        {
            icon: ZapIcon,
            title: "Authentication Flow",
            description: "Sign up, sign in, and reset password with ease. Complete authentication flow with email and social logins.",
            brandIcon: "/assets/icons/brands/supabase.svg"
        },
        {
            icon: CreditCardIcon,
            title: "Stripe Subscriptions",
            description: "Real use cases for subscriptions, including billing, payment methods, webhooks and more.",
            brandIcon: "/assets/icons/brands/stripe_logo.webp"
        },
        {
            icon: DatabaseIcon,
            title: "Supabase Integration",
            description: "Initial database setup to get you started with database, authentication, and subscriptions.",
            brandIcon: "/assets/icons/brands/supabase.svg"
        },
        {
            icon: RocketIcon,
            title: "Next.js v15",
            description: "Latest Next.js features, adhering to official documentation to take full advantage of what Next.js offers.",
            brandIcon: "/assets/icons/brands/nextjs_icon_dark.svg"
        }
    ];

    return (
        <section className="py-32">
            <div className="container mx-auto">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
                    {/* Header Section */}
                    <div className="md:col-span-2 lg:col-span-1 flex flex-col gap-6">
                        <Badge className="text-xs font-medium uppercase w-fit">
                            <ListCheckIcon className="h-4 w-4 mr-2" />
                            Features
                        </Badge>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                                Unlock Synergy, Seamless Integrations
                        </h2>
                            <p className="text-muted-foreground lg:text-lg">
                                Explore seamless integrations with other tools and platforms, enhancing productivity and workflow efficiency.
                        </p>
                    </div>
                            </div>

                    {/* Feature Cards */}
                    {features.map((feature, index) => (
                        <Card 
                            key={index} 
                            className="group border-border/50 transition-all hover:border-border hover:shadow-md"
                        >
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
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;