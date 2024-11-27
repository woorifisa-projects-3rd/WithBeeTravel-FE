import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import ItemGroup from '@withbee/ui/item-group';
import { Menu } from '@withbee/ui/menu';
import { getTravelHome } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';

interface LayoutProps {
  params: {
    id: string;
  };
  children: React.ReactNode;
}
export default async function Layout({ children, params }: LayoutProps) {
  const { id } = params;
  const travelHomeResponse = await getTravelHome(Number(id));

  if ('code' in travelHomeResponse) {
    throw ERROR_MESSAGES['FETCH-FAILED'];
  }

  console.log('travelHomeResponse from layout page: ', travelHomeResponse);

  return (
    <>
      {/* // StoreInitializer로 서버에서 가져온 데이터를 클라이언트 스토어에 초기화 */}
      <main className={styles.container}>
        <Title label="공동 결제 내역" />
        <Menu className={styles.menu} travelInfo={travelHomeResponse.data!} />
        <ItemGroup />
        {children}
      </main>
    </>
  );
}
