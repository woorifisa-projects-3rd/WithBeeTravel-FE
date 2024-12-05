import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import { Title } from '@withbee/ui/title';
import { FriendImage } from '@withbee/ui/friend-image';
import { BarChart } from '@withbee/ui/chart';
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

  if (!data) {
    throw new Error('Travel data not found');
  }

  const statistics = Object.entries(data.statistics);
  const travelCountriesCount = data.countries?.length;

  return (
    <div className={styles.container}>
      <Title label="여행 홈" />
      <div className={styles.subContainer}>
        <div className={styles.subtitleContainer}>
          <p className={styles.date}>
            {formatDateWithSlash(data.travelStartDate)} ~{' '}
            {formatDateWithSlash(data.travelEndDate)}
          </p>
          <div className={styles.subtitleWrapper}>
            <h2 className={styles.subtitle}>{data.travelName}</h2>
            <Link
              href={`/travel/${travelId}/form?mode=edit`}
              className={styles.button}
            >
              <Image src="/edit.png" alt="edit" width={19} height={17.94} />
            </Link>
          </div>
        </div>
        <div className={styles.imgWrapper}>
          {data.mainImage && (
            <Image
              src={data.mainImage}
              alt="main image"
              layout="fill"
              objectFit="cover"
              className={styles.mainImage}
            />
          )}
        </div>

        {data.isDomesticTravel ? (
          <Item label="국내여행" />
        ) : (
          <div className={styles.tagWrapper}>
            {data.countries.map((country) => (
              <Item
                key={country}
                label={travelCountriesCount < 2 ? `${country} 여행` : country}
              />
            ))}
          </div>
        )}
        <div className={styles.friendsWrapper}>
          {data.travelMembers &&
            data.travelMembers.map((member) => (
              <FriendImage
                key={member.id}
                src={member.profileImage}
                isGroup={data.travelMembers.length > 1}
              />
            ))}
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <Link href={`/travel/${travelId}/payments`}>
          <Button label="그룹 결제 내역" />
        </Link>

        {data.settlementStatus !== 'DONE' ? (
          <InviteCodeButton travelId={travelId} />
        ) : (
          <Link href={`/travel/${travelId}/honey-capsule`}>
            <Button label="허니캡슐 열어보기" primary={false} />
          </Link>
        )}
      </div>
      {statistics.length !== 0 && (
        <BarChart
          expenses={statistics.map(([key, value]) => ({
            category: key,
            amount: value,
          }))}
        />
      )}
    </div>
  );
}
