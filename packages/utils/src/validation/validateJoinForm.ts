import { initialJoinSchema, finalJoinSchema } from './joinSchema';
import type { FinalJoinSchema, InitialJoinSchema } from './joinSchema';

export type FormState = {
  errors?: Record<string, string>;
  success?: boolean;
  message?: string;
};

export type ValidationResult<T> = {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
};

// 초기 폼 검증용 함수
export const validateInitialForm = (
  formData: FormData,
): ValidationResult<InitialJoinSchema> => {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    passwordConfirm: formData.get('passwordConfirm') as string,
  };

  const validationResult = initialJoinSchema.safeParse(data);

  if (!validationResult.success) {
    const errors: Record<string, string> = {};
    validationResult.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });
    return { isValid: false, errors };
  }

  return { isValid: true, data: validationResult.data };
};

// 최종 제출용 검증 함수
export const validateFinalForm = (
  formData: FormData,
): ValidationResult<FinalJoinSchema> => {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    passwordConfirm: formData.get('passwordConfirm') as string,
    pinNumber: formData.get('pinNumber') as string,
  };

  const validationResult = finalJoinSchema.safeParse(data);

  if (!validationResult.success) {
    const errors: Record<string, string> = {};
    validationResult.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors[issue.path[0].toString()] = issue.message;
      }
    });
    return { isValid: false, errors };
  }

  return { isValid: true, data: validationResult.data };
};
