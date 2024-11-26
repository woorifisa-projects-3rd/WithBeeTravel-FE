'use client';

import React from 'react';
import styles from '../page.module.css';
import { Title } from '@withbee/ui/title';
import { handleCredentialsSignin } from '../../actions/authActions';
import { Button } from '@withbee/ui/button';
import Link from 'next/link';

export default function Page() {
  // 로그인 페이지
  return (
    <div className={styles.container}>
      <header>
        <Title label="로그인" />
      </header>
      <div className={styles.content}>
        <form
          className={styles.form}
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
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
              className={styles.input}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button type="submit" label="로그인" size="large" />
            <p className={styles.join}>
              아직 회원이 아니신가요?{' '}
              <Link href="/join" className={styles.joinLink}>
                회원가입
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
