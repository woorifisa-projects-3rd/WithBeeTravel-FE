import React from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <h1>WithBee</h1>
      </Link>
    </header>
  );
};

export default Header;
