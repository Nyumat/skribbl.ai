"use client";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignInBtn } from "~/components/signin-btn";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export function SignInCard({ providers }: any) {
    return (
        <Card className="w-[350px] mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                <CardDescription className="text-center">
                    Welcome to skribbl.ai 🎉
                    <br />
                    Login to continue.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignInBtn providers={providers} />
            </CardContent>
        </Card >
    );
}