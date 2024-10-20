/* eslint-disable react/no-unescaped-entities */
"use client";

import { setUserPreferences, Tldraw, TLShape, TLShapeId } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MessageSquare, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSyncDemo } from "@tldraw/sync";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SkribblLogo } from "~/components/logo";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function RoomPage({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [timesUp, setTimesUp] = useState(false);
  const TIME_LIMIT = 30;
  const [timeLimit, setTimeLimit] = useState(TIME_LIMIT);
  const router = useRouter();
  const roomCode = searchParams.code as string;
  const editorRef = useRef(null);
  const { data } = useSession();
  const userId = data?.user?.id;
  const store = useSyncDemo({ roomId: roomCode });
  const [userShapes, setUserShapes] = useState<Record<string, TLShapeId[]>>({});
  const [prompt, setPrompt] = useState<string>();
  const utils = api.useUtils();

  useEffect(() => {
    if (userId && editorRef.current) {
      editorRef.current.getInitialMetaForShape = (shape: TLShape) => {
        return {
          userId: userId,
        };
      };
      setUserPreferences({
        colorScheme: "system",
        id: userId,
      });

      const handleCreate = (shapes: TLShape[]) => {
        setUserShapes((prevShapes) => {
          const newShapes = { ...prevShapes };
          shapes.forEach((shape) => {
            const shapeUserId = shape.meta.userId as string;
            if (shapeUserId) {
              if (!newShapes[shapeUserId]) {
                newShapes[shapeUserId] = [];
              }
              newShapes[shapeUserId].push(shape.id);
            }
          });
          return newShapes;
        });
      };

      editorRef.current.on("create", handleCreate);

      const timer = setTimeout(() => {
        exportShapesForAllUsers();
      }, 10000);

      return () => {
        editorRef.current.off("create", handleCreate);
        clearTimeout(timer);
      };
    }
  }, [userId]);

  const fetchPrompt = async () => {
    if (userId) {
      try {
        const res = await utils.judge.getPrompt.fetch();
        if (res && "message" in res && res.message?.content) {
          setPrompt(res.message.content);
        } else {
          setPrompt(""); // Fallback to empty string if the structure is unexpected
        }
      } catch (error) {
        console.error("Error fetching prompt:", error);
      }
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, [userId]);

  const exportShapesForAllUsers = async () => {
    if (!editorRef.current) return;

    for (const [userId, shapeIds] of Object.entries(userShapes)) {
      const svg = await editorRef.current.getSvg(shapeIds);
      if (svg) {
        const svgString = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = `user_${userId}_shapes.png`;
          link.click();
          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLimit > 0) {
        setTimeLimit((prev) => prev - 1);
      } else {
        setTimesUp(true);
        if (timesUp) {
          editorRef.current.updateInstanceState({
            isReadonly: true,
            isToolLocked: true,
          });
        }
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimit, timesUp]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const [messages, setMessages] = useState([
    { id: 1, user: "Alice", text: "Hello everyone!" },
    { id: 2, user: "Bob", text: "Hi Alice, ready to play?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, user: "You", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  const handleRestart = () => {
    editorRef.current.updateInstanceState({
      isReadonly: false,
      isToolLocked: false,
    });
    const allShapes = editorRef.current.getCurrentPageShapes();
    const shapeIds = allShapes.map((shape: { id: string }) => shape.id);
    editorRef.current.deleteShapes(shapeIds);
    fetchPrompt();
    setTimeLimit(TIME_LIMIT);
    setTimesUp(false);
  };

  console.log({
    userShapes,
  });

  return (
    <div className="flex h-screen bg-black text-white">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <div className="flex h-full flex-col border-r border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between p-4">
              <SkribblLogo />
              <div className="flex items-center space-x-2">
                <Link href="/platform/choose">
                  <ArrowLeft
                    className="cursor-pointer text-blue-600"
                    size={20}
                  />
                  <span className="text-sm">Leave</span>
                </Link>
              </div>
            </div>
            <Separator />
            <p className="max-w-2xl text-center text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl">
              {prompt}
            </p>
            <Separator />
            <div className="min-h-full flex-1 overflow-scroll px-4 pb-24">
              {["Alice", "Bob", "Charlie"].map((name) => (
                <div className="my-4" key={name}>
                  <VideoFeed key={name} name={name} />
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={30} maxSize={90}>
          <Tldraw
            className="min-h-screen"
            store={store}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      <AnimatePresence mode="popLayout">
        {isChatOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              mass: 1,
              velocity: 2,
              ease: [0.42, 0, 0.58, 1],
            }}
            className="flex w-80 flex-col border-l border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
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
            <form
              onSubmit={sendMessage}
              className="border-t border-gray-800 p-4"
            >
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
          className="fixed bottom-4 left-4 z-50"
          onClick={toggleChat}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={timesUp}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>Game Over</DialogTitle>
            <DialogDescription>
              The game is over. Would you like to restart or go back to the main
              menu?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={cn("flex gap-2")}>
            <Button onClick={handleRestart}>Restart</Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/platform/choose")}
            >
              Go Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VideoFeed({ name }: { name: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        videoRef.current = null;
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-lg bg-gray-800">
      <div className="flex aspect-video items-center justify-center bg-gray-700">
        <video ref={videoRef} autoPlay className="h-full w-full object-cover" />
      </div>
      <div className="p-2">
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
    </div>
  );
}
