import { Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authConfig } from './auth';

type AuthResultType = {
  handlers: {
    GET: (req: NextRequest, res: NextResponse) => Promise<Response>;
    POST: (req: NextRequest, res: NextResponse) => Promise<Response>;
  };
  signIn: (provider?: string, options?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  auth: () => Promise<Session | null>;
};

export const { handlers, signIn, signOut, auth }: AuthResultType = authConfig;

export type * from '../types/next-auth';
