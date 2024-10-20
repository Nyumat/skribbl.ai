"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  MessageSquare,
  Mic,
  PlusCircle,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SkribblLogo } from "~/components/logo";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState("");
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableAudio, setEnableAudio] = useState(true);
  const [enableChat, setEnableChat] = useState(true);
  const router = useRouter();
  const createRoomMutation = api.hms.createRoom.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Step 1: Create a Room via tRPC
      const roomResponse = await createRoomMutation.mutateAsync({
        name: roomName, // Using the room name from the form input
        role: "host", // Passing the role to the tRPC procedure
      });

      // Step 2: Redirect to the room lobby if successful
      if (roomResponse) {
        // Store any necessary data if needed (e.g., token)
        router.push(`/platform/room/${roomResponse.roomDetails.id}/lobby`);
      }
    } catch (error) {
      console.error("Error creating room:", error);
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
          <PlusCircle className="mx-auto mb-4 h-16 w-16 text-blue-500" />
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Create a Room</h1>
          <p className="text-gray-400">Set up your skribbl.ai room details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="roomName"
              className="mb-1 block text-sm font-medium text-gray-400"
            >
              Room Name
            </Label>
            <Input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              className="w-full rounded-lg bg-gray-800 px-4 py-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-4">
            <ToggleOption
              icon={<Video className="h-5 w-5" />}
              label="Enable Video"
              isEnabled={enableVideo}
              setIsEnabled={setEnableVideo}
            />
            <ToggleOption
              icon={<Mic className="h-5 w-5" />}
              label="Enable Audio"
              isEnabled={enableAudio}
              setIsEnabled={setEnableAudio}
            />
            <ToggleOption
              icon={<MessageSquare className="h-5 w-5" />}
              label="Enable Chat"
              isEnabled={enableChat}
              setIsEnabled={setEnableChat}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-3 text-xl font-semibold transition-colors hover:bg-blue-600"
          >
            Create Room
            <Users className="ml-2 h-5 w-5" />
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
  );
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
        className={`h-6 w-12 rounded-full p-1 transition-colors ${
          isEnabled ? "bg-blue-500" : "bg-gray-600"
        }`}
        onClick={() => setIsEnabled(!isEnabled)}
      >
        <motion.div
          className="h-4 w-4 rounded-full bg-white"
          animate={{ x: isEnabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
