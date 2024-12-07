'use client';
import React, { useState } from 'react';
import { Title } from '@withbee/ui/title'; // 제목 UI
import { Button } from '@withbee/ui/button'; // 버튼 UI
import styles from './page.module.css'; // CSS 모듈
import { createAccount } from '@withbee/apis'; // API 요청을 위한 instance
import { useRouter } from 'next/navigation';
import { useToast } from '@withbee/hooks/useToast';
import PinNumberModal from '../../../components/PinNumberModal';
import AccountSelection from '../../../components/AccountSelection';
import { motion } from 'framer-motion';
import { productOptions } from '@withbee/utils';
import { ButtonBanking } from '@withbee/ui/banking-button';

export default function CreateAccountPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<string>(''); // 선택된 계좌 유형
  const [errorMessage, setErrorMessage] = useState<string>(''); // 에러 메시지 상태
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 열기/닫기 상태

  const { showToast } = useToast();

  // Product 목록

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
      const response = await createAccount(selectedProduct);

      if (Number(response.status) === 201) {
        showToast.success({ message: '계좌 생성 완료!' });
        router.replace('/banking');
      } else {
        setErrorMessage('계좌 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setErrorMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(error);
    }
  };

  // 계좌 선택 핸들러
  const handleAccountSelect = (selectedProduct: string) => {
    setSelectedProduct(selectedProduct); // 선택된 계좌의 value를 selectedProduct 상태에 저장
  };

  // 선택된 계좌의 상세 정보
  const selectedProductDetails = productOptions.find(
    (option) => option.label === selectedProduct,
  );

  return (
    <>
      <Title label="통장 만들기" />

      <div className={styles.container}>
        <div className={styles.mainContent}>
          <motion.div
            className={styles.accountContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.label
              htmlFor="product"
              className={styles.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              저축은 안전하고 꾸준하게
            </motion.label>

            <motion.div
              className={styles.detail}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              편리한 입출금 계좌를 생성해요
            </motion.div>

            <AccountSelection
              productOptions={productOptions}
              onSelect={handleAccountSelect}
            />
          </motion.div>

          {selectedProduct && selectedProductDetails && (
            <motion.div
              className={styles.productDetail}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <p className={styles.productDetailText}>{selectedProductDetails.detail}</p>
            </motion.div>
          )}
        </div>

        {errorMessage && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}

        {selectedProduct && (
          <motion.div className={styles.buttonWrapper}>
            <ButtonBanking
              label={`${selectedProduct} 만들기`}
              onClick={() => setIsModalOpen(true)}
              className={styles.button}
            />
          </motion.div>
        )}

        <PinNumberModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAccount}
        />
      </div>
    </>
  );
}
