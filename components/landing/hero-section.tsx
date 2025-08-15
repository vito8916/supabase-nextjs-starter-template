import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import VicboxLogo from "@/components/vicbox-logo";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden py-32">
            <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
                <Image
                    priority
                    alt="background"
                    src="/assets/images/square-alt-grid.svg"
                    width={1200}
                    height={800}
                    className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
                />
            </div>
            <div className="relative z-10 container">
                <div className="mx-auto flex max-w-5xl flex-col items-center">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <VicboxLogo />
                        <div>
                            <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                                Build your next project with <span className="text-primary">ease</span>
                            </h1>
                            <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                                SupaNext Starter Kit2 gives you the essentials to build your next project. You get a fully functional Auth flow, a user profile page, and a dashboard skeleton to get you started.
                            </p>
                        </div>
                        <div className="mt-6 flex justify-center gap-3">
                            <Button asChild>
                                <Link href="/login">Get Started</Link>
                            </Button>
                            <Button variant="outline" className="group" asChild>
                                <Link href="https://github.com/vito8916/supabase-nextjs-starter-template" target="_blank">
                                    GitHub Repo
                                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </Button>
                        </div>
                        <div className="mt-20 flex flex-col items-center gap-5">
                            <p className="font-medium text-muted-foreground lg:text-left">
                                Built with open-source technologies
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="group h-12 w-12"
                                    asChild
                                >
                                    <Link href="https://nextjs.org/" target="_blank">
                                        <Image
                                            src="/assets/icons/brands/nextjs_icon_dark.svg"
                                            alt="shadcn/ui logo"
                                            width={24}
                                            height={24}
                                            className="h-6 saturate-0 transition-all group-hover:saturate-100"
                                        />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="group h-12 w-12"
                                    asChild
                                >
                                    <Link href="https://www.typescriptlang.org/" target="_blank">
                                        <Image
                                            src="/assets/icons/brands/typescript.svg"
                                            alt="TypeScript logo"
                                            width={24}
                                            height={24}
                                            className="h-6 saturate-0 transition-all group-hover:saturate-100"
                                        />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="group h-12 w-12"
                                    asChild
                                >
                                    <Link href="https://supabase.com/" target="_blank">
                                        <Image
                                            src="/assets/icons/brands/supabase.svg"
                                            alt="React logo"
                                            width={24}
                                            height={24}
                                            className="h-6 saturate-0 transition-all group-hover:saturate-100"
                                        />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="group h-12 w-12"
                                    asChild
                                >
                                    <Link href="https://ui.shadcn.com/" target="_blank">
                                        <Image
                                            src="/assets/icons/brands/ui_light.svg"
                                            alt="Tailwind CSS logo"
                                            width={24}
                                            height={24}
                                            className="h-6 saturate-0 transition-all group-hover:saturate-100"
                                        />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
