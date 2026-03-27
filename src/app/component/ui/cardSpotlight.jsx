"use client";

import React, { useState } from "react";

const CardSpotlight = ({
  children,
  className = "",
  color = "56, 189, 248",
  radius = 320,
}) => {
  const [position, setPosition] = useState({ x: -9999, y: -9999 });

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-sky-100 bg-white/90 shadow-[0_18px_45px_rgba(148,163,184,0.12)] backdrop-blur-xl ${className}`}
      onMouseLeave={() => setPosition({ x: -9999, y: -9999 })}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
      style={{
        backgroundImage: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, rgba(${color}, 0.14), transparent 65%)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(239,246,255,0.72))] opacity-90" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CardSpotlight;
