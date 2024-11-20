'use client';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import travelExam from '../../public/imgs/travelselect/travel_exam.png';
import { Modal } from '@withbee/ui/modal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  const cards = [
    {
      image: '/api/placeholder/400/200',
      travelName: '호초룰루랄라',
      date: '2024/12/24',
    },
    {
      image: '/api/placeholder/400/200',
      travelName: '진콩패키지',
      date: '2024/12/24~2025/01/05',
    },
  ];

  // 초대코드에 맞는 그룹으로 이동하는 함수
  const handleInviteCodeSubmit = () => {
    // 여기서 초대 코드로 그룹을 찾는 로직을 구현
    // 예를 들어, 입력된 초대 코드가 특정 그룹 ID와 일치한다고 가정할 수 있습니다.

    // 그룹 ID가 일치하는지 확인 (실제 상황에서는 서버에서 그룹을 조회해야 할 수도 있습니다)
    // const group = cards.find((card) => card.groupId === code);

    if (true) {
      // 그룹이 존재하면 해당 그룹의 홈으로 이동
      router.push(`/travel/1`);
    } else {
      alert('잘못된 초대 코드입니다.');
    }
  };

  return (
    <div className={styles.travelSelectWrap}>
      <Title label="여행 선택" />
      {/* 위비프렌즈이미지 */}
      <div className={styles.imageWrap}>
        <Image
          src="/imgs/travelselect/withbee_friends.png"
          alt="위비프렌즈친구들"
          className={styles.withbeeFriendsImg}
          width={500}
          height={500}
        />
      </div>

      {/* 여행생성, 초대코드 버튼 */}
      <div className={styles.buttonWrap}>
        <button
          className={styles.button}
          onClick={() => router.push('/travel/form?mode=create')}
        >
          <div className={styles.buttonTitleWrap}>
            <p className={styles.buttonTitle}>여행 생성하기</p>
          </div>
          <div className={styles.imgWrap}>
            <Image
              src="/imgs/travelselect/travel_select_plane.png"
              alt="비행기 아이콘"
              className={styles.icon}
              width={50}
              height={50}
            />
          </div>
        </button>
        <button className={styles.button} onClick={() => setIsOpen(true)}>
          <div className={styles.buttonTitleWrap}>
            <p className={styles.buttonTitle}>초대 코드 입력하기</p>
          </div>
          <div className={styles.imgWrap}>
            <Image
              src="/imgs/travelselect/travel_select_invitecode.png"
              alt="초대코드 아이콘"
              className={styles.icon}
              width={50}
              height={50}
            />
          </div>
        </button>
      </div>

      {/* 생성한 그룹 나열하기 */}
      <div className={styles.cardWrap}>
        {cards.map((card, index) => (
          <div key={index} className={styles.card}>
            <Image
              src={travelExam}
              alt={card.travelName}
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <div className={styles.cardText}>
                <Image
                  src="/imgs/travelselect/travel_select_plane.png"
                  alt="비행기 아이콘"
                  className={styles.icon}
                  width={50}
                  height={50}
                />
                <div className={styles.travelNameWrap}>
                  <span>{card.travelName}</span>
                  <span className={styles.date}>{card.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 모달 */}
      <Modal
        isOpen={isOpen}
        onClose={handleInviteCodeSubmit}
        title="초대코드를 입력해주세요."
        closeLabel="입력 완료"
      >
        <p className={styles.subtitle}>
          초대 코드를 입력하여 그룹에 가입하세요.
        </p>
        <input
          id="inviteCode"
          type="text"
          className={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="초대코드"
        />
      </Modal>
    </div>
  );
}
