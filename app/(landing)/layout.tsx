
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

/**
 * Landing layout: wraps landing pages with Navbar and Footer.
 * Toaster is provided by the root layout and does not need to be repeated here.
 */
export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-8 items-center min-h-screen w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
