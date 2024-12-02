import { motion } from 'framer-motion';
import styles from './keyboard.module.css';

interface KeyboardProps {
  // 키보드 클릭 이벤트 핸들러
  onKeyPress: (key: string) => void;
  // 키패드 설정 (기본값 또는 PIN 입력용)
  keypadType?: 'default' | 'pin';
  // 버튼에 active 상태를 추가할 때 사용할 activeKeys
  activeKeys?: string[];
  // 컨테이너 스타일 커스터마이징을 위한 className
  className?: string;
  // 버튼 스타일 커스터마이징을 위한 className
  buttonClassName?: string;
}

export default function Keyboard({
  onKeyPress,
  keypadType = 'default',
  activeKeys = [],
  className,
  buttonClassName,
}: KeyboardProps) {
  // 키패드 타입에 따른 키 배열 설정
  const keys =
    keypadType === 'default'
      ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '←']
      : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', '←'];

  const handleKeyPress = (key: string) => {
    const value = key === '←' ? 'backspace' : key === 'X' ? 'clear' : key;
    onKeyPress(value);
  };

  return (
    <motion.div
      className={`${styles.keyboard} ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      {keys.map((key) => (
        <button
          key={key}
          className={`${styles.keyboardKey} ${buttonClassName || ''} ${
            activeKeys.includes(key) ? styles.active : ''
          }`}
          onClick={() => handleKeyPress(key)}
        >
          {key}
        </button>
      ))}
    </motion.div>
  );
}
