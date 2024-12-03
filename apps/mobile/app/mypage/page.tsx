'use client';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { getMyPageInfo } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useEffect, useState } from 'react';
import { MyPageInfoResponse } from '@withbee/types';
import { FriendImage } from '@withbee/ui/friend-image';

export default function AccountPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<MyPageInfoResponse>();

  const handleGetMyPageInfo = async () => {
    const response = await getMyPageInfo();

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });

      throw new Error(response.code);
    }

    if ('data' in response) {
      setData(response.data);
    }
  };

  useEffect(() => {
    handleGetMyPageInfo();
  }, []);

  return (
    <>
      <Title label="마이 페이지" />
      <div className={styles.content}>
        <FriendImage
          src={data?.profileImage ? data?.profileImage : 1}
          size={100}
        />
        <span className={styles.username}>{data?.username}님</span>
        <button className={styles.logout}>로그아웃</button>
        <div className={styles.changeAccountWrapper}>
          <span className={styles.changeAccountTitle}>연결 계좌</span>
          <span className={styles.changeAccountComment}>
            정산 시에 사용되는 계좌입니다.
          </span>
          <span className={styles.account}>
            {data?.accountProduct} {data?.accountNumber}
          </span>
        </div>
      </div>
    </>
  );
}
