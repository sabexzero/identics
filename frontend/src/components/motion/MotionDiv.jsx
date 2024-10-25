import { motion } from "framer-motion";
import React from 'react';

interface MotionDivProps {
    children: React.Node;
}

const MotionDiv:React.FC<MotionDivProps> = ({children}) => {
    return (
        <motion.div>
            
        </motion.div>
    );
};

export default MotionDiv;