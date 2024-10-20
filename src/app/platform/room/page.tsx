/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X } from 'lucide-react'
import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

export default function RoomPage({
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [messages, setMessages] = useState([
        { id: 1, user: 'Alice', text: 'Hello everyone!' },
        { id: 2, user: 'Bob', text: 'Hi Alice, ready to play?' },
    ])
    const [newMessage, setNewMessage] = useState('')
    const roomCode = searchParams.code as string

    const toggleChat = () => setIsChatOpen(!isChatOpen)

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, user: 'You', text: newMessage }])
            setNewMessage('')
        }
    }

    return (
        <div className="flex h-screen bg-black text-white">
            <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 p-4">
                    <VideoFeed name="Alice" />
                    <VideoFeed name="Bob" />
                </div>
                <div className="flex-1 bg-gray-900 border border-gray-800">
                    <Tldraw />
                </div>
            </div>

            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col"
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-800">
                            <h2 className="text-xl font-semibold">Chat</h2>
                            <Button variant="ghost" size="icon" onClick={toggleChat}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className="mb-4">
                                    <span className="font-semibold">{msg.user}: </span>
                                    <span>{msg.text}</span>
                                </div>
                            ))}
                        </ScrollArea>
                        <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1"
                                />
                                <Button type="submit">Send</Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isChatOpen && (
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed bottom-4 right-4"
                    onClick={toggleChat}
                >
                    <MessageSquare className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}

function VideoFeed({ name }: { name: string }) {
    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <span className="text-2xl">{name}'s Video</span>
            </div>
            <div className="p-2">
                <h3 className="text-lg font-semibold">{name}</h3>
            </div>
        </div>
    )
}