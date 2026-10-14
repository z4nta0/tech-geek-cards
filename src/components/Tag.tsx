import React from 'react'
import styles from './Tag.module.css'

interface TagProps {
  label: string
  variant?: 'blue' | 'orange' | 'neutral'
  size?: 'sm' | 'md'
}

export const Tag: React.FC<TagProps> = ({ label, variant = 'neutral', size = 'sm' }) => (
  <span className={`${styles.tag} ${styles[variant]} ${styles[size]}`}>
    {label}
  </span>
)
