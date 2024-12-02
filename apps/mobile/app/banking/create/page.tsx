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

interface ProductOption {
  label: string;
  value: string;
  imageUrl: string; // 이미지 URL도 포함
  width?: number; // 이미지 너비
  detail: string;
}

const productOptions: ProductOption[] = [
  {
    label: 'WON통장',
    value: '자유 입출금 통장!',
    imageUrl: '/imgs/friends/friends2.png',
    detail:
      'WON통장은 자유롭게 입출금이 가능하며, 언제든지 필요한 금액을 찾을 수 있는 유용한 통장입니다. 예금 이율은 1.5%로, 일정 잔액을 유지하면 높은 이율을 제공합니다. 통장 관리가 간편하고, 모바일 뱅킹으로 언제든지 확인할 수 있습니다.',
  },
  {
    label: 'WON파킹통장',
    value: '돈을 모아봐요',
    imageUrl: '/imgs/friends/friends3.png',
    detail:
      'WON파킹통장은 저축의 목적을 가진 통장으로, 1년에 한 번씩 이자 지급을 받습니다. 이율은 2.5%로, 돈을 묶어놓고 장기적으로 관리하고 싶은 분들에게 적합합니다. 최소 잔액이 없고, 언제든지 자금을 이동할 수 있어 유연하게 사용할 수 있습니다.',
  },
  {
    label: '으쓱통장',
    value: '어깨가 으쓱으쓱',
    imageUrl: '/imgs/friends/friends4.png',
    width: 130,
    detail:
      '으쓱통장은 일정 금액 이상 예치하면 더 높은 이율을 제공하는 우대 통장입니다. 기본 이율은 1.8%이며, 우대 조건을 충족하면 최대 3.0%까지 이자를 받을 수 있습니다. 월 1회 자유로운 출금이 가능하며, 우대 혜택을 받으려면 최소 예치 금액이 필요합니다.',
  },
  {
    label: '우리닷컴통장',
    value: '모바일 전용 통장',
    imageUrl: '/imgs/friends/friends1.png',
    width: 120,
    detail:
      '우리닷컴통장은 모바일 전용 통장으로, 전통적인 은행 창구 없이 스마트폰으로만 계좌 관리가 가능합니다. 연 2.0%의 예금 이율을 제공하며, 온라인 전용 혜택과 빠른 송금 서비스를 지원합니다. 24시간 이용 가능한 모바일 뱅킹으로 언제든지 편리하게 사용 가능합니다.',
  },
  {
    label: '보통예금',
    value: 'SIMPLE IS BEST',
    imageUrl: '/imgs/friends/friends5.png',
    width: 120,
    detail:
      '보통예금은 간편한 예금 통장으로, 예치된 금액에 대해 연 1.2%의 기본 이율을 제공합니다. 예치 기간에 제한 없이 자유롭게 입출금이 가능하며, 예금액에 대한 이자는 매달 계산되어 지급됩니다. 간편하고 실용적인 통장으로, 적은 금액으로도 예금을 시작할 수 있습니다.',
  },
];

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
        router.push('/banking');
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
    <div className={styles.container}>
      <Title label="계좌 생성하기" />

      {/* 계좌 유형 선택 */}
      <div className={styles.accountContainer}>
        <label htmlFor="product" className={styles.label}>
          저축은 안전하고 꾸준하게
        </label>
        <div className={styles.detail}>편리한 입출금 계좌를 생성해요</div>
        <AccountSelection
          productOptions={productOptions}
          onSelect={handleAccountSelect}
        />
      </div>

      {/* 선택된 계좌 설명 표시 */}
      {selectedProduct && selectedProductDetails && (
        <div className={styles.productDetail}>
          {/* <h3>{selectedProductDetails.label}</h3> */}
          <p>{selectedProductDetails.detail}</p>
        </div>
      )}

      {/* 에러 메시지 */}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      {/* 계좌 생성 버튼 (선택된 계좌가 있을 때만 버튼 표시) */}
      {selectedProduct && (
        <Button
          label="계좌 생성하기"
          onClick={() => setIsModalOpen(true)}
          className={styles.button}
        />
      )}

      <PinNumberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 모달 닫기
        onSubmit={handleCreateAccount} // PIN 입력 후 제출 처리
      />
    </div>
  );
}
