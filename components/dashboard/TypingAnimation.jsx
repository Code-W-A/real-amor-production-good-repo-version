import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TypingAnimation = () => {
  const dotsRef = useRef(null);

  useEffect(() => {
    const dots = dotsRef.current.children;

    gsap.to(dots, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });
  }, []);

  return (
    <div
      style={{ display: "flex", gap: "5px", fontSize: "26px" }}
      ref={dotsRef}
    >
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
};

export default TypingAnimation;
