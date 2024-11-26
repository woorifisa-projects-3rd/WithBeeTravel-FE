'use client';

import styles from './wibee-card-payment.module.css';
import { WibeeCardHistory } from '@withbee/types';
import { useState } from 'react';
import notSelectIcon from './assets/not_select.png';
import selectIcon from './assets/select.png';
import Image from 'next/image';

interface WibeeCardProps {
  payment: WibeeCardHistory;
  isSelected: boolean;
  handleSelectHistory: (id: number) => void;
}

export default function WibeeCardPayment({
  payment,
  isSelected,
  handleSelectHistory,
}: WibeeCardProps) {
  return (
    <div
      className={`${styles.container} ${payment.isAddedSharedPayment ? styles.isAlreadyAdded : ''}`}
      onClick={() => handleSelectHistory(payment.id)}
    >
      <div className={styles.info}>
        <span className={styles.date}>
          {payment.date.replace(/-/g, '.').replace('T', ' ')}
        </span>
        <span className={styles.paymentAmount}>
          {payment.paymentAmount.toLocaleString()}원
        </span>
        <span className={styles.storeName}>{payment.storeName}</span>
      </div>
      <div className={styles.check}>
        {!payment.isAddedSharedPayment ? (
          isSelected ? (
            <Image
              src={selectIcon}
              alt="select"
              width="30"
              height="30"
              className={styles.selectIcon}
            />
          ) : (
            <Image
              src={notSelectIcon}
              alt="not select"
              width="30"
              height="30"
              className={styles.notSelectIcon}
            />
          )
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
