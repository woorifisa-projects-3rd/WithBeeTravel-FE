'use client';

import { Button } from '@withbee/ui/button';
import PinNumberModal from './PinNumberModal';
import styles from './JoinForm.module.css';
import { useState, useRef } from 'react';
import { join } from '@withbee/apis';
import { z } from 'zod';
import { useFormState, useFormStatus } from 'react-dom';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useToast } from '@withbee/hooks/useToast';

// Zod 스키마 정의
const joinSchema = z
  .object({
    name: z
      .string()
      .min(2, '이름은 2글자 이상이어야 합니다.')
      .max(10, '이름은 10글자 이하여야 합니다.'),
    email: z
      .string()
      .min(1, '이메일은 필수입니다.')
      .email('올바른 이메일 형식이 아닙니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자리 이상이어야 합니다.')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      ),
    passwordConfirm: z.string().min(1, '비밀번호 확인은 필수입니다.'),
    pinNumber: z
      .string()
      .length(6, '핀번호는 6자리여야 합니다.')
      .regex(/^\d+$/, '핀번호는 숫자만 입력 가능합니다.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'], // 에러를 표시할 필드
  });

type FormState = {
  errors?: Record<string, string>;
  success?: boolean;
  message?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      label={pending ? '처리중...' : '회원가입'}
      size="large"
      disabled={pending}
    />
  );
}

const initialState: FormState = { errors: {} };

async function handleFormSubmit(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      passwordConfirm: formData.get('passwordConfirm') as string,
      pinNumber: formData.get('pinNumber') as string,
    };

    const validationResult = joinSchema.safeParse(data);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      return { errors };
    }

    const response = await join(data);

    if ('code' in response) {
      return {
        errors: {
          submit: ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES],
        },
      };
    }

    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
    };
  } catch (error) {
    return {
      errors: {
        submit: '회원가입 중 오류가 발생했습니다.',
      },
    };
  }
}

export default function JoinForm() {
  const [isPinNumberModalOpen, setIsPinNumberModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState<FormState, FormData>(
    handleFormSubmit,
    initialState,
  );
  const { showToast } = useToast();

  // state에 따라 토스트
  if (state.errors?.submit) {
    showToast.error({ message: state.errors.submit });
  } else if (state.success) {
    showToast.success({
      message: state.message!,
    });
  }

  return (
    <>
      <form
        ref={formRef}
        className={styles.form}
        action={formAction}
        onSubmit={(e) => {
          if (state.success) {
            setIsPinNumberModalOpen(true);
            formRef.current?.reset();
          }
        }}
      >
        <div className={styles.inputContainer}>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="이름을 입력해주세요."
            className={`${styles.input} ${state.errors?.name ? styles.error : ''}`}
          />
          {state.errors?.name && (
            <p className={styles.errorMessage}>{state.errors.name}</p>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일을 입력해주세요."
            className={`${styles.input} ${state.errors?.email ? styles.error : ''}`}
          />
          {state.errors?.email && (
            <p className={styles.errorMessage}>{state.errors.email}</p>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호를 입력해주세요."
            className={`${styles.input} ${state.errors?.password ? styles.error : ''}`}
          />
          {state.errors?.password && (
            <p className={styles.errorMessage}>{state.errors.password}</p>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="비밀번호를 다시 입력해주세요."
            className={`${styles.input} ${state.errors?.passwordConfirm ? styles.error : ''}`}
          />
          {state.errors?.passwordConfirm && (
            <p className={styles.errorMessage}>
              {state.errors.passwordConfirm}
            </p>
          )}
        </div>

        {/* TODO: 핀번호모달을 통해 핀번호를 입력받아야 합니다. */}
        <div className={styles.inputContainer}>
          <label htmlFor="pinNumber">핀번호</label>
          <input
            type="password"
            id="pinNumber"
            name="pinNumber"
            placeholder="핀번호를 입력해주세요."
            className={`${styles.input} ${state.errors?.pinNumber ? styles.error : ''}`}
          />
          {state.errors?.pinNumber && (
            <p className={styles.errorMessage}>{state.errors.pinNumber}</p>
          )}
        </div>

        <div className={styles.buttonContainer}>
          <SubmitButton />
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
