import React from "react";
import { motion, MotionProps, Variants } from "framer-motion";

interface IMotionProps extends MotionProps {
    children: React.ReactNode;
    pic?: boolean;
    reversed?: boolean;
    variants?: Variants;
}

const Motion: React.FC<IMotionProps> = ({
    children,
    variants,
    pic = false,
    ...props
}) => {
    if (variants) {
        return (
            <motion.div
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                {...props}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={
                pic
                    ? { opacity: 0, scale: 0.9 }
                    : { filter: "blur(20px)", opacity: 0 }
            }
            animate={
                pic
                    ? { opacity: 1, scale: 1 }
                    : { filter: "blur(0px)", opacity: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{ ease: [0.45, 0, 0.55, 1], duration: 1.2 }}
        >
            {children}
        </motion.div>
    );
};

export default Motion;
