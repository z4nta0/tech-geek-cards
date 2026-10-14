import React from 'react'
import styles from './GeoBg.module.css'

interface GeoBgProps {
  variant?: 'grid' | 'dots' | 'hex' | 'circuit'
  opacity?: number
  className?: string
}

export const GeoBg: React.FC<GeoBgProps> = ({ variant = 'grid', opacity = 0.4, className = '' }) => {
  return (
    <div className={`${styles.geo} ${className}`} style={{ opacity }} aria-hidden>
      {variant === 'grid' && (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo-grid)" />
        </svg>
      )}
      {variant === 'dots' && (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="geo-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo-dots)" />
        </svg>
      )}
      {variant === 'circuit' && (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={styles.circuit}>
          <defs>
            <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 0 20 L 20 20 L 20 0" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="20" cy="20" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 40 0 L 40 40 L 80 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="40" cy="40" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 60 80 L 60 60 L 80 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="60" cy="60" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <rect x="10" y="48" width="8" height="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <rect x="50" y="8"  width="8" height="4" fill="none" stroke="currentColor" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      )}
    </div>
  )
}
