import React, { useState, useEffect, useRef } from 'react';
import styles from './AccountSelection.module.css';
import { useSwipe } from '@withbee/hooks/useSwipe';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductOption {
  label: string;
  value: string;
  imageUrl: string;
  width?: number;
  className?: string;
  detail: string;
}

const AccountSelection: React.FC<{
  productOptions: ProductOption[];
  onSelect: (product: string) => void;
}> = ({ productOptions, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerStyle, setContainerStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrevClick = () => {
    animateSwipe('left');
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + productOptions.length) % productOptions.length,
    );
  };

  const handleNextClick = () => {
    animateSwipe('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % productOptions.length);
  };

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleWheel,
  } = useSwipe(handleNextClick, handlePrevClick);

  const currentProduct = productOptions[currentIndex];

  useEffect(() => {
    if (currentProduct) {
      onSelect(currentProduct.label);
    }
  }, [currentIndex, currentProduct, onSelect]);

  const animateSwipe = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth;

      setContainerStyle({
        transform: `translateX(${direction === 'right' ? '-' : ''}${containerWidth}px)`,
        transition: 'transform 0.2s',
      });

      setTimeout(() => {
        setContainerStyle({ transform: 'translateX(0)', transition: '' });
      }, 150);
    }
  };

  if (!currentProduct) return null;

  return (
    <div className={styles.container}>
      <button
        className={[styles.arrowButton, styles.leftArrow].join(' ')}
        onClick={handlePrevClick}
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>

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
        <div className={styles.cardSelected}>
          <Image
            src={currentProduct.imageUrl}
            alt={currentProduct.label}
            width={currentProduct.width || 110}
            height={160}
            className={styles.image}
          />
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{currentProduct.label}</h2>
            <h3 className={styles.des}>{currentProduct.value}</h3>
          </div>
        </div>
      </div>

      <button
        className={[styles.arrowButton, styles.rightArrow].join(' ')}
        onClick={handleNextClick}
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default AccountSelection;
