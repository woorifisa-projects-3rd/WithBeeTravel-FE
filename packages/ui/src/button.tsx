'use client';

import { motion } from 'framer-motion';
import styles from './button.module.css';

export interface ButtonProps {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  label: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = true,
  size = 'medium',
  type = 'button',
<<<<<<< HEAD
  className = '',
=======
  label,
  onClick,
>>>>>>> 61d2cb920bc05b5378556f66b191a5e5da2eda80
  ...props
}: ButtonProps) => {
  const mode = primary ? styles.primary : styles.secondary;

  return (
    <motion.button
<<<<<<< HEAD
      type="button"
      className={[styles[size], mode, styles.button, className].join(' ')}
      // initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
      // animate={{ opacity: 1, scale: [1, 1.2, 1], rotate: 0 }}
=======
      type={type}
      className={[styles[size], mode, styles.button].join(' ')}
      onClick={onClick}
>>>>>>> 61d2cb920bc05b5378556f66b191a5e5da2eda80
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
