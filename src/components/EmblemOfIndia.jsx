import React from 'react';

/**
 * 100% Authentic State Emblem of India (Ashoka Lion Capital with Satyameva Jayate)
 * Official Government of India National Emblem as displayed on services.gst.gov.in
 */
export default function EmblemOfIndia({
  className = '',
  height = 68,
  width = 48,
  fill = '#ffffff',
  alt = 'State Emblem of India - सत्यमेव जयते'
}) {
  const isDark =
    fill &&
    fill.toLowerCase() !== '#ffffff' &&
    fill.toLowerCase() !== '#fff' &&
    fill.toLowerCase() !== 'white';

  const src = isDark ? '/emblem-india-dark.svg' : '/emblem-india-white.svg';

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`state-emblem-india ${className}`}
      style={{
        height: `${height}px`,
        width: `${width}px`,
        objectFit: 'contain',
        display: 'inline-block',
        filter: isDark ? 'none' : 'drop-shadow(0 1px 1px rgba(0,0,0,0.25))'
      }}
      loading="eager"
    />
  );
}
