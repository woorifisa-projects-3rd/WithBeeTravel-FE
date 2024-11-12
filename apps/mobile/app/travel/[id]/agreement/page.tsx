"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { Title } from "@withbee/ui/title";
import check from "../../../../public/check.png";
import uncheck from "../../../../public/uncheck.png";
import agreeOpen from "../../../../public/agreeOpen.png";
import { Button } from "@withbee/ui/button";
import { consentItems } from "../../../../../../packages/utils/consentItems";


export default function ConsentPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // 현재 열려있는 약관 인덱스 관리

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
