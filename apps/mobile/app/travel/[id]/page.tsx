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

  const statistics = Object.entries(data!.statistics);
  const travelCountriesCount = data?.countries.length;

  return (
    <div className={styles.container}>
      <Title label="여행 홈" />
      <div className={styles.subContainer}>
        <div className={styles.subtitleContainer}>
          <p className={styles.date}>
            {formatDateWithSlash(data!.travelStartDate)} ~{' '}
            {formatDateWithSlash(data!.travelEndDate)}
          </p>
          <div className={styles.subtitleWrapper}>
            <h2 className={styles.subtitle}>{data!.travelName}</h2>
            <Link href="/travel/form?mode=edit" className={styles.button}>
              <Image src="/edit.png" alt="edit" width={19} height={17.94} />
            </Link>
          </div>
        </div>
        <div className={styles.imgWrapper}>{/* Placeholder for image */}</div>

        {data?.isDomesticTravel ? (
          <Item label="국내여행" />
        ) : (
          <div className={styles.tagWrapper}>
            {data!.countries.map((country) => (
              /* 여행지가 2개 미만이면 label 뒤에 '여행'을 붙임 */
              <Item
                key={country}
                label={travelCountriesCount! < 2 ? `${country} 여행` : country}
              />
            ))}
          </div>
        )}
        <div className={styles.friendsWrapper}>
          {data!.travelMembers!.map((member) => (
            <FriendImage key={member} src={member} />
          ))}
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <Link href={`/travel/${travelId}/payments`}>
          <Button label="그룹 결제 내역" />
        </Link>

        <InviteCodeButton travelId={travelId} />
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
