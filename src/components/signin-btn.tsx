"use client";

import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { GithubIcon } from "lucide-react";
import { type BuiltInProviderType } from "next-auth/providers/index";
import {
    signIn,
    type ClientSafeProvider,
    type LiteralUnion,
} from "next-auth/react";
import { match } from "ts-pattern";
import { Button } from "./ui/button";

interface SignInProps {
    providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null;
}

export function SignInBtn({ providers }: SignInProps) {
    if (!providers) {
        return null;
    }

    const buildProviderButton = (provider: ClientSafeProvider) => {
        const buttonContent = match(provider.id)
            .with("discord", () => (
                <>
                    <DiscordLogoIcon className="w-6 h-6" />
                    <span>Sign in with Discord</span>
                </>
            ))
            .with("github", () => (
                <>
                    <GithubIcon className="w-6 h-6" />
                    <span>Sign in with GitHub</span>
                </>
            )).otherwise(() => (
                <>
                    <span>Sign in with {provider.name}</span>
                </>
            ));
        return (
            <Button
                key={provider.id}
                className="w-full"
                onClick={async () =>
                    await signIn(provider.id, { callbackUrl: "/platform/choose" })
                }
                variant="outline"
            >
                {buttonContent}
            </Button>
        );
    };

    const providerButtons = Object.values(providers).map(buildProviderButton);

    return <>{providerButtons}</>;
}
