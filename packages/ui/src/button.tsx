"use client";

import { motion } from 'framer-motion';
import styles from './button.module.css';


export interface ButtonProps {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  label: string;
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = true,
  size = 'medium',
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? styles.primary : styles.secondary;
  
  return (
    <motion.button
      type="button"
      className={[styles[size], mode, styles.button].join(' ')}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      {label}
    </motion.button>
  );
};
