/* eslint-disable react/no-unescaped-entities */
"use client";

import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

export default function WhiteboardPage({
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
    }) {
    const persistKey = searchParams.slug as string
    return (
        <div className="flex h-screen bg-black text-white">
            <div className="flex-1 bg-gray-900 border border-gray-800">
                <Tldraw />
            </div>
        </div>
    )
}