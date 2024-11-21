import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@withbee/styles/global.css';
import './global.css';
import MobileFooter from '../components/MobileFooter';
import { CustomToastContainer } from '@withbee/ui/toast-container';

const pretendard = localFont({
  src: 'fonts/PretendardVariable.ttf',
  variable: '--font-pretendard',
  weight: '100 300 400 500 700 900',
});

export const metadata: Metadata = {
  title: '윗비트래블',
  description: '편리하게 여행 경비를 관리할 수 있는 서비스',
  icons: {
    icon: '/Airplane.ico',
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
          <CustomToastContainer />
          {children}
          <MobileFooter />
        </div>
      </body>
    </html>
  );
}
