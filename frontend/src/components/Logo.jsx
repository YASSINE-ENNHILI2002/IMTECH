import React from 'react';

const Logo = ({ width = 36, height = 36 }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.3))' }}
    >
      {/* Blue premium segment - left/top */}
      <path 
        d="M20 35C20 23.9543 28.9543 15 40 15H55C71.5685 15 85 28.4315 85 45C85 48.3137 82.3137 51 79 51C75.6863 51 73 48.3137 73 45C73 35.0589 64.9411 27 55 27H40C35.5817 27 32 30.5817 32 35V65C32 69.4183 35.5817 73 40 73H55C64.9411 73 73 64.9411 73 55V53C73 49.6863 75.6863 47 79 47C82.3137 47 85 49.6863 85 53V55C85 71.5685 71.5685 85 55 85H40C28.9543 85 20 76.0457 20 65V35Z" 
        fill="url(#blueGradient)" 
      />
      {/* Dark green premium segment - right/bottom */}
      <path 
        d="M45 35C45 31.6863 47.6863 29 51 29C54.3137 29 57 31.6863 57 35V53C57 58.5228 61.4772 63 67 63H69C72.3137 63 75 65.6863 75 69C75 72.3137 72.3137 75 69 75H67C54.8497 75 45 65.1503 45 53V35Z" 
        fill="url(#greenGradient)" 
      />
      {/* White high-gloss accent segment - center divider */}
      <path 
        d="M38 45C38 41.6863 40.6863 39 44 39H56C59.3137 39 62 41.6863 62 45C62 48.3137 59.3137 51 56 51H44C40.6863 51 38 48.3137 38 45Z" 
        fill="#FFFFFF" 
        opacity="0.95"
      />
      
      {/* Definition of gorgeous gradients */}
      <defs>
        <linearGradient id="blueGradient" x1="20" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e40af" /> {/* Darker Rich Blue */}
          <stop offset="50%" stopColor="#3b82f6" /> {/* Electric Blue */}
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="greenGradient" x1="45" y1="29" x2="75" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f5132" /> {/* Dark Forest Green */}
          <stop offset="50%" stopColor="#198754" /> {/* Medium Premium Green */}
          <stop offset="100%" stopColor="#0f5132" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
