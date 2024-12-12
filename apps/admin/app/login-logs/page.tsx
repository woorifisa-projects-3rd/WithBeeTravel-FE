'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css'; // 로그인 로그 페이지 전용 CSS
import { LoginLog, Pageable } from '../../../../packages/types/src/adminType';
import { getLoginLogs } from '../../../../packages/apis/src/adminService';
import Header from '../../components/Header'; // 헤더 컴포넌트
import Sidebar from '../../components/Sidebar'; // 사이드바 컴포넌트

const AdminPage = () => {
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [pageable, setPageable] = useState<Pageable | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loginLogType, setLoginLogType] = useState<string>('ALL');
  const [userId, setUserId] = useState<string>('');

  const fetchLoginLogs = async (
    page: number,
    logType: string,
    userId: string,
  ) => {
    setLoading(true);
    try {
      const response = await getLoginLogs(page, 5, logType, userId);
      console.log('response', response);
      if ('data' in response && response.data) {
        setLoginLogs(response.data.content);
        setPageable(response.data.pageable);
        // @ts-ignore
        setTotalPages(response.data.totalPages);
      } else {
      }
    } catch (error) {
      console.error('Failed to fetch login logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginLogs(currentPage, loginLogType, userId!);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLoginLogs(1, loginLogType, userId!);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>로그인 로그</h1>

          <div className={styles.filter}>
            <label htmlFor="logType">로그 유형:</label>
            <select
              id="logType"
              value={loginLogType}
              onChange={(e) => setLoginLogType(e.target.value)}
            >
              <option value="ALL">전체</option>
              <option value="LOGIN">로그인 성공</option>
              <option value="LOGIN_FAILED">로그인 실패</option>
              <option value="REGISTER">회원가입</option>
            </select>
          </div>

          <div className={styles.filter}>
            <label htmlFor="userId">사용자 코드:</label>
            <input
              type="text"
              id="userId"
              value={userId || ''}
              onChange={(e) => {
                const value = e.target.value;
                // 숫자만 입력되도록 제한
                if (/^\d*$/.test(value)) {
                  //@ts-ignore
                  setUserId(value ? Number(value) : ''); // 입력값이 있으면 숫자로 변환
                }
              }}
              placeholder="사용자 코드 입력"
            />
          </div>

          <div className={styles.filter}>
            <button onClick={handleSearch}>검색</button>
          </div>

          {loginLogs.length !== 0 && (
            <div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>로그ID</th>
                    <th>생성 시간</th>
                    <th>설명</th>
                    <th>IP 주소</th>
                    <th>로그 유형</th>
                  </tr>
                </thead>
                <tbody>
                  {loginLogs.map((log) => (
                    <tr key={log.logId}>
                      <td>{log.logId}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>{log.description}</td>
                      <td>{log.ipAddress}</td>
                      <td>{log.logType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                <span>
                  페이지 {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
