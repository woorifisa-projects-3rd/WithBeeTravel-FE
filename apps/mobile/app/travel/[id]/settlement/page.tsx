"use client";

import { Title } from "@withbee/ui/title";
import styles from "./page.module.css";
import { Button } from "@withbee/ui/button";
import { useState } from "react";
import { Modal } from "@withbee/ui/modal";
import "@withbee/styles";
import Image from "next/image";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDetails = () => {
    setIsOpen((prev) => !prev);
  };

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
              <span>
                <span className={styles.name}>{myTotalPayments.name}</span>
                <span className={styles.name}>(나)</span>
              </span>
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
                  을 {myTotalPayments.totalPaymentCost >= 0 ? "받아요" : "보내요"}
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

            {isOpen && (
              <div className={styles.expenseList}>
                <ul>
                  {expenses.map((expense) => (
                    <li key={expense.id} className={styles.expenseItem}>
                      <div>
                        <div className={styles.expenseDate}>{expense.date}</div>
                        <div className={styles.expensePlace}>
                          {expense.place}
                        </div>
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
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button className={styles.detailsButton} onClick={toggleDetails}>
              <span>{isOpen ? "상세내역 접기" : "상세내역 보기"}</span>
              <Image
                src="/arrow.png"
                alt="arrow"
                width={10} height={7}
                className={`${styles.arrows} ${
                  isOpen ? styles.arrowOpen : styles.arrowClosed
                }`}
              />
            </button>

          </div>
        </div>

        <div className={styles.userList}>
          <ul>
            {others
              .sort((a, b) => {
                return a.isAgreed === b.isAgreed ? 0 : a.isAgreed ? 1 : -1;
              })
              .map((user) => (
                <li
                  key={user.id}
                  className={`${styles.card} ${
                    user.isAgreed ? styles.completedCard : styles.userCard
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
                          user.requestAmount >= 0
                            ? styles.positiveAmount
                            : styles.negativeAmount
                        }
                      >
                        {user.requestAmount >= 0
                          ? `+${user.requestAmount.toLocaleString()}원`
                          : `${user.requestAmount.toLocaleString()}원`}
                      </span>
                      <span className="suffixText">{`을 ${user.requestAmount >= 0 ? "받아요" : "보내요"}`}</span>
                    </span>
                  </div>
                  {user.isAgreed && (
                    <div className={styles.completedOverlay}>동의완료</div>
                  )}
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.comment}>
          <span>위 금액은 정산 후 개인이 최종적으로<br />송금하거나 수령할 금액입니다. </span>
        </div>
        <div className={styles.remainingUsers}>
          <span>정산 완료까지 남은 인원 : </span>
          <strong>
            {others.filter((person) => !person.isAgreed).length + 1}
          </strong>
          <span>
            명
          </span>
        </div>
        <div className={styles.btnWrapper}>
          <Button label="동의하기" />
          <Button
            label="정산 취소하기"
            primary={false}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="정산을 취소하시겠습니까?"
        closeLabel="정산 취소하기"
      >
        <p className={styles.subtitle}>
          정산 취소는 되돌릴 수 없으며,
          <br />
          모든 그룹원에게 알림이 전송됩니다.
        </p>
      </Modal>
    </div>
  );
}
