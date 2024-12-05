'use client';

import { AnimatePresence, motion } from 'framer-motion';
import styles from './../app/travel/[id]/settlement/page.module.css';
import Image from 'next/image';

export default function OtherExpenseDetails({
  others,
  disagreeCount,
}: {
  others: any;
  disagreeCount: number;
}) {
  const parentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 자식 요소를 순차적으로 애니메이션
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatePresence>
      <div className={styles.userList}>
        <motion.ul
          key="content"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={parentVariants}
        >
          {others
            .sort((a: { agreed: boolean }, b: { agreed: boolean }) => {
              return a.agreed === b.agreed ? 0 : a.agreed ? 1 : -1;
            })
            .map(
              (user: {
                id: number;
                agreed: boolean;
                name: string;
                totalPaymentCost: number;
              }) => (
                <motion.li
                  key={user.id}
                  className={`${styles.card} ${
                    user.agreed ? styles.completedCard : styles.userCard
                  }`}
                  variants={childVariants}
                  transition={{
                    duration: 0.7,
                    ease: 'easeInOut',
                  }}
                >
                  <div className={styles.userRow}>
                    <span>
                      <span className={styles.name}>{user.name}</span>
                      <span className={styles.suffix}>님이</span>
                    </span>
                    <span>
                      <span
                        className={
                          user.totalPaymentCost >= 0
                            ? styles.positiveAmount
                            : styles.negativeAmount
                        }
                      >
                        {user.totalPaymentCost >= 0
                          ? `+${user.totalPaymentCost?.toLocaleString()}원`
                          : `${user.totalPaymentCost?.toLocaleString()}원`}
                      </span>
                      <span className="suffixText">{`을 ${
                        user.totalPaymentCost >= 0 ? '받아요' : '보내요'
                      }`}</span>
                    </span>
                  </div>
                  {user.agreed && (
                    <div className={styles.completedOverlay}>
                      <Image
                        src="/imgs/settlement/stamp.png"
                        alt="stamp"
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                </motion.li>
              ),
            )}
          <motion.div
            className={styles.remainingUsers}
            variants={childVariants}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            <span>정산 완료까지 남은 인원 : </span>
            <strong>{disagreeCount}</strong>
            <span>명</span>
          </motion.div>
        </motion.ul>
      </div>
    </AnimatePresence>
  );
}
