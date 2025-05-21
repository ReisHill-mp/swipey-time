import { useEffect, useRef } from 'react';

interface UseDragProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  isInitialCard?: boolean;
  threshold?: number;
}

export const useDrag = ({ onSwipeRight, onSwipeLeft, isInitialCard = false, threshold = 0.3 }: UseDragProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const offsetXRef = useRef(0);
  const offsetYRef = useRef(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const topCard = element.parentElement?.firstChild;
      if (!isInitialCard && element !== topCard && !element.classList.contains('initial-card')) return;
      if (isInitialCard && element.id !== 'initialCard') return;

      isDraggingRef.current = true;
      element.classList.add('dragging');
      startXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
      startYRef.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
      if ('touches' in e) {
        document.body.style.overflow = 'hidden';
      }
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();

      const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      offsetXRef.current = currentX - startXRef.current;
      offsetYRef.current = currentY - startYRef.current;

      const thresholdPx = element.offsetWidth * threshold;

      element.style.transform = `translate(calc(-50% + ${offsetXRef.current}px), calc(-50% + ${offsetYRef.current}px)) rotate(${offsetXRef.current / 20}deg)`;

      if (offsetXRef.current > thresholdPx * 0.5) {
        element.classList.add('swiping-right');
        element.classList.remove('swiping-left');
      } else if (offsetXRef.current < -thresholdPx * 0.5 && !isInitialCard) {
        element.classList.add('swiping-left');
        element.classList.remove('swiping-right');
      } else {
        element.classList.remove('swiping-right', 'swiping-left');
      }
    };

    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      element.classList.remove('dragging');
      if ('touches' in e) {
        document.body.style.overflow = '';
      }

      const thresholdPx = element.offsetWidth * threshold;

      if (offsetXRef.current > thresholdPx) {
        if (onSwipeRight) onSwipeRight();
      } else if (offsetXRef.current < -thresholdPx && !isInitialCard) {
        if (onSwipeLeft) onSwipeLeft();
      } else {
        element.style.transform = 'translate(-50%, -50%) scale(1)';
        element.classList.remove('swiping-right', 'swiping-left');
      }

      offsetXRef.current = 0;
      offsetYRef.current = 0;
    };

    element.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    element.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);

    return () => {
      element.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      element.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
    };
  }, [onSwipeRight, onSwipeLeft, isInitialCard, threshold]);

  return elementRef;
}; 