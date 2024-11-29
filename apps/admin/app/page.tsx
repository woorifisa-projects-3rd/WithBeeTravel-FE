import { render } from 'react-dom';
import React from 'react';
import styles from './page.module.css'; // CSS 모듈 임포트

const AdminDashboard = () => {
  return (
    <div className={styles.container}>
      {/* Header Navigation */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Admin Page</h1>

        <nav>
          <ul className={styles.navList}>
            <li>
              <a className={styles.navItem}>Members</a>
            </li>
            <li>
              <a className={styles.navItem}>Accounts</a>
            </li>
            <li>
              <a className={styles.navItem}>Trips</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Gray Banner */}
      <div className={styles.banner}>
        <h2 className={styles.bannerTitle}>WithBee Admin</h2>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h3 className={styles.sectionTitle}>관리하기</h3>

        <div className={styles.buttonContainer}>
          <button className={styles.button}>회원 관리</button>
          <button className={styles.button}>계좌 관리</button>
          <button className={styles.button}>여행 관리</button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
