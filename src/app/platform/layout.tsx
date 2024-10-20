"use client";

import { SessionProvider } from 'next-auth/react';

export default function PlatformLayout({ children }) {
    return (
        <div>
            <SessionProvider>
                {children}
            </SessionProvider>
        </div>
    )
}
