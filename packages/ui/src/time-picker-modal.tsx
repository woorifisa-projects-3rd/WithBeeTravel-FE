import styles from './time-picker-modal.module.css';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BottomModal } from './modal';
import { Button } from './button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

interface TimePickerModalProps {
  title: string;
  isOpen: boolean;
  initialTime: { hour: number | undefined; minute: number | undefined };
  onSelectTime: (time: { hour: number; minute: number }) => void;
  onClose: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  title,
  isOpen,
  initialTime,
  onSelectTime,
  onClose,
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(
    initialTime?.hour || new Date().getHours(),
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    initialTime?.minute || new Date().getMinutes(),
  );

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59 minutes

  const handleHourChange = (newHour: number) => setSelectedHour(newHour);
  const handleMinuteChange = (newMinute: number) =>
    setSelectedMinute(newMinute);

  const handleSetTime = () => {
    onSelectTime({
      hour: selectedHour,
      minute: selectedMinute,
    });
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
              items={hours}
              selectedItem={selectedHour}
              onItemChange={handleHourChange}
              label="hour"
            />
            <PickerColumn
              items={minutes}
              selectedItem={selectedMinute}
              onItemChange={handleMinuteChange}
              label="minute"
            />
          </div>
          <Button label="선택하기" onClick={handleSetTime} />
        </BottomModal>
      )}
    </AnimatePresence>
  );
};

interface PickerColumnProps {
  items: number[];
  selectedItem: number;
  onItemChange: (newItem: number) => void;
  label: 'hour' | 'minute';
}

const timeLabelMap: Record<'hour' | 'minute', string> = {
  hour: '시',
  minute: '분',
};

const PickerColumn: React.FC<PickerColumnProps> = ({
  items,
  selectedItem,
  onItemChange,
  label,
}) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const initialSlide = items.indexOf(selectedItem);

  useEffect(() => {
    if (swiper && selectedItem !== undefined) {
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
                {timeLabelMap[label]}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
