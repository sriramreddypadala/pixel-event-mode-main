/**
 * TOUCH RIPPLE EFFECT
 * Creates animated orange ripples on touch/click for visual feedback
 * Enhances user interaction with celebratory animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

interface Ripple {
    id: number;
    x: number;
    y: number;
}

export function TouchRippleEffect() {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const createRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        let x: number, y: number;

        if ('touches' in event) {
            // Touch event
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
        } else {
            // Mouse event
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        const newRipple: Ripple = {
            id: Date.now(),
            x,
            y,
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation completes
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1000);
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[100]"
            onMouseDown={createRipple as any}
            onTouchStart={createRipple as any}
            style={{ pointerEvents: 'none' }}
        >
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            background: 'radial-gradient(circle, rgba(255, 140, 26, 0.6) 0%, rgba(255, 140, 26, 0.3) 40%, transparent 70%)',
                        }}
                        initial={{
                            width: 0,
                            height: 0,
                            x: 0,
                            y: 0,
                            opacity: 1,
                        }}
                        animate={{
                            width: 300,
                            height: 300,
                            x: -150,
                            y: -150,
                            opacity: 0,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: 'easeOut',
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Sparkle particles on touch */}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <div key={`sparkles-${ripple.id}`}>
                        {[...Array(8)].map((_, i) => {
                            const angle = (i * 360) / 8;
                            const distance = 80;
                            return (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full pointer-events-none"
                                    style={{
                                        left: ripple.x,
                                        top: ripple.y,
                                        background: 'linear-gradient(135deg, #FF8C1A 0%, #FFB366 100%)',
                                        boxShadow: '0 0 10px rgba(255, 140, 26, 0.8)',
                                    }}
                                    initial={{
                                        x: 0,
                                        y: 0,
                                        scale: 1,
                                        opacity: 1,
                                    }}
                                    animate={{
                                        x: Math.cos((angle * Math.PI) / 180) * distance,
                                        y: Math.sin((angle * Math.PI) / 180) * distance,
                                        scale: 0,
                                        opacity: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: 'easeOut',
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}

/**
 * INTERACTIVE TOUCH WRAPPER
 * Wraps content and enables touch ripple effects
 */
interface TouchInteractiveProps {
    children: React.ReactNode;
    enableRipple?: boolean;
}

export function TouchInteractive({ children, enableRipple = true }: TouchInteractiveProps) {
    return (
        <div className="relative w-full h-full">
            {children}
            {enableRipple && <TouchRippleEffect />}
        </div>
    );
}
