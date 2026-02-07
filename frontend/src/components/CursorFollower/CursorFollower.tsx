import React, { useEffect, useRef, useState } from "react";
import styles from "./cursor.module.scss";

const CursorFollower: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [clicked, setClicked] = useState(false);

    const mouse = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            if (dotRef.current) {
                dotRef.current.style.left = e.clientX + "px";
                dotRef.current.style.top = e.clientY + "px";
            }
        };

        const down = () => setClicked(true);
        const up = () => setClicked(false);

        document.addEventListener("mousemove", move);
        document.addEventListener("mousedown", down);
        document.addEventListener("mouseup", up);

        const animate = () => {
            ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
            ring.current.y += (mouse.current.y - ring.current.y) * 0.18;

            if (ringRef.current) {
                ringRef.current.style.left = ring.current.x + "px";
                ringRef.current.style.top = ring.current.y + "px";
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mousedown", down);
            document.removeEventListener("mouseup", up);
        };
    }, []);

    return (
        <>
            <div ref={ringRef} className={styles.cursorRing}></div>
            <div
                ref={dotRef}
                className={`${styles.cursorDot} ${clicked ? styles.expand : ""}`}
            ></div>
        </>
    );
};

export default CursorFollower;
