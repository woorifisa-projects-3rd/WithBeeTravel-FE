import { Button } from '@withbee/ui/button';
import '@withbee/styles';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      <Title label="카드 혜택" />
      <div className={styles.withbeeCardWrap}>
        <Image
          src="/imgs/cardBenefits/withbee_travel_checkcard.png"
          alt="위비트래블 카드"
          width={270}
          height={250}
          quality={100}
        />
      </div>
      <div>
        <div className={styles.benefitCard}>
          <div className={styles.icon}>
            <Image
              src="/imgs/cardBenefits/1.png"
              alt="해외 가맹점 이용수수료 면제"
              width={50}
              height={50}
              quality={100}
            />
          </div>
          <div className={styles.benefitContent}>
            <div className={styles.benefitTitle}>
              해외 가맹점 이용수수료 면제
            </div>
            <div className={styles.benefitDesc}>
              국제브랜드 수수료(Mastercard 1%) 및 해외서비스 수수료(거래 건당
              US$0.5)면제
            </div>
          </div>
        </div>

        <div className={styles.benefitCard}>
          <div className={styles.icon}>
            <Image
              src="/imgs/cardBenefits/2.png"
              alt="해외, 간편결제 5% 캐시백"
              width={50}
              height={50}
              quality={100}
            />
          </div>
          <div className={styles.benefitContent}>
            <div className={styles.benefitTitle}>해외, 간편결제 5% 캐시백</div>
            <div className={styles.benefitDesc}>
              해외 이용금액은 우리카드 전산상 해외 가맹점 매출로 분류된 경우에
              한함
            </div>
          </div>
        </div>

        <div className={styles.benefitCard}>
          <div className={styles.icon}>
            <Image
              className={styles.iconImg}
              src="/imgs/cardBenefits/3.png"
              alt="쿠팡, 배민, 스타벅스 5% 캐시백"
              width={50}
              height={50}
              quality={100}
            />
          </div>
          <div className={styles.benefitContent}>
            <div className={styles.benefitTitle}>
              쿠팡, 배민, 스타벅스 5% 캐시백
            </div>
            <div className={styles.benefitDesc}>
              공식 앱 및 홈페이지를 통한 온라인 결제 건에 한함
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btnWrap}>
        <Button label="발급받기" />
      </div>
    </div>
  );
}
