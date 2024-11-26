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
import { SettlementDetails, getSettlementDetails } from '@withbee/apis';
import { SuccessResponse } from '@withbee/types';
import { redirect } from 'next/navigation';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';

export default async function Page({ params }: { params: Params }) {
  const travelId = Number(params.id);
  const { showToast } = useToast();

  const response = (await getSettlementDetails(
    travelId,
  )) as SuccessResponse<SettlementDetails>;

  if ('code' in response) {
    if (response.code === 'SETTLEMENT-002' || 'TRAVEL-001') {
      redirect(`/travel/${travelId}/agreement/pending?error=${response.code}`);
    } else {
      showToast.error({
        message: ERROR_MESSAGES['COMMON'],
      });
      return;
    }
  }

  const {
    myTotalPayment,
    disagreeCount,
    totalPaymentAmounts,
    totalRequestedAmounts,
    myDetailPayments,
    others,
  } = response.data as SettlementDetails;

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
                <span className={styles.suffixText}>총 </span>
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
                <span className={styles.label}>받을 금액 </span>
                <span
                  className={styles.amount}
                >{`${totalPaymentAmounts.toLocaleString()}원`}</span>
              </div>
              <div className={styles.summaryInfo}>
                <span className={styles.label}>보낼 금액 </span>
                <span
                  className={styles.amount}
                >{`${totalRequestedAmounts.toLocaleString()}원`}</span>
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
        <div
          className={
            myTotalPayment.agreed
              ? styles.remainingUsersCompleted
              : styles.remainingUsers
          }
        >
          <span>정산 완료까지 남은 인원 : </span>
          <strong>{disagreeCount}</strong>
          <span>명</span>
        </div>
        <div className={styles.btnWrapper}>
          {myTotalPayment.agreed ? (
            <Button
              label="정산 완료"
              className={styles.disabledButton}
              disabled={true}
              primary={false} // 정산 완료 상태일 경우 비활성화
            />
          ) : (
            <Link href={{ pathname: `/travel/${params.id}/agreement` }}>
              <Button label="동의하기" />
            </Link>
          )}
          {!myTotalPayment.agreed && <ModalWrapper travelId={params.id} />}
        </div>
      </div>
    </div>
  );
}
