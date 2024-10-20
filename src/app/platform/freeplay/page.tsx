/* eslint-disable react/no-unescaped-entities */
"use client";

import { setUserPreferences, Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function WhiteboardPage({
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const persistKey = searchParams.slug as string
    const { data } = useSession();
    const userId = data?.user?.id;
    useEffect(() => {
        if (userId) {
            setUserPreferences({
                colorScheme: "system",
                id: userId
            });
        }
    }, [userId]);
    return (
        <div className="flex h-screen bg-black text-white">
            <div className="flex-1 bg-gray-900 border border-gray-800">
                <Tldraw persistenceKey={userId} />
            </div>
        </div>
    )
}