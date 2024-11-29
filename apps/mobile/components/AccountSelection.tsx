import React, { useState } from 'react';
import styles from './AccountSelection.module.css';
import { Button } from '@withbee/ui/button';
import { useSwipe } from '@withbee/hooks/useSwipe'; // 훅 import
import Image from 'next/image';

interface ProductOption {
    label: string;
    value: string;
    imageUrl: string; 
  }

const AccountSelection: React.FC<{
  productOptions: ProductOption[];
  onSelect: (product: string) => void;
}> = ({ productOptions, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // useSwipe 훅을 호출해서 여러 이벤트 핸들러를 구조 분해 할당
  const { 
    handleTouchStart, 
    handleTouchMove, 
    handleTouchEnd,
    handleMouseDown, 
    handleMouseUp, 
    handleMouseMove,
    handleWheel
  } = useSwipe(
    () => setCurrentIndex((prevIndex) => (prevIndex + 1) % productOptions.length), // 오른쪽 스와이프
    () => setCurrentIndex((prevIndex) => (prevIndex - 1 + productOptions.length) % productOptions.length), // 왼쪽 스와이프
  );

  const currentProduct = productOptions[currentIndex];

  return (
    <div className={styles.container}>
      <div 
        className={styles.card} 
        onTouchStart={handleTouchStart} 
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown} 
        onMouseUp={handleMouseUp} 
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
      >
        <div className={styles.imageContainer}>
          {/* <img src={currentProduct.imageUrl} alt={currentProduct.label} className={styles.image} /> */}
          <Image src={currentProduct.imageUrl} alt={currentProduct.label}
          width={200}
          height={300}
           />
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.title}>{currentProduct.label}</h2>
          <h3 className={styles.des}>{currentProduct.value}</h3>
          <Button label="선택하기" onClick={() => onSelect(currentProduct.label)} size="medium" />
        </div>
      </div>
    </div>
  );
};

export default AccountSelection;
