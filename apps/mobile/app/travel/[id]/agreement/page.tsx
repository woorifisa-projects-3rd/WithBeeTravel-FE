"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { Title } from "@withbee/ui/title";
import check from "../../../../public/check.png";
import uncheck from "../../../../public/uncheck.png";
import agreeOpen from "../../../../public/agreeOpen.png";
import { Button } from "@withbee/ui/button";

export default function ConsentPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // 현재 열려있는 약관 인덱스 관리

  const consentItems = [
    {
      title: "개인정보 수집 및 이용동의(필수)",
      isRequired: true,
      terms: [
        {
          title: "제1조 (목적)",
          content:
            '이 약관은 주식회사 "우리은행"(이하 "은행")의 "우리WON뱅킹 서비스"(이하 "서비스")의 이용과 관련하여 가입자와 은행 간의 권리와 의무, 서비스 이용 조건과 절차 등 제반 사항을 규정하는 것을 목적으로 합니다.',
        },
        {
          title: "제2조 (용어의 정의)",
          content: "이 약관에서 사용하는 용어의 의미는 다음과 같습니다.",
          subItems: [
            '"서비스"란 본 약관에 따라 은행이 가입자에게 제공하는 인증서와 이를 활용한 다양한 인증서비스를 종칭합니다.',
            '"전자서명인증"이란 전자서명생성정보가 확실하게 유일하게 속한다는 사실을 확인하고, 이를 증명하는 행위를 말합니다.',
            '"인증서"란 은행이 전자서명생성정보가 가입자에게 유일하게 속한다는 사실 등을 확인하고 이를 증명하는 전자적 정보를 말합니다.',
            '"전자서명"이란 서명자의 신원을 확인하고, 서명자가 해당 전자문서에 서명하였다는 사실을 나타내는 데 이용하기 위하여 해당 전자문서에 첨부되거나 논리적으로 결합된 전자적 형태의 정보를 말합니다.',
            '"전자서명생성정보"란 전자서명을 생성하기 위하여 이용하는 전자적 정보를 말합니다.',
            '"전자서명검증정보"란 전자서명을 검증하기 위하여 이용하는 전자적 정보를 말합니다.',
          ],
        },
      ],
    },
    {
      title: "자동 이체 서비스 이용 동의(필수)",
      isRequired: true,
      terms: [
        {
          title: "제1조 (자동이체 서비스)",
          content:
            "자동이체 서비스는 고객님의 요청에 따라 지정된 계좌에서 자동으로 결제가 이루어지는 서비스입니다.",
        },
        {
          title: "제2조 (자동이체 실행)",
          content:
            "자동이체는 지정된 날짜에 실행되며, 잔액이 부족할 경우 이체가 실행되지 않을 수 있습니다.",
          subItems: [
            "지정된 출금일이 공휴일인 경우 다음 영업일에 이체됩니다.",
            "계좌의 잔액이 이체 금액보다 부족한 경우 이체되지 않습니다.",
            "계좌에 지급 정지나 기타 제한이 있는 경우 이체가 제한될 수 있습니다.",
          ],
        },
      ],
    },
    {
      title: "마케팅 정보 수신 동의(선택)",
      isRequired: false,
      terms: [
        {
          title: "제1조 (정보 수신 동의)",
          content:
            "본 서비스의 이용 중, 고객님께 유용한 마케팅 정보를 이메일, 문자메시지, 푸시알림 등 다양한 방법으로 발송할 수 있습니다.",
        },
        {
          title: "제2조 (동의 여부)",
          content:
            "고객님은 언제든지 마케팅 정보 수신에 대한 동의를 철회할 수 있습니다.",
        },
      ],
    },
  ];

  const [agreements, setAgreements] = useState<boolean[]>(
    new Array(consentItems.length).fill(false)
  );

  const toggleExpand = (index: number) => {
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
        <div className={styles.checkboxContainer} onClick={toggleAllAgreements}>
          <Image
            src={agreements.every((agreement) => agreement) ? check : uncheck}
            alt={
              agreements.every((agreement) => agreement)
                ? "Checked"
                : "Unchecked"
            }
            width={22}
            height={22}
          />
          <span>전체 동의 체크</span>
        </div>
      </div>

      <div className={styles.consentList}>
        {consentItems.map((item, index) => (
          <div key={index} className={styles.consentItem}>
            <div className={styles.consentHeader}>
              <div
                className={styles.checkboxContainer}
                onClick={() => toggleAgreement(index)}
              >
                <div
                  className={`${styles.checkboxContainer} ${agreements[index] ? styles.checked : ""}`}
                >
                  <Image
                    src={agreements[index] ? check : uncheck}
                    width={22}
                    height={22}
                    alt={agreements[index] ? "Checked" : "Unchecked"}
                  />
                </div>
                <span>{item.title}</span>
              </div>
              <Image
                src={agreeOpen}
                alt="Expand"
                width={15}
                height={10}
                className={`${styles.arrow} ${expandedIndex === index ? styles.expanded : ""}`}
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
        <Button label="동의하고 PIN 번호 입력하기" disabled={!requiredAgreed} />
      </div>
    </div>
  );
}
