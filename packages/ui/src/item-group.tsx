'use client';

import { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import styles from './item-group.module.css';
import { usePaymentParams } from '@withbee/hooks/usePaymentParams';
import { allCategories } from '@withbee/utils';

const TabGroup = () => {
  const { params, updateParam } = usePaymentParams();
  const { category } = params;
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();

  return (
    <div className={styles.container} ref={constraintsRef}>
      <div className={styles.tabListWrapper}>
        <motion.div
          className={styles.tabList}
          drag="x"
          dragControls={dragControls}
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 100, bounceDamping: 20 }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {allCategories.map((tab) => (
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
    </div>
  );
};

export default TabGroup;
