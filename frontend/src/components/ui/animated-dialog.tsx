import React from "react";
import {DialogContent} from "@/components/ui/dialog.tsx";
import {HTMLMotionProps, motion } from "framer-motion";

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (timing: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: timing * 0.1,
            duration: 0.3,
            ease: "easeOut",
        },
    }),
};

interface AnimatedDialogContentProps extends Omit<HTMLMotionProps<"div">, "ref"> {
    children: React.ReactNode;
}
function AnimatedDialogContent({
    children,
    ...props
}: AnimatedDialogContentProps) {
    return (
        <DialogContent className="p-0 overflow-hidden">
            <motion.div
                initial={{opacity: 0, scale: 0.95, y: 10}}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1],
                    },
                }}
                className="p-6"
            >
                <motion.div initial="hidden" animate="visible" {...props}>
                    {children}
                </motion.div>
            </motion.div>
        </DialogContent>
)
};

interface AnimatedDialogWrapperProps {
    children: React.ReactNode;
    timing?: number;
}
function AnimatedDialogWrapper({
    children,
    timing = 0
}: AnimatedDialogWrapperProps) {
    return (
        <motion.div variants={itemVariants} custom={timing}>
            {children}
        </motion.div>
    )
}

export {
    AnimatedDialogContent,
    AnimatedDialogWrapper
}