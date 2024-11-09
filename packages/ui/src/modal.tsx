"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button'; 
import styles from './modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <header className={styles.header}>
          <h2>{title}</h2>
        </header>
        <div className={styles.content}>
          {children}
        </div>
        <footer className={styles.footer}>
          <Button onClick={onClose} label="닫기" />
        </footer>
      </motion.div>
    </div>
  );
};
