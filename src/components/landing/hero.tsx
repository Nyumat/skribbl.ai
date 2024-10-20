"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Github,
    MoveRight,
} from "lucide-react";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function Hero({ session }: { session: Session | null }) {
    const router = useRouter();
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["Friends", "Teams", "Collaboration"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full">
            <div className="container mx-auto">
                <div className="flex gap-8 py-12 items-center justify-center flex-col">
                    <div>
                        <Button variant="secondary" size="sm" className="gap-4" onClick={() => window.open("https://devpost.com/software/skribbl.ai")}>
                            skribbl.ai on devpost! <MoveRight className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
                            <span className="text-spektr-cyan-50">The Gameified Whiteboard for</span>
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-semibold"
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
                            skribbl.ai is a gameified whiteboard platform that allows users to play games like Pictionary, Charades, and more with their friends and teams.
                        </p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <Button size="lg" className={cn("gap-4 ring-1 ring-blue-600 hover:bg-blue-600")} variant="outline" onClick={() => {
                            if (session) {
                                router.push("/platform/choose");
                            } else {
                                router.push("/auth/signup");
                            }
                        }}>
                            Get started <ArrowRight className="w-6 h-6" />
                        </Button>
                        <Button size="lg" className="gap-2" variant="secondary">
                            GitHub <Github className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};