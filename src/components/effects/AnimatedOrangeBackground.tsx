/**
 * ANIMATED ORANGE BACKGROUND
 * Dynamic gradient background with Sunrise Orange theme
 * Replaces video backgrounds with pure CSS/Framer Motion animations
 */

import { motion } from 'framer-motion';

interface AnimatedOrangeBackgroundProps {
    variant?: 'default' | 'subtle' | 'intense';
}

export function AnimatedOrangeBackground({
    variant = 'default'
}: AnimatedOrangeBackgroundProps) {
    const variants = {
        default: {
            primary: 'rgba(255, 140, 26, 0.15)',
            secondary: 'rgba(255, 184, 77, 0.12)',
            tertiary: 'rgba(230, 122, 0, 0.1)',
        },
        subtle: {
            primary: 'rgba(255, 140, 26, 0.08)',
            secondary: 'rgba(255, 184, 77, 0.06)',
            tertiary: 'rgba(230, 122, 0, 0.05)',
        },
        intense: {
            primary: 'rgba(255, 140, 26, 0.25)',
            secondary: 'rgba(255, 184, 77, 0.2)',
            tertiary: 'rgba(230, 122, 0, 0.18)',
        },
    };

    const colors = variants[variant];

    return (
        <div className="absolute inset-0 overflow-hidden bg-pixxel-black">
            {/* Base gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(26, 32, 50, 0.8) 0%, rgba(11, 14, 20, 1) 100%)',
                }}
            />

            {/* Animated gradient orbs */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
                style={{
                    background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
                    top: '10%',
                    left: '15%',
                }}
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
                style={{
                    background: `radial-gradient(circle, ${colors.secondary} 0%, transparent 70%)`,
                    top: '50%',
                    right: '10%',
                }}
                animate={{
                    x: [0, -80, 0],
                    y: [0, -60, 0],
                    scale: [1, 1.15, 1],
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2,
                }}
            />

            <motion.div
                className="absolute w-[700px] h-[700px] rounded-full blur-[110px]"
                style={{
                    background: `radial-gradient(circle, ${colors.tertiary} 0%, transparent 70%)`,
                    bottom: '15%',
                    left: '25%',
                }}
                animate={{
                    x: [0, -50, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 4,
                }}
            />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        background: `rgba(255, 140, 26, ${0.3 + Math.random() * 0.3})`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        boxShadow: '0 0 10px rgba(255, 140, 26, 0.5)',
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50 - 25, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Subtle grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 140, 26, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 140, 26, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(11, 14, 20, 0.7) 100%)',
                }}
            />
        </div>
    );
}
