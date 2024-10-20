/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { setUserPreferences, Tldraw, TLShape, TLShapeId, track, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Loader2, MessageSquare, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSyncDemo } from '@tldraw/sync';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkribblLogo } from '~/components/logo';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';

export type ShapeWithMyMeta = TLShape & { meta: { userId: string, updatedBy: string, updatedAt: number } };

type GameImages = {
    userId: string;
    image: string;
};

export default function RoomPage({
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(true);
    const [timesUp, setTimesUp] = useState(false);
    const [timeLimit, setTimeLimit] = useState(10);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const router = useRouter();
    const roomCode = searchParams.code as string
    const editorRef = useRef(null);
    const { data } = useSession();
    const userId = data?.user?.id;
    const store = useSyncDemo({ roomId: roomCode });
    const [userShapes, setUserShapes] = useState<Record<string, TLShapeId[]>>({});
    const [images, setImages] = useState<GameImages[]>([]);

    useEffect(() => {
        if (userId && editorRef.current) {
            editorRef.current.getInitialMetaForShape = (shape: TLShape) => {
                return {
                    userId: userId,
                };
            }
            setUserPreferences({
                colorScheme: "system",
                id: userId
            });
        }
    }, [userId]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.sideEffects.registerAfterCreateHandler('shape', (shape) => {
                setUserShapes((prev) => ({
                    ...prev,
                    [shape.meta.userId]: [...(prev[shape.meta.userId] || []), shape.id],
                }));
            });
        }
    }, [editorRef.current]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timeLimit > 0) {
                setTimeLimit((prev) => prev - 1)
            } else {
                setTimesUp(true)
                setIsGameOver(true)
                if (timesUp) {
                    editorRef.current.updateInstanceState({ isReadonly: true, isToolLocked: true });
                    exportShapesForAllUsers();
                }
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLimit, timesUp])

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const [messages, setMessages] = useState([
        { id: 1, user: 'Alice', text: 'Hello everyone!' },
        { id: 2, user: 'Bob', text: 'Hi Alice, ready to play?' },
    ])
    const [newMessage, setNewMessage] = useState('')

    const toggleChat = () => setIsChatOpen(!isChatOpen)

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, user: 'You', text: newMessage }])
            setNewMessage('')
        }
    }

    const handleRestart = () => {
        editorRef.current.updateInstanceState({ isReadonly: false, isToolLocked: false });
        const allShapes = editorRef.current.getCurrentPageShapes();
        const shapeIds = allShapes.map((shape: { id: string; }) => shape.id);
        editorRef.current.deleteShapes(shapeIds);
        setTimeLimit(10);
        setTimesUp(false);
        setIsGameOver(false);
        setWinner(null);
    };

    const exportShapesForAllUsers = async () => {
        for (const [userId, shapeIds] of Object.entries(userShapes)) {
            const svg = await editorRef.current.getSvg(shapeIds);
            if (svg) {
                const svgString = new XMLSerializer().serializeToString(svg);
                const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const pngUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = pngUrl;
                    link.download = `user_${userId}_shapes.png`;
                    link.click();
                    URL.revokeObjectURL(url);
                };
                img.src = url;
                setImages((prev) => [...prev, { userId, image: url }]);
                // TODO: Send to server
            }
        }
    };

    const handleGoBack = () => {
        const allShapes = editorRef.current.getCurrentPageShapes();
        const shapeIds = allShapes.map((shape: { id: string; }) => shape.id);
        editorRef.current.deleteShapes(shapeIds);
        router.push('/platform/choose');
    }

    return (
        <div className="flex h-screen bg-black text-white">
            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
                        <div className="p-4 flex items-center justify-between">
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
                        <div className="px-4 flex-1 min-h-full overflow-scroll pb-24">
                            {['Alice', 'Bob', 'Charlie'].map((name) => (
                                <div className='my-4' key={name}>
                                    <VideoFeed key={name} name={name} />
                                </div>
                            ))}
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70} minSize={30} maxSize={90}>
                    <Tldraw
                        className='min-h-screen'
                        store={store}
                        onMount={(editor) => {
                            editorRef.current = editor;
                            editorRef.current.getInitialMetaForShape = (_shape) => {
                                return {
                                    updatedBy: userId,
                                    updatedAt: Date.now(),
                                    userId: userId
                                }
                            }

                            editor.sideEffects.registerBeforeChangeHandler('shape', (_prev, next, source) => {
                                if (source !== 'user') return next
                                return {
                                    ...next,
                                    meta: {
                                        updatedBy: userId,
                                        updatedAt: Date.now(),
                                        userId: userId
                                    },
                                }
                            })
                        }} >
                        <MetaUiHelper />
                    </Tldraw>
                </ResizablePanel>
            </ResizablePanelGroup>
            <AnimatePresence mode="popLayout">
                {isChatOpen && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 25,
                            mass: 1,
                            velocity: 2,
                            ease: [0.42, 0, 0.58, 1]
                        }}
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
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
                    >
                        <EnhancedGameOverDialog
                            isOpen={isGameOver}
                            onClose={() => setIsGameOver(false)}
                            onRestart={handleRestart}
                            onGoBack={handleGoBack}
                            player1Drawing={images.find((img) => img.userId === userId)?.image}
                            player2Drawing={images.find((img) => img.userId !== userId)?.image}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function VideoFeed({ name }: { name: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error accessing camera: ', err);
            }
        };

        startVideo();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
                videoRef.current = null;
            }
        };
    }, []);

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
            </div>
            <div className="p-2">
                <h3 className="text-lg font-semibold">{name}</h3>
            </div>
        </div>
    );
}

const MetaUiHelper = track(function MetaUiHelper() {
    const editor = useEditor()
    const onlySelectedShape = editor.getOnlySelectedShape() as ShapeWithMyMeta | null

    return (
        <pre style={{ position: 'absolute', zIndex: 300, top: 64, left: 12, margin: 0 }}>
            {onlySelectedShape
                ? JSON.stringify(onlySelectedShape.meta, null, '\t')
                : 'Select one shape to see its meta data.'}
        </pre>
    )
})

const EnhancedGameOverDialog = ({
    isOpen,
    onClose,
    onRestart,
    onGoBack,
    player1Drawing,
    player2Drawing
}) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [winner, setWinner] = useState(null);

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
                loadImage(player2Drawing)
            ]);

            setImagesLoaded(true);

            if (img1Loaded && !img2Loaded) setWinner('player1');
            else if (!img1Loaded && img2Loaded) setWinner('player2');
            else if (img1Loaded && img2Loaded) setWinner('draw');
            else setWinner('no-drawings');
        };

        loadImages();
    }, [player1Drawing, player2Drawing]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] bg-gray-900 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Game Over</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        {winner === 'no-drawings' ? 'No drawings were submitted.' : 'View the final drawings and see the result!'}
                    </DialogDescription>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {!imagesLoaded && (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-center items-center h-64"
                        >
                            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
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
                                    isWinner={winner === 'player1'}
                                    playerNumber={1}
                                />
                                <DrawingDisplay
                                    src={player2Drawing}
                                    alt="Player 2 Drawing"
                                    isWinner={winner === 'player2'}
                                    playerNumber={2}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <DialogFooter className={cn("flex gap-2 mt-6")}>
                    <Button onClick={onRestart} className="bg-blue-600 hover:bg-blue-700">Restart</Button>
                    <Button variant="outline" onClick={onGoBack} className="bg-gray-700 hover:bg-gray-600">Go Back</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ResultDisplay = ({ winner }) => {
    let message = '';
    let bgColor = '';

    switch (winner) {
        case 'player1':
            message = 'Player 1 wins!';
            bgColor = 'bg-green-600';
            break;
        case 'player2':
            message = 'Player 2 wins!';
            bgColor = 'bg-green-600';
            break;
        case 'draw':
            message = "It's a draw!";
            bgColor = 'bg-yellow-600';
            break;
        case 'no-drawings':
            message = 'No drawings submitted';
            bgColor = 'bg-red-600';
            break;
    }

    return (
        <motion.div
            className={`${bgColor} p-4 rounded-lg`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <p className="text-lg font-semibold text-center">{message}</p>
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
            <img src={src} alt={alt} className="w-1/2 h-auto rounded-lg border-2 border-gray-700" />
        ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-lg border-2 border-gray-700">
                <p className="text-gray-400">No drawing from Player {playerNumber}</p>
            </div>
        )}
        {isWinner && (
            <motion.div
                className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-70 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
                <span className="text-white text-3xl font-bold drop-shadow-lg">Winner!</span>
            </motion.div>
        )}
    </motion.div>
);
