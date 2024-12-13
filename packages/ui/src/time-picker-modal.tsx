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
  initialTime: {
    amPm: string | undefined;
    hour: string | undefined;
    minute: string | undefined;
  };
  onSelectTime: (time: { amPm: string; hour: string; minute: string }) => void;
  onClose: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  title,
  isOpen,
  initialTime,
  onSelectTime,
  onClose,
}) => {
  const getHourToString = (hour: number): string => {
    // 12시 이상일 경우, 12시간제 형식으로 변환
    if (hour === 0) {
      return '12'; // 자정은 12로 반환
    }

    if (hour > 12) {
      return String(hour % 12).padStart(2, '0'); // 13시 이상은 12시간제로 변환
    }

    // 1~11시 그대로 반환, 01~11로 두 자리로 맞추기
    return String(hour).padStart(2, '0');
  };

  const [selectAmPm, setSelectAmPm] = useState<'오전' | '오후'>(
    initialTime?.amPm || new Date().getHours() >= 12 ? '오후' : '오전',
  );
  const [selectedHour, setSelectedHour] = useState<string>(
    initialTime?.hour || getHourToString(new Date().getHours()),
  );
  const [selectedMinute, setSelectedMinute] = useState<string>(
    initialTime?.minute || new Date().getMinutes().toString().padStart(2, '0'),
  );

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0'),
  ); // 01 to 12 hours
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0'),
  ); // 0 to 59 minutes

  const handleAmPmChange = (newAmPm: string) => {
    setSelectAmPm(newAmPm as '오전' | '오후');
  };

  const handleHourChange = (newHour: string) => {
    setSelectedHour(newHour);
  };
  const handleMinuteChange = (newMinute: string) => {
    setSelectedMinute(newMinute);
  };

  const handleSetTime = () => {
    onSelectTime({
      amPm: selectAmPm,
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
              items={['오전', '오후']}
              selectedItem={selectAmPm}
              onItemChange={(newAmPm) => handleAmPmChange(newAmPm)}
              label="amPm"
            />
            <PickerColumn
              items={hours}
              selectedItem={selectedHour}
              onItemChange={(newHour) => handleHourChange(newHour)}
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
  items: string[];
  selectedItem: string;
  onItemChange: (newItem: string) => void;
  label: 'hour' | 'minute' | 'amPm';
}

const timeLabelMap: Record<'hour' | 'minute' | 'amPm', string> = {
  hour: '시',
  minute: '분',
  amPm: '',
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
