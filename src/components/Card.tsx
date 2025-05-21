import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo, TargetAndTransition, VariantLabels, MotionStyle } from 'framer-motion';
import type { Category } from '../types/category';
import { useEffect } from 'react';

interface CardProps {
  category?: Category;
  isInitialCard?: boolean;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  imageUrls?: string[];
  triggerSwipeRight?: boolean;
  triggerSwipeLeft?: boolean;
  totalCategories?: number;
  hasInteractedWithInitialCard?: boolean;
  onInitialCardInteraction?: () => void;
}

export const Card = ({ category, isInitialCard, onSwipeRight, onSwipeLeft, imageUrls, triggerSwipeRight, triggerSwipeLeft, totalCategories, hasInteractedWithInitialCard, onInitialCardInteraction }: CardProps) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15]);
  const blur = useTransform(x, [-200, 0, 200], [10, 0, 10], { clamp: false });
  const backgroundColor = useTransform(x, [-200, 0, 200], [
    'rgba(72, 72, 72, 0.8)', // Hide color (grey)
    'rgba(255, 255, 255, 0)', // Transparent in the middle
    'rgba(0, 84, 200, 0.8)', // Add color (blue)
  ]);

  // Opacity for indicators based on drag direction and distance
  const hideOpacity = useTransform(x, [-100, -50, 0], [1, 1, 0], { clamp: true });
  const addOpacity = useTransform(x, [0, 50, 100], [0, 1, 1], { clamp: true });

  const swipeAnimation = async (direction: 1 | -1) => {
    await controls.start({
      x: direction * 1000,
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    });
    if (direction > 0) {
      onSwipeRight();
    } else {
      onSwipeLeft();
    }
    // Reset values after animation
    x.set(0);
    controls.set({ y: 0, rotate: 0, opacity: 1 });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      const direction = info.offset.x > 0 ? 1 : -1;
      swipeAnimation(direction);
    } else {
      // Snap back if not swiped far enough
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: { 
          type: 'spring', 
          stiffness: 500, 
          damping: 30,
          mass: 0.5
        }
      });
      x.set(0);
    }
  };

  // Use useEffect to watch for trigger props and start animation
  useEffect(() => {
    if (triggerSwipeRight) {
      swipeAnimation(1);
    }
    if (triggerSwipeLeft) {
      swipeAnimation(-1);
    }
  }, [triggerSwipeRight, triggerSwipeLeft]); // Depend on trigger props

  const cardStyle: MotionStyle = {
    width: '320px',
    height: '470px',
    borderRadius: '12px',
    border: '1px solid #8D8D8D',
    background: 'linear-gradient(180deg, #FFF 12.02%, #F8F8F9 79.33%)',
    boxShadow: '0px 2.96px 7.894px 0px rgba(0, 3, 77, 0.15)',
    touchAction: 'none',
    userSelect: 'none' as const,
    x,
    rotate,
    transition: 'all 0.3s ease-out',
  };

  const overlayStyle: MotionStyle = {
    backgroundColor,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '12px',
    zIndex: 2, // Overlay above content
    backdropFilter: useTransform(blur, (latest) => `blur(${latest}px)`),
  };

  const indicatorStyle: MotionStyle = {
    position: 'absolute',
    top: '20px',
    zIndex: 3, // Indicators above overlay and content
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'none',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  };

  useEffect(() => {
    if (isInitialCard && !hasInteractedWithInitialCard) {
      const idleAnimation = async () => {
        await controls.start({ x: 20, transition: { duration: 1.5, ease: "easeInOut" } });
        await controls.start({ x: -20, transition: { duration: 1.5, ease: "easeInOut" } });
        await controls.start({ x: 0, transition: { duration: 1.5, ease: "easeInOut" } });
        idleAnimation(); // Loop the animation
      };
      idleAnimation();
    } else {
      controls.stop(); // Stop animation if not initial card or user interacted
      controls.set({ x: 0 }); // Reset position
    }
  }, [isInitialCard, hasInteractedWithInitialCard, controls]);

  const handleDragStart = () => {
    if (isInitialCard && onInitialCardInteraction) {
      onInitialCardInteraction();
    }
  };

  if (isInitialCard) {
    return (
      <motion.div
        className="absolute cursor-grab"
        style={{
          ...cardStyle,
          background: '#FFD3DB', // Set the specific background color for the initial card
          // We don't need dragConstraints here if we handle swipe in SwipeyTime
          // dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          // onDragEnd={handleDragEnd}
          // animate={controls}
        }}
        drag // Keep drag enabled on the card itself
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        {/* Initial card content */}
        <div className="h-full flex flex-col items-start text-left p-6">
          <p className="text-sm font-semibold mb-2 text-gray-600">{totalCategories} remaining</p>
          <h2 className="text-2xl font-bold mb-4 text-[#00204D]">What categories would you like to see?</h2>
          <img 
            src="/img/category-starter.png" 
            alt="Category Starter" 
            className="flex-grow object-contain mb-6 self-center" // Center the image within the left-aligned column
            style={{ pointerEvents: 'none' }} // Prevent dragging the image
          />
          <p className="text-sm text-gray-600 mb-4">swipe left or right to start!</p>
          {/* Buttons are now in SwipeyTime.tsx fixed area */}
        </div>
      </motion.div>
    );
  }

  if (!category) return null;

  return (
    <motion.div
      className="absolute cursor-grab"
      style={cardStyle}
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      {/* Inner container for content and overlay to control stacking context */}
      <div className="relative w-full h-full"> 
        {/* Card Content - Z-index 0 relative to inner container */}
        <div className="h-full flex flex-col p-6 absolute inset-0" style={{ zIndex: 0 }}> 
           <h2 className="text-base font-bold mb-4" style={{ color: '#00204D' }}>{category.name}</h2>
           {imageUrls && imageUrls.length > 0 && (
             <div className="grid grid-cols-2 gap-2 mb-4">
               {imageUrls.map((url, index) => (
                 <img
                   key={index}
                   src={url}
                   alt={`${category.name} image ${index + 1}`}
                   className="rounded-md object-cover" style={{ pointerEvents: 'none', width: '140px', height: '188px' }}
                 />
               ))}
             </div>
           )}
        <div className="flex-grow" />
        </div>

        {/* Overlay for blur and color - Z-index 1 relative to inner container */}
        <motion.div style={overlayStyle} /> 
      </div>

      {/* Hide Indicator - Top Right - Z-index 3 relative to main card */}
      <motion.div style={{...indicatorStyle, right: '20px', opacity: hideOpacity}}> 
        <img src="/img/Icon.System.Eye.Closed.svg" alt="Hide" className="w-8 h-8 mb-1" />
        Hide
      </motion.div>

      {/* Add Indicator - Top Left - Z-index 3 relative to main card */}
      <motion.div style={{...indicatorStyle, left: '20px', opacity: addOpacity}}> 
        <img src="/img/Icon.System.Tick.svg" alt="Add" className="w-8 h-8 mb-1" />
        Add
      </motion.div>
    </motion.div>
  );
};