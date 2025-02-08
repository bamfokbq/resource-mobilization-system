"use client";

import React from 'react'
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { NAVIGATION } from '@/constant';
import { itemVariants, menuVariants } from '@/lib/animation_variant';


export default function MobileNavigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();


    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen && 'fixed'} top-4 right-4 z-50 p-2 rounded-lg bg-navy-blue text-white hover:text-winny transition-colors duration-200`}
                aria-label="Toggle navigation menu"
            >
                <div className="flex flex-col gap-1.5"> 
                    <motion.span
                        className="block h-0.5 w-6 bg-current"
                        initial="closed"
                        animate={isOpen ? 'open' : 'closed'}
                        variants={{
                            closed: { translateY: 0, rotate: 0 },
                            open: { translateY: 4, rotate: 45 }
                        }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        className="block h-0.5 w-6 bg-current"
                        initial="closed"
                        animate={isOpen ? 'open' : 'closed'}
                        variants={{
                            closed: { opacity: 1 },
                            open: { opacity: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        className="block h-0.5 w-6 bg-current"
                        initial="closed"
                        animate={isOpen ? 'open' : 'closed'}
                        variants={{
                            closed: { translateY: 0, rotate: 0 },
                            open: { translateY: -4, rotate: -45 }
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 pt-16 bg-navy-blue z-40 flex flex-col items-center justify-start origin-top-right overflow-y-auto"
                    >
                        <ul className="space-y-4 w-full text-white px-6 py-4">
                            {NAVIGATION.map((item, index) => (
                                <motion.li
                                    key={item.name}
                                    variants={itemVariants}
                                    transition={{ delay: index * 0.1 }}
                                    className="w-full"
                                >
                                    <Link
                                        href={item.href}
                                        className={`text-xl font-medium p-2 rounded-sm block w-full ${pathname === item.href ? 'bg-mint-green text-navy-blue' : 'text-white hover:text-nobe-red'
                                            } transition-colors duration-200`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
}
