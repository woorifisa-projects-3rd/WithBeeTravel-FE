'use client';

import React from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { handleCredentialsSignin } from '../../actions/authActions';

export default function Page() {
  // 로그인 페이지
  return (
    <div className={styles.container}>
      <header>
        <Title label="로그인" />
      </header>
      <div className={styles.content}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const email = event.currentTarget.email.value;
            const password = event.currentTarget.password.value;
            await handleCredentialsSignin({ email, password });
          }}
        >
          <div className={styles.inputContainer}>
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="이메일을 입력해주세요."
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit">로그인</button>
          </div>
        </form>
      </div>
    </div>
  );
}
