'use client';

import { Button } from '@withbee/ui/button';
import PinNumberModal from './PinNumberModal';
import styles from './AuthForm.module.css';
import { useState, useRef } from 'react';
import { join } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { useRouter } from 'next/navigation';
import { validateFinalForm, validateInitialForm } from '@withbee/utils';
import { ERROR_MESSAGES } from '@withbee/exception';

export default function JoinForm() {
  const router = useRouter();
  const [isPinNumberModalOpen, setIsPinNumberModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const validation = validateInitialForm(data);
    if (!validation.isValid) {
      setErrors(validation.errors || {});
      return;
    }

    setErrors({});
    setFormData(data);
    setIsPinNumberModalOpen(true);
  };

  const handlePinSubmit = async (pinNumber: string) => {
    if (!formData) return;

    setIsSubmitting(true);
    try {
      formData.set('pinNumber', pinNumber);
      const validation = validateFinalForm(formData);

      if (!validation.isValid) {
        setErrors(validation.errors || {});
        return;
      }

      const response = await join(validation.data!);

      if ('code' in response) {
        showToast.error({
          message: ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES],
        });
        return;
      }

      showToast.success({ message: '회원가입이 완료되었습니다.' });
      router.push('/login');
      setIsPinNumberModalOpen(false);
    } catch (error) {
      showToast.error({ message: '회원가입 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="이름을 입력해주세요."
          className={`${styles.input} ${errors?.name ? styles.error : ''}`}
        />
        {errors?.name && <p className={styles.errorMessage}>{errors.name}</p>}
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="이메일을 입력해주세요."
          className={`${styles.input} ${errors?.email ? styles.error : ''}`}
        />
        {errors?.email && <p className={styles.errorMessage}>{errors.email}</p>}
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력해주세요."
          className={`${styles.input} ${errors?.password ? styles.error : ''}`}
        />
        {errors?.password && (
          <p className={styles.errorMessage}>{errors.password}</p>
        )}
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          placeholder="비밀번호를 다시 입력해주세요."
          className={`${styles.input} ${errors?.passwordConfirm ? styles.error : ''}`}
        />
        {errors?.passwordConfirm && (
          <p className={styles.errorMessage}>{errors.passwordConfirm}</p>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <Button
          type="submit"
          label={isSubmitting ? '처리중...' : '회원가입'}
          disabled={isSubmitting}
        />
      </div>

      {isPinNumberModalOpen && (
        <PinNumberModal
          isRegister={true}
          isOpen={isPinNumberModalOpen}
          onClose={() => {
            setIsPinNumberModalOpen(false);
          }}
          onSubmit={handlePinSubmit}
        />
      )}
    </form>
  );
}
