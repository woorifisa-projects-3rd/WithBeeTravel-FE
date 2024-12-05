import React from 'react';
import styles from '../page.module.css';
import { Title } from '@withbee/ui/title';
import JoinForm from '../../../components/JoinForm';

export default function Page() {
  // 회원가입 페이지
  return (
    <div className={styles.container}>
      <header>
        <h2 className="title">회원가입</h2>
      </header>
      <div className={styles.content}>
        <JoinForm />
      </div>
    </div>
  );
}
