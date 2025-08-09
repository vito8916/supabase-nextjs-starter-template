import React from "react";
import { ThemeSwitcher } from "../auth/theme-switcher";

export default function Footer() {
    return (
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
                Made with ❤️ by{" "}
                <a
                    href="https://github.com/vito8916"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer">
                    Vicbox
                </a>
            </p>
            <ThemeSwitcher />
        </footer>
    );
}
