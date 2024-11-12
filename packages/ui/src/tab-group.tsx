'use client';

import { useState, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import styles from './tab-group.module.css';

const TabGroup = () => {
  const [activeTab, setActiveTab] = useState('전체');
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
            onClick={() => setActiveTab(tab)}
            className={[
              styles.tab,
              activeTab === tab ? styles.activeTab : styles.inactiveTab,
            ].join(' ')}
          >
            {tab}
            {activeTab === tab && (
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
