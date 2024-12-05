import React from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Admin</h2>
      <nav>
        <ul className={styles.sidebarNav}>
          <li>
            <Link href="/login-logs" className={styles.sidebarLink}>
              로그인 기록 조회
            </Link>
          </li>
          <li>
            <Link href="/user-management" className={styles.sidebarLink}>
              회원 관리
            </Link>
          </li>
          <li>
            <Link href="/travel-management" className={styles.sidebarLink}>
              여행 관리
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
