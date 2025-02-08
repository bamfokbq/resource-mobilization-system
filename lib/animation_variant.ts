export const menuVariants = {
    closed: {
        clipPath: 'circle(0% at 100% 0)',
        opacity: 0,
        transition: {
            duration: 0.6,
            ease: 'easeInOut',
            when: 'afterChildren' // add to ensure list exits before background
        }
    },
    open: {
        clipPath: 'circle(150% at 100% 0)',
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: 'easeInOut',
            when: 'beforeChildren',
            staggerChildren: 0.1
        }
    }
};

export const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
};
