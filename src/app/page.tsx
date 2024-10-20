
import HeroHeader from "~/components/landing/hero";
import { Button } from "~/components/ui/button";
import { HydrateClient } from "~/trpc/server";
/*
 * T3 Gradient  bg-gradient-to-b from-[#2e026d] to-[#15162c]
 */
export default async function Home() {
    return (
        <HydrateClient>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <HeroHeader />
            </main>
        </HydrateClient>
    );
}
