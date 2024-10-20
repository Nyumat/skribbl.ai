/* eslint-disable react/no-unescaped-entities */
'use client'
import { motion } from 'framer-motion'
import { PlusCircle, Users } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SkribblLogo } from '~/components/logo'
import { BackgroundGradient } from '~/components/ui/background-gradient'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export default function ChooseFlowPage() {
    const router = useRouter()
    return (
        <div className="min-h-screen">
            <header className="flex justify-between items-center p-4 md:p-6">
                <SkribblLogo />
                <nav className="hidden md:flex space-x-6">
                    <Link href="/platform/create" className="hover:text-blue-500 transition-colors">Create Room</Link>
                    <Link href="/platform/join" className="hover:text-blue-500 transition-colors">Join Room</Link>
                    <Link href="/platform/leaderboard" className="hover:text-blue-500 transition-colors">Leaderboard</Link>
                </nav>
                <Button className='bg-blue-600' onClick={() => {
                    signOut({ callbackUrl: '/' })
                }}>Log Out</Button>
            </header>

            <main className="flex flex-col items-center justify-center px-4 py-12 md:py-24 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold mb-6"
                >
                    Choose Your Flow
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl"
                >
                    Select how you'd like to start your skribbl.ai experience!
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full max-w-lg lg:max-w-3xl">
                    <OptionCard
                        icon={<Users className="w-12 h-12 mb-4" />}
                        title="Join a Room"
                        description="Enter an existing room and collaborate with others."
                        onClick={() => router.push('/platform/join')}
                    />
                    <OptionCard
                        icon={<PlusCircle className="w-12 h-12 mb-4" />}
                        title="Create a Room"
                        description="Start a new room and invite others to join you."
                        onClick={() => router.push(`/platform/create?id=${Math.random().toString(36).substring(7)}`)}
                    />
                </div>
                <div className="flex flex-col items-center justify-center mt-16">
                    <div className="text-gray-400 text-sm mr-4">Not interested?</div>
                    <Button variant='link' onClick={() => router.push('/platform/freeplay')}>Yeah, no thanks. I just want to skribbl on my own.</Button>
                </div>
            </main>
        </div >
    )
}

function OptionCard({ icon, title, description, onClick }) {
    return (
        <>
            <BackgroundGradient className={cn("group relative w-full rounded-3xl")}>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center p-6 w-full shadow-lg bg-black/70 rounded-3xl text-white transition-colors group-hover:bg-black/80"
                    onClick={onClick}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        {icon}
                    </motion.div>
                    <h2 className="text-2xl font-semibold mt-4 mb-2">{title}</h2>
                    <p className="text-gray-400">{description}</p>
                </motion.button>
            </BackgroundGradient>
        </>
    )
}