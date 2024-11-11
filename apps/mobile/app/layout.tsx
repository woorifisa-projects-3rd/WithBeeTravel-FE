import type { Metadata } from "next";
import localFont from "next/font/local";
import "@withbee/styles";
import "./global.css";
import MobileFooter from "../components/MobileFooter"


const pretendard = localFont({
  src: 'fonts/PretendardVariable.ttf',
  variable: '--font-pretendard',
  weight: '100 300 400 500 700 900',
});

export const metadata: Metadata = {
  title: "윗비트래블",
  description: "편리하게 여행 경비를 관리할 수 있는 서비스",
  icons: {
    icon: '/Airplane.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="layout">
      <body className={[pretendard.variable, "mobile"].join(" ")} >
        {children}
        <MobileFooter />
      </body>
    </html>
  );
}
