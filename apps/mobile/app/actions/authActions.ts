'use server';

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';

export const handleCredentialsSignin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error('Error occurred during credentials signin:', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    return { error: 'Unexpected error occurred' };
  }
};
