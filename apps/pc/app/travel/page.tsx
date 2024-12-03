'use client';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import { InviteCodeModal } from '../../components/InviteCodeModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postInviteCode, getTravelList } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import useSWR from 'swr';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FriendImage } from '@withbee/ui/friend-image';
import { useToast } from '@withbee/hooks/useToast';
import { motion } from 'framer-motion';

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '초대 코드를 입력하세요.',
    closeLabel: '입력 완료',
    subtitle: '초대 코드를 입력하여 그룹에 가입하세요.',
  });
  const router = useRouter();

  const { data: travelData, error } = useSWR('travelList', getTravelList);

  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!travelData)
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );

  // 초대코드에 맞는 여행 홈으로 이동
  const handleInviteCodeSubmit = async (inviteCode: string) => {
    const { showToast } = useToast();

    const response = await postInviteCode(inviteCode);

    if ('code' in response) {
      showToast.error({
        message: response.message || '알 수 없는 오류가 발생했습니다.',
      });
      throw new Error(
        ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES],
      );
    }

    if ('data' in response && response.data) {
      router.push(`/travel/${response.data.travelId}`);
    }
  };

  // 여행 데이터 정렬
  const sortedTravelData =
    travelData && 'data' in travelData && Array.isArray(travelData.data)
      ? travelData.data
          .map((card) => {
            const today = dayjs().startOf('day');

            const startDate = dayjs(card.travelStartDate).startOf('day');
            const dDay = startDate.diff(today, 'day');
            return { ...card, dDay };
          })
          .sort((a, b) => {
            // 둘 다 다가오는 여행인 경우 D-day 오름차순
            if (a.dDay >= 0 && b.dDay >= 0) {
              return a.dDay - b.dDay;
            }
            // 둘 다 지난 여행인 경우 시작일 기준 내림차순 (최신순)
            if (a.dDay < 0 && b.dDay < 0) {
              return dayjs(b.travelStartDate).diff(dayjs(a.travelStartDate));
            }
            // 다가오는 여행을 먼저 보여주기
            return b.dDay - a.dDay;
          })
      : [];

  const upcomingTravels = sortedTravelData.filter((card) => card.dDay >= 0);
  const pastTravels = sortedTravelData.filter((card) => card.dDay < 0);

  return (
    <div className={styles.travelSelectWrap}>
      <Title label="여행 선택" />
      <div className={styles.imageWrap}>
        <Image
          src="/imgs/travelselect/withbee_friends.png"
          alt="위비프렌즈친구들"
          className={styles.withbeeFriendsImg}
          width={500}
          height={500}
        />
      </div>

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
              layout="intrinsic"
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
              layout="intrinsic"
            />
          </div>
        </button>
      </div>

      <div className={styles.cardWrap}>
        {sortedTravelData.length === 0 ? (
          <div className={styles.emptyState}>
            <Image
              src="/imgs/travelselect/emptyStateTrip.png" // 원하는 이미지 경로
              alt="여행 데이터 없음"
              className={styles.emptyStateImage}
              width={230}
              height={200}
              quality={100}
            />
            <p className={styles.emptyStateMessage}>
              현재 참여한 여행이 없습니다. <br />
              여행을 생성하고 친구를 초대해보세요.
            </p>
          </div>
        ) : (
          <div className={styles.cardWrap}>
            {/* 다가오는 여행 렌더링 */}
            {upcomingTravels.length > 0 && (
              <>
                {upcomingTravels.map((card, index) => (
                  <div key={index}>
                    <div className={styles.cardDay}>
                      <span>
                        다가오는 여행 <span>D-{card.dDay}</span>
                      </span>
                    </div>
                    <div className={styles.card}>
                      <Link href={`/travel/${card.travelId}`}>
                        <Image
                          src={
                            card.travelMainImage
                              ? `/${card.travelMainImage}`
                              : '/imgs/travelselect/travel_exam.png'
                          }
                          alt={card.travelName}
                          className={styles.cardImage}
                          width={300}
                          height={100}
                        />
                        <div className={styles.cardContent}>
                          <div className={styles.cardText}>
                            <FriendImage src={card.profileImage} />
                            <div className={styles.travelNameWrap}>
                              <span>{card.travelName}</span>
                              <span className={styles.date}>
                                {card.travelStartDate} ~ {card.travelEndDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* 지난 여행 렌더링 */}
            {pastTravels.length > 0 && (
              <>
                <div className={styles.cardDay}>
                  <span>지난 여행</span>
                </div>
                {pastTravels.map((card, index) => (
                  <div key={index}>
                    <div className={styles.card}>
                      <Link href={`/travel/${card.travelId}`}>
                        <Image
                          src={
                            card.travelMainImage
                              ? `/${card.travelMainImage}`
                              : '/imgs/travelselect/travel_exam.png'
                          }
                          alt={card.travelName}
                          className={styles.cardImage}
                          width={300}
                          height={100}
                        />
                        <div className={styles.cardContent}>
                          <div className={styles.cardText}>
                            <FriendImage src={card.profileImage} />
                            <div className={styles.travelNameWrap}>
                              <span>{card.travelName}</span>
                              <span className={styles.date}>
                                {card.travelStartDate} ~ {card.travelEndDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <InviteCodeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleInviteCodeSubmit}
        modalState={modalState}
      />
    </div>
  );
}
