import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './date-picker-modal.module.css';
import { Button } from './button';
import { BottomModal } from './modal';

interface DatePickerModalProps {
  title: string;
  isOpen: boolean;
  onSelectDate: (date: { year: number; month: number; day: number }) => void;
  onClose: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  title,
  isOpen,
  onSelectDate,
  onClose,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  // 10년 전부터 10년 후까지의 연도를 생성
  const years = Array.from(
    { length: 21 },
    (_, i) => new Date().getFullYear() - 10 + i,
  );

  // 1월부터 12월까지의 월을 생성
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 선택한 연도와 월에 따라 마지막 일을 생성
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
        <BottomModal isOpen={isOpen} onClose={onClose} title={title}>
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

export default DatePickerModal;

// 'year', 'month', 'day' 각각에 대응하는 label과 value를 가진 타입
type DateLabelMap = Record<'year' | 'month' | 'day', string>;

const dateLabelMap: DateLabelMap = {
  year: '년',
  month: '월',
  day: '일',
};

interface PickerColumnProps {
  items: number[];
  selectedItem: number;
  onItemChange: (newItem: number) => void;
  label: 'year' | 'month' | 'day';
}

const PickerColumn: React.FC<PickerColumnProps> = ({
  items,
  selectedItem,
  onItemChange,
  label,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const itemHeight = 40;

  const handleScroll = () => {
    const container = ref.current;
    if (!container) return;

    const scrollTop = container.scrollTop; // 스크롤 위치

    console.log(scrollTop);

    const selectedIndex = Math.round(scrollTop / itemHeight); // 선택된 아이템 인덱스
    const selectedValue = items[selectedIndex]; // 선택된 아이템 값

    if (selectedValue !== undefined) {
      onItemChange(selectedValue); // 부모로 값을 전달
    }
  };

  // 초기 스크롤 위치 설정
  useEffect(() => {
    const container = ref.current;
    if (container) {
      const selectedIndex = items.indexOf(selectedItem);
      const scrollPosition = selectedIndex * itemHeight;
      container.scrollTop = scrollPosition;
    }
  }, [selectedItem, items]);

  // 스크롤 이벤트 추가
  useEffect(() => {
    const container = ref.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [items]);

  return (
    <div className={styles.pickerColumn}>
      <div className={styles.scrollPicker} ref={ref}>
        <div className={styles.pickerItems}>
          <div className={styles.pickerPadding}></div>
          {items.map((item) => (
            <div
              key={item}
              className={[
                styles.pickerItem,
                styles[label],
                selectedItem === item && styles.selected,
              ].join(' ')}
            >
              {item}
              {dateLabelMap[label]}
            </div>
          ))}
          <div className={styles.pickerPadding}></div>
        </div>
      </div>
      <div className={styles.selectionIndicator}></div>
    </div>
  );
};
