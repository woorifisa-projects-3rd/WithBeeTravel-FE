import styles from './page.module.css';
import '@withbee/styles';
import { Title } from '@withbee/ui/title';
import Link from 'next/link';
import { Button } from '@withbee/ui/button';
import ExpenseDetails from '../../../../components/ExpenseDetails';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { SettlementDetails, getSettlementDetails } from '@withbee/apis';
import { SuccessResponse } from '@withbee/types';
import { redirect } from 'next/navigation';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import OtherExpenseDetails from '../../../../components/OtherExpenseDetails';
import ModalWrapper from '../../../../components/ModalWrapper';

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: { [key: string]: string };
}) {
  const travelId = Number(params.id);
  const { showToast } = useToast();

  const response = (await getSettlementDetails(
    travelId,
  )) as SuccessResponse<SettlementDetails>;

  if ('code' in response) {
    if (response.code === 'SETTLEMENT-002' || 'TRAVEL-001') {
      redirect(`/travel/${travelId}/settlement/pending?error=${response.code}`);
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

  const isModalOpen = searchParams['cancel'] === 'true'; // URL 파라미터로 모달 열기 여부를 결정

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
                  ? `+${myTotalPayment.totalPaymentCost?.toLocaleString()}원`
                  : `${myTotalPayment.totalPaymentCost?.toLocaleString()}원`}
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
        <OtherExpenseDetails others={others} disagreeCount={disagreeCount} />
        <div className={styles.btnWrapper}>
          {myTotalPayment.agreed ? (
            <Button
              label="동의 완료"
              className={styles.disabledButton}
              disabled={true}
              primary={false} // 동의 완료 상태일 경우 비활성화
            />
          ) : (
            <Link href={{ pathname: `/travel/${params.id}/agreement` }}>
              <Button label="동의하기" />
            </Link>
          )}

          {!myTotalPayment.agreed && (
            <Link
              href={{
                pathname: `/travel/${params.id}/settlement`,
                query: { cancel: 'true' }, // 모달을 여는 URL 파라미터
              }}
            >
              <Button label="정산 취소하기" primary={false} />
            </Link>
          )}
        </div>
        {isModalOpen && <ModalWrapper travelId={travelId} />}
      </div>
    </div>
  );
}
