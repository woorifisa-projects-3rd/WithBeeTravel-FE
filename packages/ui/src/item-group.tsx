'use client';

import { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import styles from './item-group.module.css';
import { usePaymentStore } from '@withbee/stores';
import { usePaymentParams } from '@withbee/hooks/usePaymentParams';

const TabGroup = () => {
  const { params, updateParam } = usePaymentParams();
  const { category } = params;
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();

  const tabs = [
    '전체',
    '항공',
    '교통',
    '숙박',
    '식비',
    '관광',
    '액티비티',
    '쇼핑',
    '기타',
  ];

  console.log('category', category);

  return (
    <div className={styles.container} ref={constraintsRef}>
      <motion.div
        className={styles.tabList}
        drag="x"
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 20 }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => updateParam('category', tab)}
            className={[
              styles.tab,
              category === tab ? styles.activeTab : styles.inactiveTab,
            ].join(' ')}
          >
            {tab}
            {category === tab && (
              <motion.div
                className={styles.underline}
                layoutId="underline"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default TabGroup;
