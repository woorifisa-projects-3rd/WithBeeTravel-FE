'use client';
import { useState } from 'react';
import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { FriendImage } from '@withbee/ui/friend-image';
import Image from 'next/image';
import { BarChart } from '@withbee/ui/chart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InviteCodeModal } from '../../../components/InviteCodeModal';
import { getInviteCode } from '@withbee/apis';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default function Page({ params }: { params: Params }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '초대 코드를 공유하세요.',
    closeLabel: '닫기',
    subtitle: '초대 코드를 복사하여 친구를 초대하세요.',
    isCopyMode: false,
    inviteCode: '',
  });
  const router = useRouter();
  const travelId = Number(params.id);

  const handleGetInviteCode = async (travelId: number) => {
    const response = await getInviteCode(travelId);

    if ('code' in response) {
      alert(response.message);
      throw response; // 에러 코드가 있는 응답은 그대로 throw
    }

    if ('data' in response && response.data) {
      // 초대 코드 처리 로직
      setModalState((prevState) => ({
        ...prevState,
        isOpen: true,
        isCopyMode: true, // 복사 모드 활성화
        inviteCode: response.data!.inviteCode,
      }));
    }
  };

  return (
    <div className={styles.container}>
      <Title label="여행 홈" />
      <div className={styles.subContainer}>
        <div className={styles.subtitleContainer}>
          <p className={styles.date}>2022/12/25 ~ 2023/01/01</p>
          <div className={styles.subtitleWrapper}>
            <h2 className={styles.subtitle}>팀 호초루의 여행</h2>
            <button
              className={styles.button}
              onClick={() => router.push('/travel/form?mode=edit')}
            >
              <Image src="/edit.png" alt="edit" width={19} height={17.94} />
            </button>
          </div>
        </div>
        <div className={styles.imgWrapper}>{/* <Image /> */}</div>
        <div className={styles.tagWrapper}>
          <Item label="오스트리아" />
          <Item label="포르투갈" />
          <Item label="스위스" />
        </div>
        <div className={styles.friendsWrapper}>
          {[1, 2, 3, 4, 5].map((number) => (
            <FriendImage src={''} />
          ))}
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Link href="/travel/1/payments">
          <Button label="그룹 결제 내역" />
        </Link>
        <Button
          label="친구 초대"
          primary={false}
          onClick={() => handleGetInviteCode(travelId)}
        />
      </div>

      <InviteCodeModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        modalState={modalState}
      />
      <BarChart />
    </div>
  );
}
