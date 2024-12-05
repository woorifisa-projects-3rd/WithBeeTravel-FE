'use server';

import { instance } from '@withbee/apis';
import { signIn, signOut } from '../../auth';
import { AuthError } from 'next-auth';
import { auth, logout } from '@withbee/auth-config';
import { LogoutRequest } from '@withbee/types';

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

export const handleSignOut = async (
  accessToken: string,
  refreshToken: string,
) => {
  await signOut();
  await logout({ accessToken, refreshToken });
};
