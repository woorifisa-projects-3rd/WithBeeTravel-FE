// AccountSelection.tsx
import React, { useState, useEffect } from 'react';
import styles from './AccountSelection.module.css';
import Image from 'next/image';
import { ProductOption } from '@withbee/types';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useAnimation,
} from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';

const AccountSelection: React.FC<{
  productOptions: ProductOption[];
  onSelect: (product: string) => void;
}> = ({ productOptions, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // Dynamic transforms based on drag position
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1.1, 0.8]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const leftRotate = useTransform(x, [-200, 0, 200], [5, 0, -5]);
  const rightRotate = useTransform(x, [-200, 0, 200], [-5, 0, 5]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % productOptions.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + productOptions.length) % productOptions.length,
    );
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setShowGuide(false);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const threshold = 100;
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentProduct = productOptions[currentIndex];
  const prevProduct =
    productOptions[
      (currentIndex - 1 + productOptions.length) % productOptions.length
    ];
  const nextProduct =
    productOptions[(currentIndex + 1) % productOptions.length];

  useEffect(() => {
    if (currentProduct) {
      onSelect(currentProduct.label);
    }
  }, [currentIndex, currentProduct, onSelect]);

  return (
    <div className={styles.container}>
      <div className={styles.perspectiveWrapper}>
        <motion.div
          className={styles.swipeContainer}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x }}
          tabIndex={0}
        >
          <motion.div
            className={`${styles.cardPreview} ${styles.left}`}
            style={{ rotate: leftRotate }}
          >
            <div className={styles.imageContainer}>
              <Image
                className={styles.image}
                src={prevProduct!.imageUrl}
                alt={prevProduct!.label}
                width={prevProduct!.width || 120}
                height={180}
                draggable={false}
              />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.title}>{prevProduct!.label}</h2>
            </div>
          </motion.div>

          <motion.div
            className={styles.cardSelected}
            style={{ scale, opacity }}
          >
            <div className={styles.imageContainer}>
              <Image
                className={styles.image}
                src={currentProduct!.imageUrl}
                alt={currentProduct!.label}
                width={currentProduct!.width || 120}
                height={180}
                draggable={false}
              />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.title}>{currentProduct!.label}</h2>
              <h3 className={styles.des}>{currentProduct!.value}</h3>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.cardPreview} ${styles.right}`}
            style={{ rotate: rightRotate }}
          >
            <div className={styles.imageContainer}>
              <Image
                className={styles.image}
                src={nextProduct!.imageUrl}
                alt={nextProduct!.label}
                width={nextProduct!.width || 120}
                height={180}
                draggable={false}
              />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.title}>{nextProduct!.label}</h2>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showGuide && (
          <motion.div
            className={styles.swipeGuideWrapper}
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                x: [-30, 30, -30],
                transition: {
                  x: {
                    repeat: Infinity,
                    duration: 2.5,
                    ease: 'easeInOut',
                  },
                  opacity: { duration: 0.5 },
                },
              },
              exit: { opacity: 0 },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className={styles.swipeGuide}>
              <span>스와이프하여 선택</span>
              <MoveHorizontal size={24} strokeWidth={2.5} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountSelection;
