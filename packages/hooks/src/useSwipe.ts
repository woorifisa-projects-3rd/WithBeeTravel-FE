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
      isMouseDown.current = true;
      isSwiping.current = false;
      offsetX.current = e.touches[0].clientX;
      setStartX(e.touches[0].clientX);
    },
    [],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMouseDown.current) return;
    isSwiping.current = true;
    setEndX(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isMouseDown.current) return;
      isMouseDown.current = false;
      if (!isSwiping.current) {
        onClickEventAction && onClickEventAction();
      } else {
        setEndX(e.changedTouches[0].clientX);
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
