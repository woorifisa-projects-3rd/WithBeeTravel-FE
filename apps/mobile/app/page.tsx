import { Button } from '@withbee/ui/button';
import { instance } from '@withbee/apis';
import '@withbee/styles';

export default async function Home() {
  const response = await instance.patch(
    '/api/travels/1/payments/1/participants',
    {
      body: JSON.stringify({
        travelMembersId: [17, 19, 22, 27],
      }),
      cache: 'no-store',
    },
  );

  console.log(response);

  return (
    <div>
      <h1>윗비트래블</h1>
      <div>모두들 화이팅 합시다!!</div>
      <Button label="기모철" />
    </div>
  );
}
