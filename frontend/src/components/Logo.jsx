import React from 'react';

const Logo = ({ width = 120, height = 40, showTagline = false }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Blue Orbit Swirl */}
      <path
        d="M136.22 17.51C123.51 10.74 100.86 10.23 75.12 16.32C42.84 23.97 18.25 41.24 20.21 54.89C22.06 67.77 48.06 73.12 78.47 67.89C94.13 65.20 108.57 59.93 118.89 53.11"
        stroke="#105A81"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M34.89 36.12C41.89 30.12 52.89 25.12 65.89 21.89"
        stroke="#105A81"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* "i'm" text in grey */}
      <text
        x="42"
        y="49"
        fill="#8E8E93"
        fontFamily="'Inter', 'Arial', sans-serif"
        fontSize="25"
        fontWeight="bold"
        letterSpacing="-0.02em"
      >
        i'm
      </text>

      {/* "tech" text in vibrant apple green */}
      <text
        x="122"
        y="50"
        fill="#73BE43"
        fontFamily="'Inter', 'Arial', sans-serif"
        fontSize="34"
        fontWeight="800"
      >
        tech
      </text>

      {/* Tagline "votre solution informatique" */}
      <text
        x="80"
        y="68"
        fill="#105A81"
        fontFamily="'Inter', 'Arial', sans-serif"
        fontSize="10"
        fontWeight="600"
        letterSpacing="0.02em"
      >
        votre solution informatique
      </text>
    </svg>
  );
};

export default Logo;
