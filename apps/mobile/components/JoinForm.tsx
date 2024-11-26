'use client';

import { Button } from '@withbee/ui/button';
import PinNumberModal from './PinNumberModal';
import styles from './JoinForm.module.css';
import { useState } from 'react';

export default function JoinForm() {
  const [isPinNumberModalOpen, setIsPinNumberModalOpen] = useState(false);

  return (
    <>
      <form
        className={styles.form}
        onSubmit={async (event) => {
          event.preventDefault();
          setIsPinNumberModalOpen(true);
          // const email = event.currentTarget.email.value;
          // const password = event.currentTarget.password.value;
          // const name = event.currentTarget.registerName.value;
          // const pinNumber = event.currentTarget.pinNumber.value;

          // console.log({ email, password, name, pinNumber });
        }}
      >
        <div className={styles.inputContainer}>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="registerName"
            name="registerName"
            placeholder="이름을 입력해주세요."
            className={styles.input}
          />
        </div>
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
          <Button type="submit" label="회원가입" size="large" />
        </div>
      </form>
      {isPinNumberModalOpen && (
        <PinNumberModal
          isRegister={true}
          isOpen={isPinNumberModalOpen}
          onClose={() => setIsPinNumberModalOpen(false)}
          onSubmit={(pinNumber) => {
            console.log('핀번호 입력 완료', pinNumber);
          }}
        />
      )}
    </>
  );
}
