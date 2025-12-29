import { motion, AnimatePresence } from 'framer-motion';
import { Camera, XCircle, Timer, Move } from 'lucide-react';

interface InstructionModalProps {
    isVisible: boolean;
    onDismiss: () => void;
}

export function InstructionModal({ isVisible, onDismiss }: InstructionModalProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="w-full max-w-2xl overflow-hidden relative"
                    >
                        {/* Glass Container */}
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 to-black/95 backdrop-blur-xl border border-pixxel-orange/30 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.6)]" />

                        <div className="relative z-10 p-10 flex flex-col items-center text-center">

                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <Camera className="w-8 h-8 text-pixxel-orange drop-shadow-[0_0_10px_rgba(255,140,26,0.6)]" strokeWidth={2.5} />
                                    <h2 className="text-4xl font-black text-white tracking-tight">
                                        CAPTURE INSTRUCTIONS
                                    </h2>
                                </div>
                                {/* Animated Underline */}
                                <motion.div
                                    className="h-1 w-full bg-gradient-to-r from-transparent via-pixxel-orange to-transparent rounded-full"
                                    animate={{ scaleX: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            </div>

                            {/* Instructions Grid */}
                            <div className="grid gap-4 w-full mb-10">
                                <InstructionCard
                                    icon={XCircle}
                                    title="No Retakes"
                                    description="Once a photo is captured, it cannot be retaken."
                                    delay={0.1}
                                />
                                <InstructionCard
                                    icon={Move}
                                    title="Pose Carefully"
                                    description="Make sure your pose and position are correct."
                                    delay={0.2}
                                />
                                <InstructionCard
                                    icon={Timer}
                                    title="5-Second Auto Capture"
                                    description="Each photo is taken after a 5-second gap. Be ready."
                                    delay={0.3}
                                />
                            </div>

                            {/* CTA Button */}
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 30px rgba(255,140,26,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onDismiss}
                                className="w-full py-6 rounded-2xl bg-gradient-to-r from-pixxel-orange to-[#FFB347] text-white text-2xl font-black tracking-wide shadow-lg relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    GOT IT, START CAPTURE 📸
                                </span>
                            </motion.button>

                            <p className="mt-4 text-white/40 text-sm font-medium">
                                Tap button to begin immediate capture
                            </p>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function InstructionCard({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pixxel-orange/30 transition-colors group text-left"
        >
            <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center border border-white/10 group-hover:border-pixxel-orange/50 transition-colors shrink-0">
                <Icon className="w-7 h-7 text-pixxel-orange" strokeWidth={2.5} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                <p className="text-white/60 font-medium leading-tight">{description}</p>
            </div>
        </motion.div>
    );
}
