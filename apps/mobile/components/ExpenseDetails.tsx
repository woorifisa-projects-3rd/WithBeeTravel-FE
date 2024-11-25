'use client';

import { useState } from 'react';
import styles from './../app/travel/[id]/settlement/page.module.css';
import Image from 'next/image';

interface Expense {
  id: number;
  paymentDate: string;
  storeName: string;
  paymentAmount: number;
  requestedAmount: number;
}

interface ExpenseDetailsProps {
  myDetailPayments: Expense[];
}

export default function ExpenseDetails({
  myDetailPayments,
}: ExpenseDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {isOpen && (
        <div className={styles.expenseList}>
          <ul>
            {myDetailPayments.map((expense) => (
              <li key={expense.id} className={styles.expenseItem}>
                <div>
                  <div className={styles.expenseDate}>
                    {(expense.paymentDate ?? '').split('T')[0] +
                      ' ' +
                      (expense.paymentDate ?? '').split('T')[1]?.slice(0, 8)}
                  </div>
                  <div className={styles.storeName}>{expense.storeName}</div>
                </div>
                <div className={styles.amountRow}>
                  <div className={styles.amountColumn}>
                    <span className={styles.amountLabel}>결제 금액</span>
                    <span className={styles.paymentAmount}>
                      {`${expense.paymentAmount.toLocaleString()}원`}
                    </span>
                  </div>
                  <div className={styles.amountColumn}>
                    <span className={styles.amountLabel}>
                      {expense.requestedAmount >= 0 ? '받을 금액' : '보낼 금액'}
                    </span>
                    <span
                      className={
                        expense.requestedAmount >= 0
                          ? styles.positiveRequestedAmount
                          : styles.negativeRequestedAmount
                      }
                    >
                      {expense.requestedAmount >= 0
                        ? `+${expense.requestedAmount.toLocaleString()}원`
                        : `${expense.requestedAmount.toLocaleString()}원`}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className={styles.detailsButton} onClick={toggleDetails}>
        <span>{isOpen ? '상세내역 접기' : '상세내역 보기'}</span>
        <Image
          src="/arrow.png"
          alt="arrow"
          width={10}
          height={7}
          className={`${styles.arrows} ${
            isOpen ? styles.arrowOpen : styles.arrowClosed
          }`}
        />
      </button>
    </>
  );
}
