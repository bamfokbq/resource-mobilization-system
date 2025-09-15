"use client";

import Link from 'next/link';
import React from 'react'
import { FaPhone, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { motion } from 'motion/react';

const contactInfo = [
    { icon: <FaUser />, text: "Isaac Tandoh", href: null },
    { icon: <FaPhone />, text: "Phone: +233 24 235 6456", href: "tel:+233242356456" },
    { icon: <MdEmail />, text: "Email: isaac.tandoh@ghs.gov.gh", href: "mailto:isaac.tandoh@ghs.gov.gh" }
];

export default function Assistance() {
    return (
        <motion.section
            id='assistance'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='py-10 px-5 md:py-20 md:px-10 flex items-center justify-center'
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className='max-w-3xl p-6 md:p-10 mx-auto w-full bg-gradient-to-br from-light-blue to-white rounded-2xl shadow-lg'
            >
                <motion.h3
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    className='text-nobe-red text-2xl font-semibold mb-4'
                >
                    Need Help?
                </motion.h3>
                <p className='text-gray-700 mb-6'>For any questions or technical difficulties, please contact:</p>

                <div className='text-navy-blue space-y-4'>
                    {contactInfo.map((item, index) => {
                        const ContactWrapper = item.href ? Link : 'div';
                        return (
                            <motion.div
                                key={index}
                                whileHover={{ scale: item.href ? 1.02 : 1 }}
                                transition={{ type: "spring" as const, stiffness: 400, damping: 10 }}
                            >
                                <ContactWrapper
                                    href={item.href || '#' as any}
                                    className={`flex items-center gap-4 cursor-pointer p-3 rounded-lg ${item.href ? 'hover:bg-blue-50 transition-colors' : ''}`}
                                    aria-label={`Contact ${item.text}`}
                                >
                                    <span className='text-nobe-red'>{item.icon}</span>
                                    <p className='font-medium'>{item.text}</p>
                                </ContactWrapper>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.section>
    );
}
