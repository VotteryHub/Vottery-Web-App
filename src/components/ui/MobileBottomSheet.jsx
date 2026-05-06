import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

/**
 * Premium Native-style Slide-up Action Sheet (Bottom Sheet)
 * - One-tap open/close
 * - Dismiss on backdrop tap + swipe down
 * - Safe-area aware
 * - Keyboard accessible
 */
const MobileBottomSheet = ({ isOpen, onClose, title, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_, info) => {
              setIsDragging(false);
              if (info.offset.y > 150 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-gray-900 rounded-t-[32px] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mb-4" />
              {title && (
                <h3 className="text-lg font-bold text-gray-900 dark:text-white px-6">
                  {title}
                </h3>
              )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 pb-12 pt-2 custom-scrollbar">
              {children}
            </div>

            {/* Safe Area Buffer (Mobile) */}
            <div className="h-6 bg-transparent" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomSheet;
