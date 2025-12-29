/**
 * POSE SUGGESTION OVERLAY
 * Transparent overlay showing pose suggestions during countdown
 * Helps users know what pose to make for each photo
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Star, Smile, Users, Zap, ThumbsUp, Hand } from 'lucide-react';

interface PoseSuggestion {
    id: string;
    name: string;
    icon: any;
    description: string;
    emoji: string;
}

const POSE_SUGGESTIONS: PoseSuggestion[] = [
    { id: 'smile', name: 'Big Smile', icon: Smile, description: 'Show those pearly whites!', emoji: '😄' },
    { id: 'peace', name: 'Peace Sign', icon: Hand, description: 'Classic peace & love', emoji: '✌️' },
    { id: 'heart', name: 'Heart Hands', icon: Heart, description: 'Make a heart with your hands', emoji: '💕' },
    { id: 'star', name: 'Star Power', icon: Star, description: 'Strike a star pose!', emoji: '⭐' },
    { id: 'group', name: 'Group Hug', icon: Users, description: 'Get close together!', emoji: '🤗' },
    { id: 'energy', name: 'Jump Shot', icon: Zap, description: 'Jump in the air!', emoji: '⚡' },
    { id: 'thumbs', name: 'Thumbs Up', icon: ThumbsUp, description: 'Show your approval!', emoji: '👍' },
    { id: 'silly', name: 'Silly Face', icon: Smile, description: 'Make a funny face!', emoji: '🤪' },
];

interface PoseSuggestionOverlayProps {
    currentPhoto: number;
    totalPhotos: number;
    countdown: number;
    isVisible: boolean;
}

export function PoseSuggestionOverlay({
    currentPhoto,
    totalPhotos,
    countdown,
    isVisible,
}: PoseSuggestionOverlayProps) {
    // Select pose based on photo number
    const poseIndex = (currentPhoto - 1) % POSE_SUGGESTIONS.length;
    const currentPose = POSE_SUGGESTIONS[poseIndex];
    const Icon = currentPose.icon;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 pointer-events-none"
                >
                    {/* Semi-transparent dark overlay */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

                    {/* Top: Photo counter */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute top-8 left-1/2 -translate-x-1/2"
                    >
                        <div className="bg-pixxel-surface/90 backdrop-blur-md px-8 py-4 rounded-2xl border-2 border-pixxel-orange shadow-orange-strong">
                            <p className="text-2xl font-bold text-white text-center">
                                Photo <span className="text-pixxel-orange text-4xl">{currentPhoto}</span> of {totalPhotos}
                            </p>
                        </div>
                    </motion.div>

                    {/* Center: Pose suggestion */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="text-center max-w-2xl px-8"
                        >
                            {/* Pose icon with glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="mb-6"
                            >
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-pixxel-orange/30 blur-3xl rounded-full" />
                                    <div className="relative bg-gradient-to-br from-pixxel-orange to-pixxel-amber p-8 rounded-3xl shadow-orange-strong">
                                        <Icon className="w-24 h-24 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Pose name */}
                            <motion.h2
                                className="text-6xl font-black text-white mb-4"
                                animate={{
                                    textShadow: [
                                        '0 0 20px rgba(255, 140, 26, 0.5)',
                                        '0 0 40px rgba(255, 140, 26, 0.8)',
                                        '0 0 20px rgba(255, 140, 26, 0.5)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {currentPose.emoji} {currentPose.name}
                            </motion.h2>

                            {/* Pose description */}
                            <p className="text-3xl text-white/80 font-semibold mb-8">
                                {currentPose.description}
                            </p>

                            {/* Countdown number */}
                            <motion.div
                                key={countdown}
                                initial={{ scale: 1.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="relative inline-block"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-pixxel-orange/40 blur-2xl rounded-full"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.4, 0.7, 0.4],
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                <div className="relative text-9xl font-black text-white">
                                    {countdown}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Bottom: Get ready message */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="bg-pixxel-surface/90 backdrop-blur-md px-12 py-6 rounded-2xl border-2 border-pixxel-orange/50 shadow-orange-soft"
                        >
                            <div className="flex items-center gap-4">
                                <Camera className="w-8 h-8 text-pixxel-orange" />
                                <p className="text-2xl font-bold text-white">
                                    Get Ready! 📸
                                </p>
                                <Camera className="w-8 h-8 text-pixxel-orange" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-pixxel-orange/50 rounded-tl-3xl" />
                    <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-pixxel-orange/50 rounded-tr-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-pixxel-orange/50 rounded-bl-3xl" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-pixxel-orange/50 rounded-br-3xl" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
