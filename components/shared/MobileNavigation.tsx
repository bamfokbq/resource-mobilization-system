"use client";

import React from 'react'
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION } from '@/constant';
import { itemVariants, menuVariants } from '@/lib/animation_variant';
import { FiMenu, FiX } from 'react-icons/fi'; // updated imports, now including FiMenu

export default function MobileNavigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();


    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="z-50 p-2 rounded-sm text-navy-blue transition-colors duration-200"
                aria-label="Toggle navigation menu"
            >
                <FiMenu size={32} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 pt-16 bg-white z-40 flex flex-col items-center justify-start origin-top-right overflow-y-auto"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close navigation menu"
                            className="absolute top-4 right-4 text-navy-blue p-2"
                        >
                            <FiX size={32} />
                        </button>

                        <ul className="space-y-4 w-full px-6 py-4">
                            {NAVIGATION.map((item, index) => (
                                <motion.li
                                    key={item.name}
                                    variants={itemVariants}
                                    transition={{ delay: index * 0.1 }}
                                    className="w-full"
                                >
                                    <Link
                                        href={item.href}
                                        className={`p-2 rounded-sm block w-full ${pathname === item.href ? 'bg-mint-green text-white' : 'text-navy-blue hover:text-light-blue'} transition-colors duration-200`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.li>
                            ))}
                            <motion.li
                                className="w-full"
                                variants={itemVariants}
                                transition={{ delay: NAVIGATION.length * 0.1 }}
                            >
                                <Link className="bg-navy-blue text-white w-full block hover:opacity-85 cursor-pointer py-3 px-6 rounded-3xl text-center" href="/contact">
                                    Contact us
                                </Link>
                            </motion.li>
                        </ul>

                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
}
