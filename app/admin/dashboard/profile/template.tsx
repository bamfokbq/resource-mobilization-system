'use client'

import { motion } from 'motion/react'

export default function AdminProfileTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
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
