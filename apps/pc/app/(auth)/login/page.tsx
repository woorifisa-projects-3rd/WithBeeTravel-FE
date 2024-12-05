'use client';

import React from 'react';
import styles from '../page.module.css';
import { Title } from '@withbee/ui/title';
import LoginForm from '../../../components/LoginForm';

export default function Page() {
  // 로그인 페이지
  return (
    <div className={styles.container}>
      <header>
        <h2 className="title">로그인</h2>
      </header>
      <div className={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
}
