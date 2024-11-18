'use client';
import React, { useState } from 'react';
import { Title } from '@withbee/ui/title'; // 제목 UI
import { Button } from '@withbee/ui/button'; // 버튼 UI
import styles from './page.module.css'; // CSS 모듈
import { instance } from '@withbee/apis'; // API 요청을 위한 instance
import { useRouter } from 'next/navigation';

interface ProductOption {
  label: string;
  value: string;
}

export default function CreateAccountPage() {
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState<string>(''); // 선택된 계좌 유형
  const [errorMessage, setErrorMessage] = useState<string>(''); // 에러 메시지 상태

  // Product 목록
  const productOptions = [
    'WON통장',
    '우리닷컴통장',
    '우리아이행복통장',
    'WON파킹통장',
    '으쓱통장',
    '보통예금',
  ];

  // 계좌 생성 핸들러
  const handleCreateAccount = async () => {
    if (!selectedProduct) {
      setErrorMessage('계좌 유형을 선택해주세요.');
      return;
    }

    const CreateAccount = {
      product: selectedProduct,
    };

    try {
      const response = await instance.post('/accounts', {
        body: JSON.stringify(CreateAccount),
      });

      if (response.status === 201) {
        alert('계좌 생성 완료');
        router.push('/banking');
      } else {
        setErrorMessage('계좌 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setErrorMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Title label="계좌 생성하기" />

      {/* 계좌 유형 선택 */}
      <div className={styles.formSection}>
        <label htmlFor="product" className={styles.label}>
          계좌 유형 선택
        </label>
        <select
          id="product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className={styles.select}  // 여기에 className 추가
        >
          <option value="">-- 선택하세요 --</option>
          {productOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* 에러 메시지 */}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      {/* 계좌 생성 버튼 */}
      <div className={styles.formSection}>
        <Button
          label="계좌 생성하기"
          onClick={handleCreateAccount}
          size="medium"
        />
      </div>
    </div>
  );
}
