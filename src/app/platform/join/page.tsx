"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SkribblLogo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
// import { api } from "~/trpc/react";

export default function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();
  //   const joinRoomMutation = api.hms.joinRoom.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: add a procedure to join room
      //   const roomExists = await joinRoomMutation.mutateAsync({ roomCode });
      //   if (roomExists) {
      router.push(`/platform/room?code=${roomCode}`);
      //   } else {
      alert("Room does not exist. Please check the code and try again.");
      //   }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 font-sans text-white">
      <div className="absolute left-4 top-4 m-12">
        <Link href="/platform/choose">
          <ArrowLeft className="cursor-pointer text-blue-600" size={20} />
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
        <div className="mb-8 text-center">
          <Users className="mx-auto mb-4 h-16 w-16 text-blue-500" />
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Join a Room</h1>
          <p className="text-gray-400">Enter the room code to join the game</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter Room Code"
              className="w-full rounded-lg bg-gray-800 px-4 py-6 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <Button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-xl font-semibold transition-colors hover:bg-blue-600"
            disabled={roomCode.length < 4}
          >
            Join Room
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <Link
            href="/platform/create"
            className="text-blue-500 hover:underline"
          >
            Don&apos;t have a code? Create a new room
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
