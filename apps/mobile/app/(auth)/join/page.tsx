'use client';

import React from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';

export default function Page() {
  // 회원가입 페이지
  return (
    <div className={styles.container}>
      <header>
        <Title label="회원가입" />
      </header>
      <div className={styles.content}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const email = event.currentTarget.email.value;
            const password = event.currentTarget.password.value;
            const name = event.currentTarget.registerName.value;
            const pinNumber = event.currentTarget.pinNumber.value;

            console.log({ email, password, name, pinNumber });
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
          <div className={styles.inputContainer}>
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="registerName"
              name="registerName"
              placeholder="이름을 입력해주세요."
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="pinNumber">핀번호</label>
            <input
              type="text"
              id="pinNumber"
              name="pinNumber"
              placeholder="핀번호를 입력해주세요."
            />
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
}
