'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './button';
import styles from './modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeLabel?: string;
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
    <AnimatePresence>
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
            <h2
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: title }} // HTML 태그를 안전하게 삽입
            />
          </header>
          <div className={styles.content}>{children}</div>
          <footer className={styles.footer}>
            {closeLabel && <Button onClick={onClose} label={closeLabel} />}
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const BottomModal = ({
  isOpen,
  onClose,
  title,
  children,
  closeLabel,
  disableDrag, // 새로운 prop 추가
}: ModalProps & { disableDrag?: boolean }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={[styles.overlay, styles.bottom].join(' ')}
        onClick={onClose}
      >
        <motion.div
          className={[styles.modal, styles.bottom].join(' ')}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          drag={disableDrag ? undefined : 'y'}
          dragConstraints={disableDrag ? undefined : { top: 0, bottom: 200 }}
          onDragEnd={
            disableDrag
              ? undefined
              : (event, info) => {
                  if (info.point.y > 100) {
                    onClose();
                  }
                }
          }
          onClick={(e) => e.stopPropagation()}
        >
          <header className={styles.header}>
            <h2
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: title }} // HTML 태그를 안전하게 삽입
            />
          </header>
          <div className={styles.content}>{children}</div>
          <footer className={styles.footer}>
            {closeLabel && <Button onClick={onClose} label={closeLabel} />}
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
