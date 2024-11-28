'use client';
import { motion } from 'framer-motion';
import styles from './button.module.css';

export interface ButtonProps {
  primary?: boolean;
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  label: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  className?: string;
  disabled?: boolean;
  shadow?: boolean;
}
/** Primary UI component for user interaction */
export const Button = ({
  primary = true,
  size = 'medium',
  onClick,
  label,
  type = 'button',
  className = '',
  shadow = false,
  disabled = false,
  ...props
}: ButtonProps) => {
  const mode = primary ? styles.primary : styles.secondary;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={[
        styles[size],
        mode,
        styles.button,
        shadow && styles.shadow,
        className,
      ].join(' ')}
      transition={{
        duration: 1,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
      disabled={disabled}
      {...props}
    >
      {label}
    </motion.button>
  );
};
