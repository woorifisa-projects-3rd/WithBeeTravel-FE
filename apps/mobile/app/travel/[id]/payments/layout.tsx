import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import ItemGroup from '@withbee/ui/item-group';
import { Menu } from '@withbee/ui/menu';

interface LayoutProps {
  params: {
    id: string;
  };
  children: React.ReactNode;
}
export default async function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* // StoreInitializer로 서버에서 가져온 데이터를 클라이언트 스토어에 초기화 */}
      <main className={styles.container}>
        <Title label="공동 결제 내역" />
        <Menu className={styles.menu} />
        <ItemGroup />
        {children}
      </main>
    </>
  );
}
