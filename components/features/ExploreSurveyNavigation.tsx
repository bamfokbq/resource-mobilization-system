'use client'

import NcdStrategyNav from '@/components/features/NcdStrategyNav'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { HiChevronLeft, HiSparkles } from 'react-icons/hi2'
import { motion, AnimatePresence } from 'motion/react'

export default function ExploreSurveyNavigation() {
    const [isOpen, setIsOpen] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    // Auto-expand on hover when collapsed
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (!isOpen && isHovered) {
            timer = setTimeout(() => setIsOpen(true), 300)
        }
        return () => clearTimeout(timer)
    }, [isHovered, isOpen])

    return (
        <motion.div
            className="bg-navy-blue h-screen flex flex-col items-stretch justify-between relative shadow-2xl border-r border-white/10"
            initial={false}
            animate={{
                width: isOpen ? 320 : 72,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Overlay for depth */}
            <div className="absolute inset-0 bg-white/5 pointer-events-none" />

            {/* Header Section */}
            <motion.div
                className="flex items-center p-4 relative z-10"
                layout
            >
                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1"
                        >
                            <Link
                                href={'/'}
                                className="group text-white text-xl font-black flex items-center gap-2 hover:text-mint-green transition-all duration-300 transform hover:scale-105"
                            >
                                <HiSparkles className="w-6 h-6 text-mint-green group-hover:animate-pulse" />
                                <span className="text-white">
                                    NCD NAVIGATOR
                                </span>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:text-mint-green p-2 rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-95 backdrop-blur-sm"
                    aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 0 : 180 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <HiChevronLeft size={20} />
                    </motion.div>
                </motion.button>
            </motion.div>

            {/* Navigation Content */}
            <div className="flex-1 px-2 pb-4 relative z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="h-full"
                        >
                            <ScrollArea className="h-full pr-2">
                                <NcdStrategyNav isOpen={isOpen} />
                            </ScrollArea>
                        </motion.div>
                    ) : (
                            <motion.div
                                key="collapsed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                <NcdStrategyNav isOpen={isOpen} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-navy-blue/50 pointer-events-none" />
            <motion.div
                className="absolute top-20 right-0 w-1 bg-mint-green rounded-l-full"
                animate={{
                    height: isOpen ? "60%" : "40%",
                    opacity: isHovered ? 1 : 0.6
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    )
}