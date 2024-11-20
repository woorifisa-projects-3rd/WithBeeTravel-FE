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
                <div>
                  <div className={styles.amountRow}>
                    <span>결제 금액</span>
                    <span className={styles.paymentAmout}>
                      {expense.paymentAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.amountRow}>
                    <span>요청 금액</span>
                    <span className={styles.requestedAmount}>
                      {expense.requestedAmount.toLocaleString()}
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
