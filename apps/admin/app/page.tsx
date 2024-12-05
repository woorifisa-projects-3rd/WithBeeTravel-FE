
'use client'
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getAdminDashbord } from "../../../packages/apis/src";

const AdminDashboard = () => {

  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [tripCount, setTripCount] = useState(0);

  // 대시보드 데이터를 가져오는 함수
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getAdminDashbord();
      if ('data' in response && response.data) {
        // API로 받은 데이터를 상태에 설정
        setLoginAttempts(response.data.loginCount);  // 로그인 시도 횟수
        setUserCount(response.data.totalUser);  // 총 회원 수
        setTripCount(response.data.totalTravel);  // 총 생성된 여행 수
      } else {
        // 실패한 경우 처리 로직 추가
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 대시보드 데이터 가져오기
  useEffect(() => {
    fetchDashboardData();
  }, []);  // 빈 배열로 초기 렌더링 시 한 번만 호출되도록 설정



  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
        <main className={styles.mainContent}>
          <h2 className={styles.pageTitle}>관리자 대시보드</h2>
          <div className={styles.dashboardGrid}>
            <div className={styles.dashboardCard}>
              <h3>로그인 기록</h3>
              <p>최근 로그인 시도: {loginAttempts}회</p>
              <Link href="/login-logs" className={styles.cardLink}>자세히 보기</Link>
            </div>
            <div className={styles.dashboardCard}>
              <h3>회원 관리</h3>
              <p>총 회원 수: {userCount}명</p>
              <Link href="/user-management" className={styles.cardLink}>관리하기</Link>
            </div>
            <div className={styles.dashboardCard}>
              <h3>여행 관리</h3>
              <p>총 생성 여행: {tripCount}건</p>
              <Link href="/travel-management" className={styles.cardLink}>관리하기</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

