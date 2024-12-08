'use client';

import { Button } from '@withbee/ui/button';
import { handleCredentialsSignin } from '../app/actions/authActions';
import styles from './AuthForm.module.css';
import Link from 'next/link';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useTransition } from 'react';
import { getIsCard } from '@withbee/apis';

export default function LoginForm() {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    startTransition(() => {
      void (async () => {
        const loginResult = await handleCredentialsSignin({ email, password });

        if (loginResult?.error) {
          showToast.error({ message: ERROR_MESSAGES['AUTH-001'] });
          return;
        }

        if (!loginResult?.error) {
          const isConnectedResult = await getIsCard();
          if ('data' in isConnectedResult) {
            const isConnectedWibeeCard =
              isConnectedResult.data?.connectedWibeeCard;
            if (isConnectedWibeeCard) {
              window.location.href = '/travel';
              return;
            }
          }
          window.location.href = '/';
        }
      })();
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
        <Button
          type="submit"
          label={isPending ? '로그인 중...' : '로그인'}
          disabled={isPending}
        />
        <p className={styles.join}>
          아직 회원이 아니신가요?{' '}
          <Link href="/join" className={styles.joinLink}>
            회원가입
          </Link>
        </p>
      </div>
    </form>
  );
}
