'use client';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import {
  getMyPageInfo,
  getAccountList,
  postConnectedAccount,
} from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useEffect, useState } from 'react';
import { accountType, MyPageInfoResponse } from '@withbee/types';
import { FriendImage } from '@withbee/ui/friend-image';
import { Modal } from '@withbee/ui/modal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { handleSignOut } from '../actions/authActions';
import { useSession } from 'next-auth/react';

interface Account {
  accountId: number;
  product: string;
  accountNumber: string;
}

export default function Page() {
  const { showToast } = useToast();
  const [data, setData] = useState<MyPageInfoResponse>();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<accountType>();
  const { data: session, status } = useSession();

  const router = useRouter();

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

  const handleGetAccountList = async () => {
    const response = await getAccountList();

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });

      throw new Error(response.code);
    }

    if (response.data) {
      setAccounts(response.data);
    }
  };

  const handleAccountSelection = (account: Account) => {
    // 기존과 동일한 계좌를 고른 경우
    if (data?.accountNumber === account.accountNumber) {
      setSelectedAccount(null);
    } else {
      setSelectedAccount(account);
    }
  };

  const handleAccountChangeSubmit = async () => {
    if (selectedAccount) {
      const response = await postConnectedAccount(
        selectedAccount.accountId,
        false,
      );

      if ('code' in response) {
        showToast.error({
          message: response.message || '알 수 없는 오류가 발생했습니다.',
        });
        throw new Error(
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES],
        );
      }

      if (data) {
        setData({
          ...data,
          accountProduct: selectedAccount.product,
          accountNumber: selectedAccount.accountNumber,
        });
      }
    }
    setIsAccountModalOpen(false);
  };

  const handleAccountModalClose = () => {
    setSelectedAccount(null);
    setIsAccountModalOpen(false);
  };

  const handleLogout = async () => {
    const { accessToken, refreshToken } = session?.user!;
    if (accessToken && refreshToken) handleSignOut(accessToken, refreshToken);
    router.push('/login');
  };

  useEffect(() => {
    handleGetMyPageInfo();
  }, []);

  useEffect(() => {
    handleGetAccountList();
  }, [isAccountModalOpen === true]);

  return (
    <>
      <Title label="마이 페이지" />
      <div className={styles.content}>
        <FriendImage
          src={data?.profileImage ? data?.profileImage : 1}
          size={100}
        />
        <span className={styles.username}>{data?.username}님</span>
        <button className={styles.logout} onClick={handleLogout}>
          로그아웃
        </button>
        <div
          className={styles.changeAccountWrapper}
          onClick={() => setIsAccountModalOpen(true)}
        >
          <span className={styles.changeAccountTitle}>연결 계좌</span>
          <span className={styles.changeAccountComment}>
            정산 시에 사용되는 계좌입니다.
          </span>
          <span className={styles.account}>
            {data?.accountProduct} {data?.accountNumber}
          </span>
        </div>
      </div>

      <Modal
        isOpen={isAccountModalOpen}
        onClose={handleAccountModalClose}
        title="여행에 연결할 계좌를 선택해주세요."
        closeLabel={
          Array.isArray(accounts) && accounts.length > 0
            ? '선택 완료'
            : '계좌 생성하러 가기'
        }
        onSubmit={
          Array.isArray(accounts) && accounts.length > 0
            ? handleAccountChangeSubmit
            : () => {
                // 계좌 목록이 비어있을 때 링크로 이동
                router.push('/banking/create');
              }
        }
      >
        <div className={styles.accountList}>
          {Array.isArray(accounts) && accounts.length > 0 ? (
            accounts.map((account: Account) => (
              <div
                key={account.accountId}
                className={styles.accountItem}
                onClick={() => handleAccountSelection(account)}
              >
                <div className={styles.accountInfo}>
                  <p className={styles.accountNumber}>
                    {account.accountNumber}
                  </p>
                  <p className={styles.product}>{account.product}</p>
                </div>
                {selectedAccount?.accountId === account.accountId ||
                (selectedAccount === null &&
                  data?.accountNumber === account.accountNumber) ? (
                  <Image
                    src="/check.png"
                    alt="select"
                    width={30}
                    height={30}
                    className={styles.selectIcon}
                  />
                ) : (
                  <Image
                    src="/uncheck.png"
                    alt="not select"
                    width={30}
                    height={30}
                    className={styles.notSelectIcon}
                  />
                )}
              </div>
            ))
          ) : (
            <p>연결된 계좌가 없습니다.</p>
          )}
        </div>
      </Modal>
    </>
  );
}
