"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './button.module.css';


export interface ButtonProps {
  primary?: boolean;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  
  return (
    <motion.button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode, styles.button].join(' ')}
      style={{ backgroundColor }}
      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
      animate={{ opacity: 1, scale: [1, 1.2, 1], rotate: 0 }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }}
      {...props}
    >
      {label}
    </motion.button>
  );
};
