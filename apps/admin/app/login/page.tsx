'use client';

import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import styles from './page.module.css';
import { handleCredentialsSignin } from '../actions/authActions';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log('Login attempt:', formData);
    await handleCredentialsSignin({
      email: formData.email,
      password: formData.password,
    });

    // 로그인 성공 시 리다이렉트
    window.location.href = '/';
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>관리자 로그인</h1>
        </div>
        <div className={styles.loginContent}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">아이디</label>
              <div className={styles.inputContainer}>
                <User className={styles.inputIcon} />
                <input
                  id="email"
                  placeholder="아이디를 입력하세요"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">비밀번호</label>
              <div className={styles.inputContainer}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
            <button type="submit" className={styles.loginButton}>
              로그인
            </button>
          </form>
        </div>
        <div className={styles.loginFooter}>
          <p>
            비밀번호를 잊으셨나요? <a href="#">비밀번호 찾기</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
