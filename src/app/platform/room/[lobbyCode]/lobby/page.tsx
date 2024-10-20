"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Play, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SkribblLogo } from "~/components/logo";

const randomBoy = (name: string) => {
  return `https://avatar.iran.liara.run/public/boy?username=${name}`;
};

const randomGirl = (name: string) => {
  return `https://avatar.iran.liara.run/public/girl?username=${name}`;
};

interface User {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
}

export default function LobbyPage({
  params,
}: {
  params: { lobbyCode: string };
}) {
  const { lobbyCode } = params;
  const [users, setUsers] = useState<User[]>([]);
  const [roomCode, setRoomCode] = useState(lobbyCode);
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      if (users.length < 6) {
        const newUser: User = {
          id: `user-${users.length + 1}`,
          name: `Player ${users.length + 1}`,
          avatar:
            Math.random() > 0.5
              ? randomBoy(`Player ${users.length + 1}`)
              : randomGirl(`Player ${users.length + 1}`),
          isReady: Math.random() > 0.5,
        };
        setUsers((prevUsers) => [...prevUsers, newUser]);
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [users]);

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="absolute left-4 top-4 m-12">
        <Link href="/platform/choose">
          <ArrowLeft className="cursor-pointer text-blue-600" size={20} />
          <span className="text-sm">Back</span>
        </Link>
      </div>
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <SkribblLogo className="mx-auto mb-8" />
          <h1 className="mb-2 text-4xl font-bold">Lobby</h1>
          <p className="text-xl text-gray-400">Room Code: {roomCode}</p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg bg-gray-900 p-6">
              <h2 className="mb-4 flex items-center text-2xl font-semibold">
                <Users className="mr-2" /> Players
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {users.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <Avatar className="mb-2 h-20 w-20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                    <span
                      className={`text-sm ${user.isReady ? "text-green-500" : "text-yellow-500"}`}
                    >
                      {user.isReady ? "Ready" : "Not Ready"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-gray-900 p-6">
              <h2 className="mb-4 flex items-center text-2xl font-semibold">
                <Settings className="mr-2" /> Room Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="public-room">Public Room</Label>
                  <Switch
                    id="public-room"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>
                <div>
                  <Label htmlFor="share-link">Share Link</Label>
                  <div className="mt-1 flex">
                    <Input
                      id="share-link"
                      value={`${window.location.origin}/platform/room?code=${roomCode}`}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button
                      onClick={copyShareLink}
                      className="rounded-l-none"
                      variant="secondary"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full py-6 text-lg"
              size="lg"
              onClick={() => router.push(`/platform/room?code=${roomCode}`)}
            >
              <Play className="mr-2" /> Start Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
