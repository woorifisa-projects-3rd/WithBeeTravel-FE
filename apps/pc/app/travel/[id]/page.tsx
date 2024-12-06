import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import { Title } from '@withbee/ui/title';
import { FriendImage } from '@withbee/ui/friend-image';
import { BarChart, PieChart } from '@withbee/ui/chart';
import Link from 'next/link';
import { getTravelHome } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import { formatDateWithSlash } from '@withbee/utils';
import { InviteCodeButton } from './invite-code-button';
import styles from './page.module.css';
import Image from 'next/image';

interface TravelHomeProps {
  params: {
    id: string;
  };
}

export default async function TravelDetailPage({ params }: TravelHomeProps) {
  const travelId = Number(params.id);
  const response = await getTravelHome(travelId);

  if (!('data' in response)) {
    throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
  }

  const { data } = response;

  const statistics = Object.entries(data!.statistics);
  const travelCountriesCount = data?.countries.length;

  return (
    <div className={styles.container}>
      <h2 className="title">여행 홈</h2>
      <div className={styles.subContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.imgWrapper}>{/* Placeholder for image */}</div>

          <div className={styles.subtitleContainer}>
            <div className={styles.subtitleWrapper}>
              <p className={styles.date}>
                {formatDateWithSlash(data!.travelStartDate)} ~{' '}
                {formatDateWithSlash(data!.travelEndDate)}
              </p>
              <div className={styles.travelInfo}>
                <h2 className={styles.travelName}>{data!.travelName}</h2>
                <Link
                  href={`/travel/${travelId}/form?mode=edit`}
                  className={styles.button}
                >
                  <Image src="/edit.png" alt="edit" width={25} height={24} />
                </Link>
              </div>
              {data?.isDomesticTravel ? (
                <Item label="국내여행" />
              ) : (
                <div className={styles.tagWrapper}>
                  {data!.countries.map((country) => (
                    /* 여행지가 2개 미만이면 label 뒤에 '여행'을 붙임 */
                    <Item
                      key={country}
                      label={
                        travelCountriesCount! < 2 ? `${country} 여행` : country
                      }
                    />
                  ))}
                </div>
              )}
            </div>
            <div className={styles.friendsWrapper}>
              {data!.travelMembers!.map((member) => (
                <FriendImage
                  key={member.id}
                  src={member.profileImage}
                  size={50}
                  isGroup={data!.travelMembers!.length > 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {statistics.length !== 0 && (
        <div className={styles.chartWrapper}>
          <BarChart
            ratio={1.2}
            expenses={statistics.map(([key, value]) => ({
              category: key,
              amount: value,
            }))}
          />
          <PieChart
            expenses={statistics.map(([key, value]) => ({
              category: key,
              amount: value,
            }))}
          />
        </div>
      )}
      <div className={styles.btnWrapper}>
        <Link href={`/travel/${travelId}/payments`}>
          <Button label="그룹 결제 내역" size="xlarge" />
        </Link>

        {data?.settlementStatus !== 'DONE' ? (
          <InviteCodeButton travelId={travelId} size="large" />
        ) : (
          <Link href={`/travel/${travelId}/honey-capsule`}>
            <Button label="허니캡슐 열어보기" primary={false} />
          </Link>
        )}
      </div>
    </div>
  );
}
