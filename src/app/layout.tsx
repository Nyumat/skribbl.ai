import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = {
    metadataBase: new URL("https://drawing-is-for-kids-they-say.vercel.app/"),
    title: "Skribbl.ai - The Gameified Whiteboard for Friends, Teams, and Collaboration",
    description: "skribbl.ai is a gameified whiteboard for friends, teams, and collaboration. Play games, draw, and have fun with your friends!",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    openGraph: {
        title: "Skribbl.ai - The Gameified Whiteboard for Friends, Teams, and Collaboration",
        description: "skribbl.ai is a gameified whiteboard for friends, teams, and collaboration. Play games, draw, and have fun with your friends!",
        images: [{ url: "/og.png" }],
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TRPCReactProvider>{children}</TRPCReactProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
