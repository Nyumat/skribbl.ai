/* eslint-disable react/no-unescaped-entities */
"use client";
import { motion } from "framer-motion";
import { PlusCircle, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SkribblLogo } from "~/components/logo";
import { BackgroundGradient } from "~/components/ui/background-gradient";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function ChooseFlowPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 md:p-6">
        <SkribblLogo />
        <nav className="hidden space-x-6 md:flex">
          <Link
            href="/platform/create"
            className="transition-colors hover:text-blue-500"
          >
            Create Room
          </Link>
          <Link
            href="/platform/join"
            className="transition-colors hover:text-blue-500"
          >
            Join Room
          </Link>
        </nav>
        <Button
          className="bg-blue-600"
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          Log Out
        </Button>
      </header>

      <main className="flex flex-col items-center justify-center px-4 py-12 text-center md:py-24">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-3xl font-bold md:text-4xl"
        >
          Choose Your Flow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 max-w-2xl text-lg text-gray-400 md:text-xl"
        >
          Select how you'd like to start your skribbl.ai experience!
        </motion.p>

        <div className="grid w-full max-w-lg grid-cols-1 gap-20 md:grid-cols-2 lg:max-w-3xl">
          <OptionCard
            icon={<Users className="mb-4 h-12 w-12" />}
            title="Join a Room"
            description="Enter an existing room and collaborate with others."
            onClick={() => router.push("/platform/join")}
          />
          <OptionCard
            icon={<PlusCircle className="mb-4 h-12 w-12" />}
            title="Create a Room"
            description="Start a new room and invite others to join you."
            onClick={() =>
              router.push(
                `/platform/create?id=${Math.random().toString(36).substring(7)}`,
              )
            }
          />
        </div>
        <div className="mt-16 flex flex-col items-center justify-center">
          <div className="mr-4 text-sm text-gray-400">Not interested?</div>
          <Button
            variant="link"
            onClick={() => router.push("/platform/freeplay")}
          >
            Yeah, no thanks. I just want to skribbl on my own.
          </Button>
        </div>
      </main>
    </div>
  );
}

function OptionCard({ icon, title, description, onClick }) {
  return (
    <>
      <BackgroundGradient className={cn("group relative w-full rounded-3xl")}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex w-full flex-col items-center justify-center rounded-3xl bg-black/70 p-6 text-white shadow-lg transition-colors group-hover:bg-black/80"
          onClick={onClick}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {icon}
          </motion.div>
          <h2 className="mb-2 mt-4 text-2xl font-semibold">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </motion.button>
      </BackgroundGradient>
    </>
  );
}
