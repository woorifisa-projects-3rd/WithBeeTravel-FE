'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import styles from './modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeLabel: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  closeLabel,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
        <div className={styles.content}>{children}</div>
        <footer className={styles.footer}>
          <Button onClick={onClose} label={closeLabel} />
        </footer>
      </motion.div>
    </div>
  );
};

// BottomModal 컴포넌트
export const BottomModal = ({
  isOpen,
  onClose,
  title,
  children,
}: Omit<ModalProps, 'closeLabel'>) => {
  if (!isOpen) return null;

  return (
    <div
      className={[styles.overlay, styles.bottom].join(' ')}
      onClick={onClose}
    >
      <motion.div
        className={[styles.modal, styles.bottom].join(' ')}
        initial={{ opacity: 0, y: 100 }} // 위에서 아래로 슬라이드
        animate={{ opacity: 1, y: 0 }} // 화면 중앙에 위치
        exit={{ opacity: 0, y: -100 }} // 아래로 내려가면서 사라짐
        transition={{ duration: 0.3 }}
        drag="y" // Y축으로 드래그 가능하게 설정
        dragConstraints={{ top: 0, bottom: 200 }} // 드래그 범위 설정
        onDragEnd={(event, info) => {
          if (info.point.y > 100) {
            // 아래로 일정 거리 이상 드래그하면 닫기
            onClose();
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
        <div className={styles.content}>{children}</div>
      </motion.div>
    </div>
  );
};
