// app/travel/[id]/page.tsx
import { Title } from '@withbee/ui/title';
import { Item } from '@withbee/ui/item';
import { FriendImage } from '@withbee/ui/friend-image';
import { BarChart } from '@withbee/ui/chart';
import Link from 'next/link';
import styles from './page.module.css';
import { Button } from '@withbee/ui/button';
import { InviteCodeButton } from './invite-code-button';

// Server component fetching travel details
async function getTravelDetails(travelId: number) {
  // Implement your server-side data fetching logic here
  // This is a placeholder - replace with actual data fetching
  return {
    dates: '2022/12/25 ~ 2023/01/01',
    title: '팀 호초루의 여행',
    destinations: ['오스트리아', '포르투갈', '스위스'],
    friends: [1, 2, 3, 4, 5],
  };
}

export default async function TravelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const travelId = Number(params.id);
  const travelDetails = await getTravelDetails(travelId);

  return (
    <div className={styles.container}>
      <Title label="여행 홈" />
      <div className={styles.subContainer}>
        <div className={styles.subtitleContainer}>
          <p className={styles.date}>{travelDetails.dates}</p>
          <div className={styles.subtitleWrapper}>
            <h2 className={styles.subtitle}>{travelDetails.title}</h2>
            <Link
              href={`/travel/form?mode=edit&id=${travelId}`}
              className={styles.button}
            >
              <img src="/edit.png" alt="edit" width={19} height={17.94} />
            </Link>
          </div>
        </div>

        <div className={styles.imgWrapper}>{/* Placeholder for image */}</div>

        <div className={styles.tagWrapper}>
          {travelDetails.destinations.map((destination, index) => (
            <Item key={index} label={destination} />
          ))}
        </div>

        <div className={styles.friendsWrapper}>
          {travelDetails.friends.map((friend) => (
            <FriendImage key={friend} src="" />
          ))}
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <Link href={`/travel/${travelId}/payments`}>
          <Button label="그룹 결제 내역" />
        </Link>

        <InviteCodeButton travelId={travelId} />
      </div>

      <BarChart />
    </div>
  );
}
