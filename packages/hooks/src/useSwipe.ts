import { useCallback, useRef, useState } from 'react';

export const useSwipe = (
  leftAction: () => void,
  rightAction: () => void,
  onClickEventAction?: () => void,
) => {
  const isMouseDown = useRef<boolean>(false);
  const isSwiping = useRef<boolean>(false);
  const offsetX = useRef<number>(0);

  const [startX, setStartX] = useState<number | null>(null);
  const [endX, setEndX] = useState<number | null>(null);

  const dragDistance = endX !== null && startX !== null ? endX - startX : 0;

  const calculateDragDistance = useCallback(() => {
    if (dragDistance > 50) {
      rightAction();
    } else if (dragDistance < -50) {
      leftAction();
    }
  }, [dragDistance]);

  // 마우스 이벤트
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isMouseDown.current = true;
    isSwiping.current = false;
    offsetX.current = e.clientX;
    setStartX(e.clientX);
  }, []);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isMouseDown.current) return;
      isMouseDown.current = false;
      if (!isSwiping.current) {
        onClickEventAction && onClickEventAction();
      } else {
        setEndX(e.clientX);
        calculateDragDistance();
      }
    },
    [calculateDragDistance],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current) return;
    isSwiping.current = true;
    setEndX(e.clientX);
  }, []);

  // 터치 이벤트
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches?.[0]; // optional chaining 사용
      if (!touch) return; // touch가 없으면 함수 종료

      isMouseDown.current = true;
      isSwiping.current = false;
      offsetX.current = touch.clientX;
      setStartX(touch.clientX);
    },
    [],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches?.[0]; // optional chaining 사용
    if (!isMouseDown.current || !touch) return; // touch가 없으면 함수 종료

    isSwiping.current = true;
    setEndX(touch.clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.changedTouches?.[0]; // optional chaining 사용
      if (!isMouseDown.current || !touch) return; // touch가 없으면 함수 종료

      isMouseDown.current = false;
      if (!isSwiping.current) {
        onClickEventAction && onClickEventAction();
      } else {
        setEndX(touch.clientX);
        calculateDragDistance();
      }
    },
    [calculateDragDistance],
  );
  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    if (event.deltaX > 50) {
      rightAction();
    } else if (event.deltaX < -50) {
      leftAction();
    }
  };
  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  };
};
