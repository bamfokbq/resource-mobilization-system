'use client'

import { motion } from 'motion/react'

export default function AdminSurveysTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
            }}
        >
            {children}
        </motion.div>
    )
}
