import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DeployButton() {
  return (
    <>
      <Link
        href="https://vercel.com/new/clone?repository-url=https://github.com/vito8916/supabase-nextjs-starter-template&project-name=supanext-starter-kit-2&repository-name=supanext-starter-kit-2&demo-title=SupaNext+Starter+Kit+2&demo-description=A+production-ready+Next.js+App+Router+setup+with+Supabase+authentication%2C+a+clean+dashboard+shell%2C+ShadCN+%2B+Tailwind+UI+components%2C+and+a+complete+settings+experience.&demo-url=https%3A%2F%2Fsupanext-starter-kit-2.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fyourusername%2Fsupanext-starter-kit-2"
        target="_blank"
      >
        <Button className="flex items-center gap-2" size="sm">
          <svg
            className="h-3 w-3 fill-white" 
            viewBox="0 0 76 65"
            fill="hsl(var(--background))"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="inherit" />
          </svg>
          <span>Deploy to Vercel</span>
        </Button>
      </Link>
    </>
  );
}
