"use client";

import React from 'react'
import SectionTitle from '../shared/SectionTitle'
import { RESOURCES_ACTION } from '@/constant'
import { FaDownload } from "react-icons/fa6"
import { motion } from 'motion/react'

// Define variants for stagger effect
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.2
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 20, stiffness: 100 }
    }
}

export default function ResourcesAction() {
    return (
        <section
            id="resources"
            className='min-h-[50dvh] border border-navy-blue py-10 px-5 md:py-20 md:px-10 flex flex-col gap-6 md:gap-12 bg-gradient-to-r from-blue-50 to-blue-100'
        >
            <SectionTitle text='Resources for Action' color='text-navy-blue' />
            <motion.div
                className='max-w-lg w-full flex flex-col gap-6 mx-auto'
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {RESOURCES_ACTION.map((action) => (
                    <motion.div
                        key={action.id}
                        className='bg-navy-blue shadow-lg h-full flex items-center rounded-xl px-4 py-3 justify-between transition transform ease-in-out duration-300'
                        variants={cardVariants}
                    >
                        <p className='text-white text-lg font-medium'>
                            {action.title}
                        </p>
                        <motion.div
                            className='h-12 w-12 flex items-center justify-center rounded-full bg-mint-green cursor-pointer'
                            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                        >
                            <FaDownload className='text-navy-blue text-2xl' />
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}
