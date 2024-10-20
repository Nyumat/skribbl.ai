import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SkribblLogo } from '~/components/logo'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
export default function JoinRoomPage() {
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center">
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
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <h1 className="text-3xl font-bold">Join a Room</h1>
                        <p className="text-gray-400">Ask your room host for the room code.</p>
                    </CardHeader>
                    <CardContent>
                        <Label>Room Code</Label>
                        <Input placeholder="Enter the room code" />
                    </CardContent>
                    <CardFooter>
                        {/* TODO: Make this route to said room */}
                        <Button className="w-full">Join Room</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}
