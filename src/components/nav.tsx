"use client";

import { useState } from "react";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList
} from "~/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Menu, PencilRuler, Pyramid } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { ModeToggle } from "./mode-toggle";

const routeList = [
    { href: "/platform/create", label: "Create Room" },
    { href: "/platform/join", label: "Join Room" },
    { href: "/platform/leaderboard", label: "Leaderboard" },
];

export function Navbar() {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <header className="sticky md:relative top-0 z-40 max-w-7xl mx-auto w-screen bg-transparent backdrop-blur-lg flex justify-between items-center p-8">
            <NavigationMenu
                className={cn("flex justify-between items-center w-full max-w-full")}
            >
                <div className="flex justify-start align-middle items-center w-full">
                    <PencilRuler className="text-blue-600 translate-y-[0.8px]" />
                    <Link href="/" passHref className="ml-3 text-xl">
                        skribbl.ai
                    </Link>
                </div>
                {/* mobile */}
                <div className="flex md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger className="px-2" asChild>
                            <Button variant="ghost" className={cn("self-end")}>
                                <Menu className="h-5 w-5" onClick={() => setIsOpen(true)} />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side={"left"}>
                            <SheetHeader>
                                <SheetTitle className="font-bold text-xl">NextJudge</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                                <ModeToggle />
                                {routeList.map(({ href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                        className={buttonVariants({ variant: "ghost" })}
                                    >
                                        {label}
                                    </a>
                                ))}
                                <a
                                    href="https://github.com/nextjudge/nextjudge"
                                    target="_blank"
                                    className={`w-[110px] border ${buttonVariants({
                                        variant: "secondary",
                                    })}`}
                                >
                                    <GitHubLogoIcon className="mr-2 w-5 h-5" />
                                    Github
                                </a>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
                {/* desktop */}
                <NavigationMenuList className="hidden md:flex justify-center items-center w-full">
                    {routeList.map((route, i) => (
                        <a
                            href={route.href}
                            key={i}
                            className={`text-[17px] ${buttonVariants({
                                variant: "ghost",
                            })}`}
                        >
                            {route.label}
                        </a>
                    ))}
                </NavigationMenuList>
                <div className="hidden md:flex justify-end w-full">
                    <NavigationMenuItem className="flex items-center justify-end gap-4">
                        <ModeToggle />
                        <div className="flex items-center gap-0">
                            <Link
                                href="/auth/signup"
                                className={cn(
                                    `text-base text-black dark:text-white ${buttonVariants({
                                        variant: "link",
                                    })}`
                                )}
                            >
                                Login / Sign Up
                            </Link>
                        </div>
                    </NavigationMenuItem>
                </div>
            </NavigationMenu>
        </header>
    );
}

const ListItem: React.FC<{
    title: string;
    href: string;
    description: string;
    disabled?: boolean;
    external?: boolean;
}> = ({
    title,
    href,
    description,
    disabled,
    external,
}) => {
        const target = external ? "_blank" : undefined;

        return (
            <a
                href={disabled ? undefined : href}
                target={target}
                className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    disabled
                        ? "text-muted-foreground hover:bg-transparent hover:text-muted-foreground"
                        : ""
                )}
            >
                <div className="flex items-center justify-between">
                    <span className="mr-2">{title}</span>
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {description}
                </p>
            </a>
        );
    };

ListItem.displayName = "ListItem";

export function PlatformNavbar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-neutral-500/40 dark:bg-background">
            <div className="container h-14 px-4 w-screen flex justify-between ">
                <div className="font-bold flex items-center">
                    <Pyramid className="w-10 h-10" />
                    <a href="/" className="ml-3 font-bold text-xl flex">
                        NextJudge
                    </a>
                </div>
                <div className="flex md:hidden">
                    <ModeToggle />
                    {/* mobile */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger className="px-2">
                            <Menu
                                className="flex md:hidden h-5 w-5"
                                onClick={() => setIsOpen(true)}
                            >
                                <span className="sr-only">Menu Icon</span>
                            </Menu>
                        </SheetTrigger>

                        <SheetContent side={"left"}>
                            <SheetHeader>
                                <SheetTitle className="font-bold text-xl">NextJudge</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                                {routeList.map(({ href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                        className={buttonVariants({ variant: "ghost" })}
                                    >
                                        {label}
                                    </a>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden md:flex gap-4 justify-center items-center">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}