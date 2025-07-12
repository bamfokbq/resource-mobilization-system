'use client'

import { motion } from 'motion/react'

export default function AdminAnalyticsTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
        >
            {children}
        </motion.div>
    )
}
