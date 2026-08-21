import React from 'react';

/**
 * IMTECH Brand Logo — exact SVG reproduction
 * props:
 *   width, height  — dimensions
 *   dark           — if true, renders text suitable for dark backgrounds
 */
const Logo = ({ width = 140, height = 46, dark = false }) => {
  const textColor = dark ? '#ffffff' : '#8E8E93';
  const taglineColor = dark ? 'rgba(255,255,255,0.7)' : '#105a81';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 260 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      aria-label="I'm Tech – votre solution informatique"
    >
      {/* ── Orbit swirl (steel blue, anti-clockwise sweep) ── */}
      <ellipse cx="90" cy="40" rx="72" ry="30"
        fill="none" stroke="#105a81" strokeWidth="6"
        strokeLinecap="round"
        transform="rotate(-20 90 40)"
        strokeDasharray="240 80"
        strokeDashoffset="20"
      />
      {/* inner orbit accent */}
      <ellipse cx="90" cy="40" rx="68" ry="27"
        fill="none" stroke="#1472a4" strokeWidth="2.5"
        strokeLinecap="round"
        transform="rotate(-20 90 40)"
        strokeDasharray="40 320"
        strokeDashoffset="0"
        opacity="0.7"
      />

      {/* ── "i'm" in grey/white ── */}
      <text
        x="38"
        y="52"
        fill={textColor}
        fontFamily="'Inter', 'Arial Rounded MT Bold', Arial, sans-serif"
        fontSize="28"
        fontWeight="800"
        letterSpacing="-0.5"
      >
        i&apos;m
      </text>

      {/* ── "tech" in apple green ── */}
      <text
        x="118"
        y="54"
        fill="#73BE43"
        fontFamily="'Inter', 'Arial Rounded MT Bold', Arial, sans-serif"
        fontSize="36"
        fontWeight="900"
        letterSpacing="-0.5"
      >
        tech
      </text>

      {/* ── Tagline ── */}
      <text
        x="78"
        y="72"
        fill={taglineColor}
        fontFamily="'Inter', Arial, sans-serif"
        fontSize="10.5"
        fontWeight="500"
        letterSpacing="0.5"
      >
        votre solution informatique
      </text>
    </svg>
  );
};

export default Logo;
