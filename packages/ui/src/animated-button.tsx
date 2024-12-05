'use client';

import { motion, TargetAndTransition } from 'framer-motion';
import styles from './animated-button.module.css';

export type AnimationVariant = 'default' | 'attentionSeek' | 'none';

const animations: Record<AnimationVariant, TargetAndTransition> = {
  default: {
    y: [0, -8, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  attentionSeek: {
    y: [0, -10, 0],
    scale: [1, 1.02, 1],
    rotate: [-2, 2, -2],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        times: [0, 0.2, 0.5],
        ease: [0.25, 0.1, 0.25, 1],
      },
      scale: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        times: [0, 0.2, 0.5],
        ease: [0.25, 0.1, 0.25, 1],
      },
      rotate: {
        duration: 0.9,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  },
  none: {},
};

interface AnimatedButtonProps {
  label: string;
  disabled?: boolean;
  variant?: AnimationVariant;
  className?: string;
  onClick?: () => void;
}

export function AnimatedButton({
  label,
  disabled = false,
  variant = 'default',
  className,
  onClick,
}: AnimatedButtonProps) {
  return (
    <div className={styles.btnWrapper}>
      <motion.button
        className={[
          styles.button,
          disabled ? styles.disabled : '',
          className,
        ].join(' ')}
        disabled={disabled}
        animate={animations[variant]}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={onClick}
      >
        {label}
      </motion.button>
    </div>
  );
}
