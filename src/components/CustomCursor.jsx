import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 45, stiffness: 1200, mass: 0.05 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [cursorState, setCursorState] = useState('default'); // 'default', 'pointer', 'active', 'freeze'
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let clickTimeout;
    
    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => {
      setCursorState('active');
    };

    const onMouseUp = (e) => {
      // Keep the "pressed" state for a fraction of a second to avoid glitchy instantaneous snapping
      clickTimeout = setTimeout(() => {
        const target = e.target;
        const isClickable = target && target.closest && target.closest('a, button, [role="button"], [tabindex="0"], label, summary, .cursor-pointer');
        const isDisabled = target && target.closest && target.closest('[disabled], .cursor-not-allowed, .cursor-wait');
        
        if (isDisabled) {
          setCursorState('freeze');
        } else if (isClickable) {
          setCursorState('pointer');
        } else {
          setCursorState('default');
        }
      }, 250); // 250ms smooth latency for the click reaction
    };

    const onMouseOver = (e) => {
      // Don't override if it's currently in the "pressed" latency window
      setCursorState((prev) => {
        if (prev === 'active') return 'active';
        
        const target = e.target;
        const isClickable = target && target.closest && target.closest('a, button, [role="button"], [tabindex="0"], label, summary, .cursor-pointer');
        const isDisabled = target && target.closest && target.closest('[disabled], .cursor-not-allowed, .cursor-wait');

        if (isDisabled) return 'freeze';
        if (isClickable) return 'pointer';
        return 'default';
      });
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, [isVisible]);

  const getCursorImage = () => {
    switch(cursorState) {
      case 'active': return '/assets/cursor-arrow-pressed.svg';
      case 'pointer': return '/assets/cursor-arrow-hover.svg';
      case 'freeze': return '/assets/cursor-freeze.svg';
      default: return '/assets/cursor-arrow.svg';
    }
  };

  if (!isVisible) return null;

  return createPortal(
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999999]"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      animate={{
        scale: cursorState === 'active' ? 0.8 : cursorState === 'pointer' ? 1.15 : 1
      }}
      transition={{
        scale: { type: 'spring', stiffness: 1200, damping: 45, mass: 0.1 }
      }}
    >
      <img 
        src={getCursorImage()} 
        alt="cursor"
        className="w-8 h-8 -translate-x-[2px] -translate-y-[2px] transition-all duration-200 ease-out"
        style={{ 
            filter: cursorState === 'pointer' 
                ? 'drop-shadow(0 0 10px rgba(53,133,246,0.9))' 
                : 'drop-shadow(0 0 4px rgba(53,133,246,0.3))' 
        }}
      />
    </motion.div>,
    document.body
  );
}
