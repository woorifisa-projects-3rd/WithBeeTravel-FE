import React from 'react';
import styles from '../page.module.css';
import { Title } from '@withbee/ui/title';
import JoinForm from '../../../components/JoinForm';

export default function Page() {
  // 회원가입 페이지
  return (
    <div className={styles.container}>
      <header>
        <Title label="회원가입" />
      </header>
      <div className={styles.content}>
        <JoinForm />
      </div>
    </div>
  );
}
