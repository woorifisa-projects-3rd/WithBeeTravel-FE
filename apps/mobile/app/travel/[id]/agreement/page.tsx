'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { Title } from '@withbee/ui/title';
import { Button } from '@withbee/ui/button';
import { consentItems } from '@withbee/utils';
import { useToast } from '@withbee/hooks/useToast';
import { useRouter } from 'next/navigation';
import { agreeSettlement } from '@withbee/apis';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { ERROR_MESSAGES } from '@withbee/exception';

export default function ConsentPage({ params }: { params: Params }) {
  const travelId = Number(params.id);

  const { showToast } = useToast();
  const router = useRouter();

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // 현재 열려있는 약관 인덱스 관리
  const [agreements, setAgreements] = useState<boolean[]>(
    new Array(consentItems.length).fill(false),
  );

  const handelAgreeSettlement = async () => {
    const response = await agreeSettlement(travelId);

    if ('code' in response) {
      if (
        response.code === 'SETTLEMENT-010' ||
        response.code === 'BANKING-001'
      ) {
        showToast.warning({
          message: ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES],
        });
        router.push(
          `/travel/${travelId}/agreement/pending?error=${response.code}`,
        );
        return;
      } else if (response.code === 'SETTLEMENT-003') {
        showToast.warning({
          message: ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES],
        });
        return;
      } else {
        showToast.error({
          message: ERROR_MESSAGES['COMMON'],
        });
        return;
      }
    }
    router.push(`/travel/${travelId}/agreement/completed`);
  };

  // 각 약관항목에 ref를 연결해 스크롤 위치를 이동
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleExpand = (index: number) => {
    // 다른 약관을 펼칠 때, 페이지 맨 위로 스크롤
    if (expandedIndex !== index) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleAgreement = (index: number) => {
    const newAgreements = [...agreements];
    newAgreements[index] = !newAgreements[index];
    setAgreements(newAgreements);
  };

  // 모두 동의하기를 눌렀을 경우
  const toggleAllAgreements = () => {
    const newStatus = !agreements.every((agreement) => agreement);
    setAgreements(agreements.map(() => newStatus));
  };

  // 필수 약관만 모두 동의했을 때 버튼 활성화
  const requiredAgreed = consentItems
    .filter((item) => item.isRequired)
    .every((item, index) => agreements[index]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title label="약관 동의" />
      </div>
      <div className={`${styles.content} content full`}>
        <div className={styles.consentList}>
          <div className={styles.allCheckAgree} onClick={toggleAllAgreements}>
            <Image
              src={
                agreements.every((agreement) => agreement)
                  ? '/check.png'
                  : '/uncheck.png'
              }
              alt={
                agreements.every((agreement) => agreement)
                  ? 'Checked'
                  : 'Unchecked'
              }
              width={22}
              height={22}
            />
            <span>전체 동의 체크</span>
          </div>
          {consentItems.map((item, index) => (
            <div
              key={index}
              className={styles.consentItem}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              <div className={styles.consentHeader}>
                <div
                  className={styles.checkboxContainer}
                  onClick={() => toggleAgreement(index)}
                >
                  <div
                    className={`${styles.checkboxContainer} ${agreements[index] ? styles.checked : ''}`}
                  >
                    <Image
                      src={agreements[index] ? '/check.png' : '/uncheck.png'}
                      width={22}
                      height={22}
                      alt={agreements[index] ? 'Checked' : 'Unchecked'}
                    />
                  </div>
                  <span>{item.title}</span>
                </div>
                <Image
                  src="/arrow.png"
                  alt="Expand"
                  width={10}
                  height={6}
                  className={`${styles.arrow} ${expandedIndex === index ? styles.expanded : ''}`}
                  onClick={() => toggleExpand(index)}
                />
              </div>

              {expandedIndex === index && (
                <div className={styles.termsContent}>
                  {item.terms.map((term, idx) => (
                    <div key={idx} className={styles.termSection}>
                      <h3>{term.title}</h3>
                      <p>{term.content}</p>
                      {term.subItems && (
                        <ul>
                          {term.subItems.map((subItem, subIdx) => (
                            <li key={subIdx}>{subItem}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.btnWrapper}>
          <Button
            label="동의하고 PIN 번호 입력하기"
            disabled={!requiredAgreed}
            onClick={handelAgreeSettlement}
          />
        </div>
      </div>
    </div>
  );
}
