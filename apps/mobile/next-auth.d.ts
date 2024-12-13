import 'next-auth';
import { User } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
  }

  interface Session {
    user: User & {
      expires_at?: number;
    };
    error?: 'RefreshAccessTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    expires_at?: number;
    refreshToken?: string;
    error?: 'RefreshAccessTokenError';
    role?: string;
    user?: User;
  }
}
