'use client';
import React from 'react';
import CountUp from 'react-countup';
import styles from './TotalBalanceCountUp.module.css';

export const AnimatedBalance = ({
  balance,
}: {
  balance: number | undefined;
}) => {
  // balance가 null이면 0 원을 표시
  if (balance == null) {
    return (
      <div className={styles.accountBalance}>
        <span className={styles.balanceLabel}></span>0 원
      </div>
    );
  }

  return (
    <div className={styles.accountBalance}>
      <span className={styles.balanceLabel}></span>
      <CountUp
        key={balance} // balance 값이 변경될 때마다 CountUp을 새로 렌더링
        start={0} // 애니메이션 시작 값
        end={balance} // 애니메이션 끝 값
        duration={0.3} // 애니메이션 지속 시간
        separator="," // 숫자에 천 단위 구분자 추가
        decimal="." // 소수점 구분자
        suffix="원" // 끝에 붙는 단위
        enableScrollSpy={true} // 스크롤 시 애니메이션 시작
        scrollSpyOnce={true} // 애니메이션이 한 번만 실행되도록 설정
      />
    </div>
  );
};
