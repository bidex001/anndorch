"use client";

import React, { useId } from "react";

const Spotlight = ({ className = "", fill = "#38bdf8" }) => {
  const gradientId = useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute animate-spotlight opacity-0 ${className}`}
      fill="none"
      viewBox="0 0 3787 2842"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter={`url(#${gradientId}-filter)`}>
        <ellipse
          cx="1924.71"
          cy="273.501"
          fill={`url(#${gradientId}-paint)`}
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.999986 0.00523378 0.00523378 0.999986 3747.83 0.780273)"
        />
      </g>

      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="2841.83"
          id={`${gradientId}-filter`}
          width="3786.16"
          x="0.860352"
          y="0.838989"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            mode="normal"
            result="shape"
          />
          <feGaussianBlur
            result="effect1_foregroundBlur_1065_8"
            stdDeviation="151"
          />
        </filter>

        <radialGradient
          cx="0"
          cy="0"
          gradientTransform="translate(1924.71 273.501) rotate(90) scale(273.501 1924.71)"
          gradientUnits="userSpaceOnUse"
          id={`${gradientId}-paint`}
          r="1"
        >
          <stop stopColor={fill} />
          <stop offset="1" stopColor={fill} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Spotlight;
