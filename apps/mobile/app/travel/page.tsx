'use client';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import withbeeFriends from '../../public/imgs/travelselect/withbee_friends.png';
import background from '../../public/imgs/travelselect/withbee_friends_background.png';
import plane from '../../public/imgs/travelselect/travel_select_plane.png';
import inviteCode from '../../public/imgs/travelselect/travel_select_invitecode.png';
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

  return (
    <div className={styles.travelSelectWrap}>
      <Title label="여행 선택하기" />
      {/* 위비프렌즈이미지 */}
      <div className={styles.imageWrap}>
        <Image
          src={withbeeFriends}
          alt="위비프렌즈친구들"
          className={styles.withbeeFriendsImg}
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
            <Image src={plane} alt="비행기 아이콘" className={styles.icon} />
          </div>
        </button>
        <button className={styles.button} onClick={() => setIsOpen(true)}>
          <div className={styles.buttonTitleWrap}>
            <p className={styles.buttonTitle}>초대 코드 입력하기</p>
          </div>
          <div className={styles.imgWrap}>
            <Image
              src={inviteCode}
              alt="초대코드 아이콘"
              className={styles.icon}
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
                  src={plane}
                  alt="비행기 아이콘"
                  className={styles.icon}
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
        onClose={() => setIsOpen(false)}
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