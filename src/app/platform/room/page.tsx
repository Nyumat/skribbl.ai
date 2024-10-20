/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";

import {
  setUserPreferences,
  Tldraw,
  TLShape,
  TLShapeId,
  track,
  useEditor,
} from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, MessageSquare, X } from "lucide-react";
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

export type ShapeWithMyMeta = TLShape & {
  meta: { userId: string; updatedBy: string; updatedAt: number };
};

type GameImages = {
  userId: string;
  image: string;
};

export default function RoomPage({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [timesUp, setTimesUp] = useState(false);
  const [timeLimit, setTimeLimit] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const router = useRouter();
  const roomCode = searchParams.code as string;
  const editorRef = useRef(null);
  const { data } = useSession();
  const userId = data?.user?.id;
  const store = useSyncDemo({ roomId: roomCode });
  const [userShapes, setUserShapes] = useState<Record<string, TLShapeId[]>>({});
  const [images, setImages] = useState<GameImages[]>([]);
  const [prompt, setPrompt] = useState<string>();
  const utils = api.useUtils();
  const getScore = api.judge.getScore.useMutation();

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
  });

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
    }
  }, [userId]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.sideEffects.registerAfterCreateHandler(
        "shape",
        (shape) => {
          setUserShapes((prev) => ({
            ...prev,
            [shape.meta.userId]: [...(prev[shape.meta.userId] || []), shape.id],
          }));
        },
      );
    }
  }, [editorRef.current]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLimit > 0) {
        setTimeLimit((prev) => prev - 1);
      } else {
        setTimesUp(true);
        setIsGameOver(true);
        if (timesUp) {
          editorRef.current.updateInstanceState({
            isReadonly: true,
            isToolLocked: true,
          });
          exportShapesForAllUsers();
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
    setTimeLimit(10);
    setTimesUp(false);
    setIsGameOver(false);
    setWinner(null);
  };

  const exportShapesForAllUsers = async () => {
    const imageScores = [];

    for (const [userId, shapeIds] of Object.entries(userShapes)) {
      const svg = await editorRef.current.getSvg(shapeIds);
      if (svg) {
        const svgString = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = async () => {
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

          // Convert to base64
          const base64Image = canvas.toDataURL("image/png").split(",")[1]; // Remove data URL prefix

          // Use the trpc function to get the score
          try {
            const scoreResponse = await getScore.mutateAsync({
              image: base64Image,
              text: prompt || "Sample text or description for the image",
            });

            console.log(scoreResponse);

            // Check if the response has a score, and push it if it does
            if (scoreResponse && "score" in scoreResponse) {
              imageScores.push({ userId, score: scoreResponse.score });

              // Determine winner if all scores are processed
              if (imageScores.length === Object.keys(userShapes).length) {
                const winner = imageScores.reduce(
                  (max, entry) => (entry.score > max.score ? entry : max),
                  { score: 0 },
                );
                setWinner(winner.userId);
                console.log("winner: ", winner);
              }
            }

            console.log("image scores", imageScores);
          } catch (error) {
            console.error("Failed to get score:", error);
          }
        };

        img.src = url;
        setImages((prev) => [...prev, { userId, image: url }]);
      }
    }
  };

  const handleGoBack = () => {
    const allShapes = editorRef.current.getCurrentPageShapes();
    const shapeIds = allShapes.map((shape: { id: string }) => shape.id);
    editorRef.current.deleteShapes(shapeIds);
    router.push("/platform/choose");
  };

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
              editorRef.current.getInitialMetaForShape = (_shape) => {
                return {
                  updatedBy: userId,
                  updatedAt: Date.now(),
                  userId: userId,
                };
              };

              editor.sideEffects.registerBeforeChangeHandler(
                "shape",
                (_prev, next, source) => {
                  if (source !== "user") return next;
                  return {
                    ...next,
                    meta: {
                      updatedBy: userId,
                      updatedAt: Date.now(),
                      userId: userId,
                    },
                  };
                },
              );
            }}
          >
            <MetaUiHelper />
          </Tldraw>
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

      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          >
            <EnhancedGameOverDialog
              winner={winner}
              isOpen={isGameOver}
              onClose={() => setIsGameOver(false)}
              onRestart={handleRestart}
              onGoBack={handleGoBack}
              player1Drawing={
                images.find((img) => img.userId === userId)?.image
              }
              player2Drawing={
                images.find((img) => img.userId !== userId)?.image
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
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

const MetaUiHelper = track(function MetaUiHelper() {
  const editor = useEditor();
  const onlySelectedShape =
    editor.getOnlySelectedShape() as ShapeWithMyMeta | null;

  return (
    <pre
      style={{
        position: "absolute",
        zIndex: 300,
        top: 64,
        left: 12,
        margin: 0,
      }}
    >
      {onlySelectedShape
        ? JSON.stringify(onlySelectedShape.meta, null, "\t")
        : "Select one shape to see its meta data."}
    </pre>
  );
});

const EnhancedGameOverDialog = ({
  winner,
  isOpen,
  onClose,
  onRestart,
  onGoBack,
  player1Drawing,
  player2Drawing,
}) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  //   const [winner, setWinner] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      const loadImage = (src) => {
        return new Promise((resolve) => {
          if (!src) resolve(false);
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = src;
        });
      };

      const [img1Loaded, img2Loaded] = await Promise.all([
        loadImage(player1Drawing),
        loadImage(player2Drawing),
      ]);

      setImagesLoaded(true);

      //   if (img1Loaded && !img2Loaded) setWinner("player1");
      //   else if (!img1Loaded && img2Loaded) setWinner("player2");
      //   else if (img1Loaded && img2Loaded) setWinner("draw");
      //   else setWinner("no-drawings");
    };

    loadImages();
  }, [player1Drawing, player2Drawing]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Game Over</DialogTitle>
          <DialogDescription className="text-gray-300">
            {winner === "no-drawings"
              ? "No drawings were submitted."
              : "View the final drawings and see the result!"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!imagesLoaded && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-64 items-center justify-center"
            >
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </motion.div>
          )}

          {imagesLoaded && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <ResultDisplay winner={winner} />

              <div className="flex justify-between gap-4">
                <DrawingDisplay
                  src={player1Drawing}
                  alt="Player 1 Drawing"
                  isWinner={winner === "player1"}
                  playerNumber={1}
                />
                <DrawingDisplay
                  src={player2Drawing}
                  alt="Player 2 Drawing"
                  isWinner={winner === "player2"}
                  playerNumber={2}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className={cn("mt-6 flex gap-2")}>
          <Button onClick={onRestart} className="bg-blue-600 hover:bg-blue-700">
            Restart
          </Button>
          <Button
            variant="outline"
            onClick={onGoBack}
            className="bg-gray-700 hover:bg-gray-600"
          >
            Go Back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ResultDisplay = ({ winner }) => {
  let message = "";
  let bgColor = "";

  switch (winner) {
    case "player1":
      message = "Player 1 wins!";
      bgColor = "bg-green-600";
      break;
    case "player2":
      message = "Player 2 wins!";
      bgColor = "bg-green-600";
      break;
    case "draw":
      message = "It's a draw!";
      bgColor = "bg-yellow-600";
      break;
    case "no-drawings":
      message = "No drawings submitted";
      bgColor = "bg-red-600";
      break;
  }

  return (
    <motion.div
      className={`${bgColor} rounded-lg p-4`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="text-center text-lg font-semibold">{message}</p>
    </motion.div>
  );
};

const DrawingDisplay = ({ src, alt, isWinner, playerNumber }) => (
  <motion.div
    className="relative w-full"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {src ? (
      <img
        src={src}
        alt={alt}
        className="h-auto w-1/2 rounded-lg border-2 border-gray-700"
      />
    ) : (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-gray-700 bg-gray-800">
        <p className="text-gray-400">No drawing from Player {playerNumber}</p>
      </div>
    )}
    {isWinner && (
      <motion.div
        className="absolute inset-0 flex items-center justify-center rounded-lg bg-green-500 bg-opacity-70"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <span className="text-3xl font-bold text-white drop-shadow-lg">
          Winner!
        </span>
      </motion.div>
    )}
  </motion.div>
);
