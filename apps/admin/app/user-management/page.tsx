'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import {
  Pageable,
  UserResponse,
} from '../../../../packages/types/src/adminType';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { getUserList } from '../../../../packages/apis/src/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [pageable, setPageable] = useState<Pageable | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchName, setSearchName] = useState<string>('');

  const fetchUsers = async (page: number, name: string = '') => {
    setLoading(true);
    try {
      const response = await getUserList(page, 10, name);

      if ('data' in response && response.data) {
        // @ts-ignore
        setUsers(response.data.content);
        setPageable(response.data.pageable); // @ts-ignore
        setTotalPages(response.data.totalPages);
      } else {
        // @ts-ignore
        console.error('Error:', response.error);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchName);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, searchName);
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
          <h1 className={styles.pageTitle}>사용자 관리</h1>

          <div className={styles.filter}>
            <label htmlFor="searchName">사용자 이름:</label>
            <input
              type="text"
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="사용자 이름으로 검색"
            />
          </div>

          <div className={styles.filter}>
            <button onClick={handleSearch}>검색</button>
          </div>

          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이메일</th>
                    <th>이름</th>
                    <th>PIN 잠금 여부</th>
                    <th>역할</th>
                    <th>가입일</th>
                    <th>최근 로그인</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.userEmail}</td>
                      <td>{user.userName}</td>
                      <td>{user.userPinLocked ? '잠김' : '정상'}</td>
                      <td>{user.userRoleType}</td>
                      <td>{new Date(user.createAt).toLocaleString()}</td>
                      <td>{new Date(user.recentLogin).toLocaleString()}</td>
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

export default UserManagement;
