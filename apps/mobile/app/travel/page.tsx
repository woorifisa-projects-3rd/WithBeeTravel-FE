'use client';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import { InviteCodeModal } from '../../components/InviteCodeModal';

import BannerAds from '../../components/BannerAds';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postInviteCode, getTravelList } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import useSWR from 'swr';
import dayjs from 'dayjs';
import Link from 'next/link';
import { FriendImage } from '@withbee/ui/friend-image';
import { TravelListSkeleton } from '@withbee/ui/travel-list-skeleton';
import { useToast } from '@withbee/hooks/useToast';
import { motion } from 'framer-motion';
import { getIsCard } from '@withbee/apis';

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '초대 코드를 입력하세요.',
    closeLabel: '입력 완료',
    subtitle: '초대 코드를 입력하여 그룹에 가입하세요.',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inviteCode, setInviteCode] = useState(''); // 초대 코드 상태 추가

  useEffect(() => {
    const inviteCode = searchParams.get('inviteCode');
    if (inviteCode) {
      setInviteCode(inviteCode); // 쿼리 파라미터에서 초대 코드 설정

      setModalState((prevState) => ({
        ...prevState,
        title: '초대 코드 입력 완료',
        closeLabel: '초대 코드 제출',
        subtitle: '입력된 초대 코드를 사용하여 여행에 참여합니다.',
        inviteCode: inviteCode,
      }));
      setIsOpen(true);
    }
  }, [searchParams]);

  // 위비카드 소유하지 않으면 카드 발급 불가
  const { data: isCardData } = useSWR('isCard', getIsCard);
  const hasCard =
    isCardData && 'data' in isCardData && isCardData.data
      ? isCardData.data.connectedWibeeCard
      : undefined;

  const onCreateTravel = () => {
    const { showToast } = useToast();

    if (!hasCard) {
      showToast.error({
        message: '위비카드를 소유한 사용자만 여행을 생성할 수 있습니다.',
      });
      return;
    }

    router.push('/travel/form?mode=create');
  };

  const { data: travelData, error: travelError } = useSWR(
    'travelList',
    getTravelList,
  );
  if (travelData) {
    console.log('리스트 조회', travelData);
  }

  if (travelError && !travelData)
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );

  const isLoading = !travelError && !travelData;

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
      router.replace(`/travel/${response.data.travelId}`);
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
            if (a.dDay >= 0 && b.dDay >= 0) {
              return a.dDay - b.dDay;
            }
            if (a.dDay < 0 && b.dDay < 0) {
              return dayjs(b.travelStartDate).diff(dayjs(a.travelStartDate));
            }
            return b.dDay - a.dDay;
          })
      : [];

  const formatDday = (dDay: number) => (dDay === 0 ? 'D-DAY' : `D-${dDay}`);
  const upcomingTravels = sortedTravelData.filter((card) => card.dDay >= 0);
  const pastTravels = sortedTravelData.filter((card) => card.dDay < 0);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.travelSelectWrap}>
        <Title label="여행 선택" disableBack={true} />
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
          <button className={styles.button} onClick={onCreateTravel}>
            <div className={styles.buttonTitleWrap}>
              <p className={styles.buttonTitle}>여행 생성하기</p>
            </div>
            <div className={styles.imgWrap}>
              <Image
                src="/imgs/cardBenefits/1.png"
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
        {isLoading && <TravelListSkeleton count={3} />}
        {!isLoading && (
          <div className={styles.cardWrap}>
            {sortedTravelData.length === 0 ? (
              <div className={styles.emptyState}>
                <Image
                  src="/imgs/travelselect/emptyStateTrip.png" // 원하는 이미지 경로
                  alt="여행 데이터 없음"
                  className={styles.emptyStateImage}
                  width={170}
                  height={150}
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
                            다가오는 여행
                            <span> {formatDday(card.dDay)}</span>
                          </span>
                        </div>
                        <div className={styles.card}>
                          <Link href={`/travel/${card.travelId}`}>
                            <Image
                              src={
                                card.travelMainImage
                                  ? `/${card.travelMainImage}`
                                  : card.isDomesticTravel
                                    ? '/imgs/travelselect/jeju.png' // 제주도 이미지 경로
                                    : `/imgs/countries/${card.country[0]}.jpg`
                              }
                              alt={card.travelName}
                              className={styles.cardImage}
                              width={300}
                              height={100}
                              quality={100}
                            />
                            <div className={styles.cardContent}>
                              <div className={styles.cardText}>
                                <FriendImage src={card.profileImage} />
                                <div className={styles.travelNameWrap}>
                                  <span>{card.travelName}</span>
                                  <span className={styles.date}>
                                    {card.travelStartDate} ~{' '}
                                    {card.travelEndDate}
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
                <BannerAds />
                {/* 지난 여행 렌더링 */}
                {pastTravels.length > 0 && (
                  <>
                    <div className={styles.cardDay}>
                      <p className={styles.pastTravelTitle}>지난 여행</p>
                    </div>
                    {pastTravels.map((card, index) => (
                      <div key={index}>
                        <div className={styles.card}>
                          <Link href={`/travel/${card.travelId}`}>
                            <Image
                              src={
                                card.travelMainImage
                                  ? `/${card.travelMainImage}`
                                  : card.isDomesticTravel
                                    ? '/imgs/travelselect/jeju.png' // 제주도 이미지 경로
                                    : `/imgs/countries/${card.country[0]}.jpg`
                              }
                              alt={card.travelName}
                              className={styles.cardImage}
                              width={300}
                              height={100}
                              quality={100}
                            />
                            <div className={styles.cardContent}>
                              <div className={styles.cardText}>
                                <FriendImage src={card.profileImage} />
                                <div className={styles.travelNameWrap}>
                                  <span>{card.travelName}</span>
                                  <span className={styles.date}>
                                    {card.travelStartDate} ~{' '}
                                    {card.travelEndDate}
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
        )}

        <InviteCodeModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={handleInviteCodeSubmit}
          modalState={modalState}
        />
      </div>
    </Suspense>
  );
}
