import styles from './page.module.css';
import '@withbee/styles';
import { Title } from '@withbee/ui/title';
import ModalWrapper from '../../../../components/ModalWrapper';
import Link from 'next/link';
import { Button } from '@withbee/ui/button';
import ExpenseDetails from '../../../../components/ExpenseDetails';
import Image from 'next/image';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { Key } from 'react';
import {
  SettlementDetails,
  SuccessResponse,
  getSettlementDetails,
} from '@withbee/apis';

export default async function Page({ params }: { params: Params }) {
  const travelId = Number(params.id);

  const response = (await getSettlementDetails(
    travelId,
  )) as SuccessResponse<SettlementDetails>;

  const { myTotalPayment, myDetailPayments, others } =
    response.data as SettlementDetails;

  return (
    <div className={styles.container}>
      <header>
        <Title label="지출 상세내역" />
      </header>
      <div className={styles.mainContent}>
        <div className={styles.summary}>
          <div className={styles.mainCard}>
            <div className={styles.summaryHeader}>
              <span>
                <span className={styles.name}>{myTotalPayment.name}</span>
                <span className={styles.name}>(나)</span>
              </span>
              <span
                className={
                  myTotalPayment.totalPaymentCost >= 0
                    ? styles.positiveAmount
                    : styles.negativeAmount
                }
              >
                {myTotalPayment.totalPaymentCost >= 0
                  ? `+${myTotalPayment.totalPaymentCost.toLocaleString()}원`
                  : `${myTotalPayment.totalPaymentCost.toLocaleString()}원`}
                <span className={styles.suffixText}>
                  을{' '}
                  {myTotalPayment.totalPaymentCost >= 0 ? '받아요' : '보내요'}
                </span>
              </span>
            </div>
            <div className={styles.summaryBody}>
              <div className={styles.summaryInfo}>
                <span className={styles.label}>총 내 결제 금액 </span>
                <span>{myTotalPayment.ownPaymentCost.toLocaleString()}</span>
              </div>
              <div className={styles.summaryInfo}>
                <span className={styles.label}>정산 요청 금액 </span>
                <span>{myTotalPayment.actualBurdenCost.toLocaleString()}</span>
              </div>
            </div>

            <ExpenseDetails myDetailPayments={myDetailPayments} />
          </div>
        </div>

        <div className={styles.userList}>
          <ul>
            {others
              .sort((a: { agreed: boolean }, b: { agreed: boolean }) => {
                return a.agreed === b.agreed ? 0 : a.agreed ? 1 : -1;
              })
              .map(
                (user: {
                  id: Key;
                  agreed: boolean;
                  name: string;
                  totalPaymentCost: number;
                }) => (
                  <li
                    key={user.id}
                    className={`${styles.card} ${
                      user.agreed ? styles.completedCard : styles.userCard
                    }`}
                  >
                    <div className={styles.userRow}>
                      <span>
                        <span className={styles.name}>{user.name}</span>
                        <span className={styles.suffix}>님이</span>
                      </span>
                      <span>
                        <span
                          className={
                            user.totalPaymentCost >= 0
                              ? styles.positiveAmount
                              : styles.negativeAmount
                          }
                        >
                          {user.totalPaymentCost >= 0
                            ? `+${user.totalPaymentCost.toLocaleString()}원`
                            : `${user.totalPaymentCost.toLocaleString()}원`}
                        </span>
                        <span className="suffixText">{`을 ${user.totalPaymentCost >= 0 ? '받아요' : '보내요'}`}</span>
                      </span>
                    </div>
                    {user.agreed && (
                      <div className={styles.completedOverlay}>
                        <Image
                          src="/imgs/settlement/stamp.png"
                          alt="stamp"
                          width={50}
                          height={50}
                        />
                      </div>
                    )}
                  </li>
                ),
              )}
          </ul>
        </div>
        <div className={styles.comment}>
          <span>
            위 금액은 정산 후 개인이 최종적으로
            <br />
            송금하거나 수령할 금액입니다.{' '}
          </span>
        </div>
        <div className={styles.remainingUsers}>
          <span>정산 완료까지 남은 인원 : </span>
          <strong>
            {others.filter((person) => !person.agreed).length + 1}
          </strong>
          <span>명</span>
        </div>
        <div className={styles.btnWrapper}>
          <Link
            href={{
              pathname: `/travel/${params.id}/agreement`,
            }}
          >
            <Button label="동의하기" />
          </Link>
          <ModalWrapper />
        </div>
      </div>
    </div>
  );
}
