import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import styles from './currency-unit-picker-modal.module.css';
import { Button } from './button';
import { BottomModal } from './modal';

interface CurrencyUnitPickerModalProps {
  title: string;
  isOpen: boolean;
  currencyUnits: string[];
  onSelectCurrency: (currency: string) => void;
  onClose: () => void;
}

export const CurrencyUnitPickerModal: React.FC<
  CurrencyUnitPickerModalProps
> = ({ title, isOpen, currencyUnits, onSelectCurrency, onClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    currencyUnits[0] || '',
  );

  const handleCurrencyChange = (newCurrency: string) =>
    setSelectedCurrency(newCurrency);

  const handleSetCurrency = () => {
    onSelectCurrency(selectedCurrency);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <BottomModal
          isOpen={isOpen}
          onClose={onClose}
          title={title}
          disableDrag={true}
        >
          <div className={styles.pickerContainer}>
            <PickerColumn
              items={currencyUnits}
              selectedItem={selectedCurrency}
              onItemChange={handleCurrencyChange}
              label="currency"
            />
          </div>
          <Button label="선택하기" onClick={handleSetCurrency} />
        </BottomModal>
      )}
    </AnimatePresence>
  );
};

interface PickerColumnProps {
  items: string[];
  selectedItem: string;
  onItemChange: (newItem: string) => void;
  label: 'currency';
}

const PickerColumn: React.FC<PickerColumnProps> = ({
  items,
  selectedItem,
  onItemChange,
  label,
}) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const initialSlide = items.indexOf(selectedItem);

  useEffect(() => {
    if (swiper && selectedItem) {
      const index = items.indexOf(selectedItem);
      if (index !== -1 && swiper.activeIndex !== index) {
        swiper.slideTo(index);
      }
    }
  }, [selectedItem, items, swiper]);

  return (
    <div className={styles.pickerColumn}>
      <div className={styles.columnWrapper}>
        <Swiper
          direction="vertical"
          slidesPerView={3}
          centeredSlides={true}
          onSwiper={setSwiper}
          initialSlide={initialSlide}
          onSlideChange={(swiper) => {
            const newItem = items[swiper.activeIndex];
            if (newItem !== undefined && newItem !== selectedItem) {
              onItemChange(newItem);
            }
          }}
          className={styles.swiper}
        >
          {items.map((item) => (
            <SwiperSlide key={item}>
              <div
                className={[
                  styles.pickerItem,
                  selectedItem === item ? styles.selected : '',
                ].join(' ')}
              >
                {item}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
