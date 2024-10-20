'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, Mic, PlusCircle, Users, Video } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { SkribblLogo } from '~/components/logo'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export default function CreateRoomPage() {
    const [roomName, setRoomName] = useState('')
    const [enableVideo, setEnableVideo] = useState(true)
    const [enableAudio, setEnableAudio] = useState(true)
    const [enableChat, setEnableChat] = useState(true)
    const router = useRouter();
    const handleSubmit = (e: React.FormEvent) => {
        // TODO: Create 100ms SDK Room! :P
        e.preventDefault()
        router.push(`/platform/room/${crypto.randomUUID()}/lobby`)
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
                    <PlusCircle className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Create a Room</h1>
                    <p className="text-gray-400">Set up your skribbl.ai room details</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="roomName" className="block text-sm font-medium text-gray-400 mb-1">
                            Room Name
                        </Label>
                        <Input
                            type="text"
                            id="roomName"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Enter room name"
                            className="w-full px-4 py-6 bg-gray-800 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <ToggleOption
                            icon={<Video className="w-5 h-5" />}
                            label="Enable Video"
                            isEnabled={enableVideo}
                            setIsEnabled={setEnableVideo}
                        />
                        <ToggleOption
                            icon={<Mic className="w-5 h-5" />}
                            label="Enable Audio"
                            isEnabled={enableAudio}
                            setIsEnabled={setEnableAudio}
                        />
                        <ToggleOption
                            icon={<MessageSquare className="w-5 h-5" />}
                            label="Enable Chat"
                            isEnabled={enableChat}
                            setIsEnabled={setEnableChat}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full px-4 py-3 bg-blue-500 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                        Create Room
                        <Users className="ml-2 w-5 h-5" />
                    </motion.button>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <Link href="/platform/join" className="text-blue-500 hover:underline">
                        Already have a room code? Join an existing room
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}

function ToggleOption({ icon, label, isEnabled, setIsEnabled }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                {icon}
                <span className="ml-2 text-gray-300">{label}</span>
            </div>
            <button
                type="button"
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isEnabled ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                onClick={() => setIsEnabled(!isEnabled)}
            >
                <motion.div
                    className="w-4 h-4 bg-white rounded-full"
                    animate={{ x: isEnabled ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </button>
        </div>
    )
}