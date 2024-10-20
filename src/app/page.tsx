import { Hero } from "~/components/landing/hero";
import { Navbar } from "~/components/nav";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { AddEmbeddingsButton } from "./test";
/*
 * T3 Gradient  bg-gradient-to-b from-[#2e026d] to-[#15162c]
 */
export default async function Home() {
  const user = await getServerAuthSession();
  return (
    <HydrateClient>
      <Navbar />
      <main className="flex flex-col items-center justify-center">
        <Hero session={user} />
      </main>
    </HydrateClient>
  );
}
