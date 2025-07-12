'use client'

import { motion } from 'motion/react'

export default function AdminUsersTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
            }}
        >
            {children}
        </motion.div>
    )
}
