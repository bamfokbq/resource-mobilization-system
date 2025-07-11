export const menuVariants = {
    closed: {
        clipPath: 'circle(0% at 100% 0)',
        opacity: 0,
        transition: {
            duration: 0.6,
            ease: [0.42, 0, 0.58, 1] as const
        }
    },
    open: {
        clipPath: 'circle(150% at 100% 0)',
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.42, 0, 0.58, 1] as const,
            staggerChildren: 0.1
        }
    }
};

export const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
};
