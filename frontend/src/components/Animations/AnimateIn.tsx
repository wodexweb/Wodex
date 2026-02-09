import React from "react";
import { motion } from "framer-motion";

interface AnimateInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    y?: number;
}

const AnimateIn: React.FC<AnimateInProps> = ({
    children,
    delay = 0,
    duration = 0.6,
    y = 40,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }} // 25% visible hone par start
            transition={{ duration, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default AnimateIn;
