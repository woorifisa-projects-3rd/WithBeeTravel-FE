import { Title } from "@withbee/ui/title";
import styles from "./page.module.css";
import { Button } from "@withbee/ui/button";

export default function Page() {
  const myTotalPayments = {
    name: "공예진",
    totalPaymentCost: 20000,
    ownPaymentCost: 150000,
    actualBurdenCost: 130000,
  };

  const expenses = [
    {
      id: 1,
      date: "2023/12/25 18:24:59",
      place: "최선생마라마라",
      totalAmount: 80000,
      requestAmount: 20000,
    },
    {
      id: 2,
      date: "2023/12/26 18:24:59",
      place: "모수",
      totalAmount: 360000,
      requestAmount: 90000,
    },
    {
      id: 3,
      date: "2023/12/27 18:24:59",
      place: "CASA DE VERDE",
      totalAmount: 80000,
      requestAmount: 20000,
    },
  ];

  const others = [
    {
      id: 1,
      name: "김호철",
      requestAmount: 3000,
      isAgreed: false,
    },
    {
      id: 2,
      name: "이도이",
      requestAmount: -25000,
      isAgreed: false,
    },
    {
      id: 3,
      name: "유승아",
      requestAmount: -28000,
      isAgreed: true,
    },
    {
      id: 4,
      name: "공소연",
      requestAmount: +25000,
      isAgreed: true,
    },
  ];

  return (
    <div className={styles.container}>
      <header>
        <Title label="지출 상세내역" />
      </header>
      <div className={styles.mainContent}>
        <div className={styles.summary}>
          <div className={styles.mainCard}>
            <div className={styles.summaryHeader}>
              <span className={styles.myName}>{myTotalPayments.name}</span>
              <span
                className={
                  myTotalPayments.totalPaymentCost >= 0
                    ? styles.positiveAmount
                    : styles.negativeAmount
                }
              >
                {myTotalPayments.totalPaymentCost >= 0
                  ? `+${myTotalPayments.totalPaymentCost.toLocaleString()}원`
                  : `${myTotalPayments.totalPaymentCost.toLocaleString()}원`}
                <span className={styles.suffixText}>
                  을 {myTotalPayments.totalPaymentCost >= 0 ? "받아요" : "내요"}
                </span>
              </span>
            </div>
            <div className={styles.summaryBody}>
              <div className={styles.summaryInfo}>
                <span className={styles.label}>총 내 결제 금액 </span>
                <span>{myTotalPayments.ownPaymentCost.toLocaleString()}</span>
              </div>
              <div className={styles.summaryInfo}>
                <span className={styles.label}>정산 요청 금액 </span>
                <span>{myTotalPayments.actualBurdenCost.toLocaleString()}</span>
              </div>
            </div>
            <details>
              <summary className={styles.detailsButton}>상세내역 보기</summary>
              <div className={styles.expenseList}>
                {expenses.map((expense) => (
                  <div key={expense.id} className={styles.expenseItem}>
                    <div>
                      <div className={styles.expenseDate}>{expense.date}</div>
                      <div className={styles.expensePlace}>{expense.place}</div>
                    </div>
                    <div>
                      <div className={styles.amountRow}>
                        <span>결제 금액</span>
                        <span className={styles.totalAmount}>
                          {expense.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className={styles.amountRow}>
                        <span>요청 금액</span>
                        <span className={styles.requestAmount}>
                          {expense.requestAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>

        <div className={styles.userList}>
          {others.map((user) => (
            <div
              key={user.id}
              className={`${styles.card} ${
                user.isAgreed ? styles.completedCard : styles.userCard
              }`}
            >
              <div className={styles.userRow}>
                <span>
                  <span>{user.name}</span>
                  <span className={styles.suffix}>님이</span>
                </span>
                <span>
                  <span
                    className={
                      user.requestAmount >= 0
                        ? styles.positiveAmount
                        : styles.negativeAmount
                    }
                  >
                    {user.requestAmount >= 0
                      ? `+${user.requestAmount.toLocaleString()}원`
                      : `${user.requestAmount.toLocaleString()}원`}
                  </span>
                  <span className="suffixText">{`을 ${user.requestAmount >= 0 ? "받아요" : "내요"}`}</span>
                </span>
              </div>
              {user.isAgreed && (
                <div className={styles.completedOverlay}>정산완료</div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.remainingUsers}>
          <span>정산 완료까지 남은 인원 : </span>
          <span>
            {others.filter((person) => !person.isAgreed).length + 1}명
          </span>
        </div>
        <div className={styles.btnWrapper}>
          <Button label="동의하기" />
          <Button label="정산 취소하기" primary={false} />
        </div>
      </div>
    </div>
  );
}
