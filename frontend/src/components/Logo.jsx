import React from 'react';

/**
 * IMTECH Logo — uses the real brand PNG image
 * props:
 *   width, height — dimensions in px
 *   dark          — if true, adds brightness filter for dark backgrounds (unused with PNG)
 */
const Logo = ({ width = 140, height = 46, dark = false }) => {
  return (
    <img
      src="/logo.png"
      alt="I'm Tech – votre solution informatique"
      width={width}
      height={height}
      style={{
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        filter: dark ? 'brightness(0) invert(1)' : 'none',
        maxWidth: '100%',
      }}
    />
  );
};

export default Logo;
