/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { SkribblLogo } from '~/components/logo';
import { Button } from '~/components/ui/button';

export default function JoinRoomPage() {
    const [roomCode, setRoomCode] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Joining room with code:', roomCode)

    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 left-4 m-12">
                <Link href="/platform/choose">
                    <ArrowLeft
                        className="cursor-pointer text-blue-600"
                        size={20}
                    />
                    <span className="text-sm">Back</span>
                </Link>
            </div>
            <SkribblLogo className="mb-8" />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Users className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Join a Room</h1>
                    <p className="text-gray-400">Enter the room code to join the game</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            placeholder="Enter room code"
                            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-2xl text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-600"
                            maxLength={6}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full px-4 py-3 bg-blue-500 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
                        disabled={roomCode.length < 4}
                    >
                        Join Room
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <Link href="/platform/create" className="text-blue-500 hover:underline">
                        Don't have a code? Create a new room
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}