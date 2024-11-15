'use client';

import { motion } from 'framer-motion';
import styles from './button.module.css';

export interface ButtonProps {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  label: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = true,
  size = 'medium',
  type = 'button',
  label,
  onClick,
  ...props
}: ButtonProps) => {
  const mode = primary ? styles.primary : styles.secondary;

  return (
    <motion.button
      type={type}
      className={[styles[size], mode, styles.button].join(' ')}
      onClick={onClick}
      transition={{
        duration: 1,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
      {...props}
    >
      {label}
    </motion.button>
  );
};
