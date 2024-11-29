import React, { useState, useEffect, useRef } from 'react';
import styles from './AccountSelection.module.css';
import { useSwipe } from '@withbee/hooks/useSwipe';
import Image from 'next/image';

interface ProductOption {
  label: string;
  value: string;
  imageUrl: string;
  detail: string;
}

const AccountSelection: React.FC<{
  productOptions: ProductOption[];
  onSelect: (product: string) => void;
}> = ({ productOptions, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
  } = useSwipe(
    () => {
      animateSwipe('right');
      setCurrentIndex((prevIndex) => (prevIndex + 1) % productOptions.length);
    },
    () => {
      animateSwipe('left');
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + productOptions.length) % productOptions.length,
      );
    },
  );

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

  const animateSwipe = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;

      if (direction === 'right') {
        setContainerStyle({
          transform: `translateX(-${containerWidth}px)`,
          transition: 'transform 0.2s',
        });
      } else {
        setContainerStyle({
          transform: `translateX(${containerWidth}px)`,
          transition: 'transform 0.2s',
        });
      }

      // Reset the container position after the animation
      setTimeout(() => {
        setContainerStyle({ transform: 'translateX(0)', transition: '' });
      }, 150);
    }
  };

  if (!currentProduct || !prevProduct || !nextProduct) return null;

  return (
    <div className={styles.container}>
      <div
        className={styles.swipeContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        ref={containerRef}
        style={containerStyle}
      >
        <div className={`${styles.cardPreview} ${styles.left}`}>
          <div className={styles.imageContainer}>
            <Image
              src={prevProduct.imageUrl}
              alt={prevProduct.label}
              width={120}
              height={180}
            />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{prevProduct.label}</h2>
          </div>
        </div>

        <div className={styles.cardSelected}>
          <div className={styles.imageContainer}>
            <Image
              src={currentProduct.imageUrl}
              alt={currentProduct.label}
              width={120}
              height={180}
            />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{currentProduct.label}</h2>
            <h3 className={styles.des}>{currentProduct.value}</h3>
          </div>
        </div>

        <div className={`${styles.cardPreview} ${styles.right}`}>
          <div className={styles.imageContainer}>
            <Image
              src={nextProduct.imageUrl}
              alt={nextProduct.label}
              width={120}
              height={180}
            />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{nextProduct.label}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSelection;
