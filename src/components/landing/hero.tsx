import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/lib/utils"

export default function HeroHeader() {
    return (
        <section className="container flex flex-col gap-4 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
            <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold lg:text-6xl">
                        Draw Based on a Prompt with Muse
                    </h1>
                    <h2 className="text-lg font-light text-muted-foreground lg:text-3xl">
                        We give you a prompt, you draw it. AI Judges it. Now
                    </h2>
                </div>
                <Link
                    href="https://github.com/nyumat/muse"
                    target="_blank"
                    className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
                >
                    Get started
                </Link>
            </div>

            <div className="flex flex-1 justify-center lg:justify-end">
                <Image
                    src="/images/hero.svg"
                    width={500}
                    height={500}
                    alt="Header image"
                />
            </div>

        </section>
    )
}