import { z } from 'zod';

// 핀번호를 제외한 기본 필드 검증을 위한 스키마
interface JoinSchema {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  pinNumber?: string;
}

export const initialJoinSchema: z.ZodSchema<JoinSchema> = z
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
      .min(10, '비밀번호는 10자리 이상이어야 합니다.')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      ),
    passwordConfirm: z.string().min(1, '비밀번호 확인은 필수입니다.'),
  })
  .refine((data: JoinSchema) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

// 최종 제출을 위한 전체 스키마 (핀번호 포함)
export const finalJoinSchema = initialJoinSchema.and(
  z.object({
    pinNumber: z
      .string()
      .length(6, '핀번호는 6자리여야 합니다.')
      .regex(/^\d+$/, '핀번호는 숫자만 입력 가능합니다.'),
  }),
);

export type InitialJoinSchema = z.infer<typeof initialJoinSchema>;
export type FinalJoinSchema = z.infer<typeof finalJoinSchema>;
