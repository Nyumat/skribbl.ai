import { ArrowLeft } from "lucide-react";
import { getProviders } from "next-auth/react";
import Link from "next/link";
import { SkribblLogo } from "~/components/logo";
import { SignInCard } from "./client-comp";

export default async function SignIn() {
    const providers = await getProviders();
    return (
        <div className="space-y-12 py-24">
            <div className="absolute top-4 left-4 m-12">
                <Link href="/">
                    <ArrowLeft
                        className="cursor-pointer text-blue-600"
                        size={20}
                    />
                    <span className="text-sm">Back</span>
                </Link>
            </div>
            <div>
                <div className="flex justify-center mr-2">
                    <SkribblLogo />
                </div>
            </div>
            <SignInCard providers={providers} />
        </div>
    );
}