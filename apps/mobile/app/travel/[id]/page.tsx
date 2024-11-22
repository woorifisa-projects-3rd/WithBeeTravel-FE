import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { FriendImage } from '@withbee/ui/friend-image';
import Image from 'next/image';
import { BarChart } from '@withbee/ui/chart';
import Link from 'next/link';
import { getTravelHome } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import { formatDateWithSlash } from '@withbee/utils';

interface TravelHomeProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: TravelHomeProps) {
  const { id } = params;
  const response = await getTravelHome(Number(id));

  if (!('data' in response)) {
    throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
  }

  const { data } = response;

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
        <div className={styles.imgWrapper}>{/* <Image /> */}</div>
        <div className={styles.tagWrapper}>
          {!data!.isDomesticTravel &&
            data!.countries.map((country) => <Item label={country} />)}
        </div>
        <div className={styles.friendsWrapper}>
          {data!.travelMembers!.map((member) => (
            <FriendImage key={member} src={member} />
          ))}
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Link href={`/travel/${id}/payments`}>
          <Button label="그룹 결제 내역" />
        </Link>
        <Button label="친구 초대" primary={false} />
      </div>
      <BarChart
        expenses={Object.entries(data!.statistics).map(([key, value]) => ({
          category: key,
          amount: value,
        }))}
      />
    </div>
  );
}
