import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import styles from './date-picker-modal.module.css';
import { Button } from './button';
import { BottomModal } from './modal';

interface DatePickerModalProps {
  title: string;
  isOpen: boolean;
  initialDate?: { year: number; month: number; day: number };
  onSelectDate: (date: { year: number; month: number; day: number }) => void;
  onClose: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  title,
  isOpen,
  initialDate,
  onSelectDate,
  onClose,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    initialDate?.year || new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    initialDate?.month || new Date().getMonth() + 1,
  );
  const [selectedDay, setSelectedDay] = useState<number>(
    initialDate?.day || new Date().getDate(),
  );

  const years = Array.from(
    { length: 21 },
    (_, i) => new Date().getFullYear() - 10 + i,
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from(
    { length: new Date(selectedYear, selectedMonth, 0).getDate() },
    (_, i) => i + 1,
  );

  const handleYearChange = (newYear: number) => setSelectedYear(newYear);
  const handleMonthChange = (newMonth: number) => setSelectedMonth(newMonth);
  const handleDayChange = (newDay: number) => setSelectedDay(newDay);

  const handleSetDate = () => {
    onSelectDate({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
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
          disableDrag={true} // DatePicker에서는 드래그 비활성화
        >
          <div className={styles.pickerContainer}>
            <PickerColumn
              items={years}
              selectedItem={selectedYear}
              onItemChange={handleYearChange}
              label="year"
            />
            <PickerColumn
              items={months}
              selectedItem={selectedMonth}
              onItemChange={handleMonthChange}
              label="month"
            />
            <PickerColumn
              items={days}
              selectedItem={selectedDay}
              onItemChange={handleDayChange}
              label="day"
            />
          </div>
          <Button label="선택하기" onClick={handleSetDate} />
        </BottomModal>
      )}
    </AnimatePresence>
  );
};

interface PickerColumnProps {
  items: number[];
  selectedItem: number;
  onItemChange: (newItem: number) => void;
  label: 'year' | 'month' | 'day';
}

const dateLabelMap: Record<'year' | 'month' | 'day', string> = {
  year: '년',
  month: '월',
  day: '일',
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
                  styles[label],
                  selectedItem === item ? styles.selected : '',
                ].join(' ')}
              >
                {item}
                {dateLabelMap[label]}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default DatePickerModal;
