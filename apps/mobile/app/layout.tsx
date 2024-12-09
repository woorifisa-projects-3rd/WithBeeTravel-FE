import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@withbee/styles/global.css';
import './global.css';
import MobileFooter from '../components/MobileFooter';
import { CustomToastContainer } from '@withbee/ui/toast-container';
import RealtIimeMsg from '../components/RealTimeMsg';
import { SessionProvider } from 'next-auth/react';

const pretendard = localFont({
  src: 'fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
  weight: '400 920',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.withbee.site'),
  title: '윗비트래블',
  description: '편리하게 여행 경비를 관리할 수 있는 서비스',
  icons: {
    icon: '/Airplane.ico',
  },
  openGraph: {
    title: '윗비트래블',
    description: '편리하게 여행 경비를 관리할 수 있는 서비스',
    images: [
      {
        url: '/opengraph.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="layout">
      <body className={pretendard.variable}>
        <div className="mobile">
          <SessionProvider>
            <RealtIimeMsg />
            <CustomToastContainer />
            {children}
            <MobileFooter />
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
