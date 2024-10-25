import React from "react";
import { motion } from "framer-motion";

const MotionDiv = ({ children, pic = false, reversed = false }) => {
    return (
        <motion.div
            initial={
                pic
                    ? { opacity: 0, scale: 0.9 }
                    : reversed
                      ? { x: -50, opacity: 0, scale: 0.9 }
                      : { x: 200, opacity: 0, scale: 0.9 }
            }
            animate={
                pic ? { opacity: 1, scale: 1 } : { x: 0, opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{ ease: [0.45, 0, 0.55, 1], duration: 0.5 }}
            sx={{
                "& > *": {
                    width: "100%",
                    height: "100%",
                },
            }}
        >
            {children}
        </motion.div>
    );
};

export default MotionDiv;
