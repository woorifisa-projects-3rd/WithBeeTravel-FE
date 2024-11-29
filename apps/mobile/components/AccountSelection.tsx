import React, { useState, useEffect } from 'react';
import styles from './AccountSelection.module.css';
import { useSwipe } from '@withbee/hooks/useSwipe'; // 훅 import
import Image from 'next/image';

interface ProductOption {
  label: string;
  value: string;
  imageUrl: string;
  detail:string;
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

  // 왼쪽/현재/오른쪽 항목을 계산하여 반환
  const currentProduct = productOptions[currentIndex];
  const prevProduct = productOptions[(currentIndex - 1 + productOptions.length) % productOptions.length];
  const nextProduct = productOptions[(currentIndex + 1) % productOptions.length];

  // 중앙에 위치한 항목이 자동으로 선택되도록 처리
  useEffect(() => {
    if (currentProduct) {
      onSelect(currentProduct.label); // 중앙 항목이 변경되면 자동으로 선택됨
    }
  }, [currentIndex, currentProduct, onSelect]);

  if (!currentProduct) return null; // 또는 다른 대체 UI를 넣을 수 있습니다.

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
      >
        {/* 왼쪽 미리보기 항목 */}
        <div className={`${styles.cardPreview} ${styles.left}`}>
          <div className={styles.imageContainer}>
            <Image src={prevProduct.imageUrl} alt={prevProduct.label} width={120} height={180} />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{prevProduct.label}</h2>
          </div>
        </div>

        {/* 현재 선택된 항목 */}
        <div className={styles.cardSelected}>
          <div className={styles.imageContainer}>
            <Image src={currentProduct.imageUrl} alt={currentProduct.label} width={120} height={180} />
          </div>
          <div className={styles.textContainer}>
            <h2 className={styles.title}>{currentProduct.label}</h2>
            <h3 className={styles.des}>{currentProduct.value}</h3>
          </div>
        </div>

        {/* 오른쪽 미리보기 항목 */}
        <div className={`${styles.cardPreview} ${styles.right}`}>
          <div className={styles.imageContainer}>
            <Image src={nextProduct.imageUrl} alt={nextProduct.label} width={120} height={180} />
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
