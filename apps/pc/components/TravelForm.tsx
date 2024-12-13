'use client';
import React, { useState } from 'react';
import styles from './TravelForm.module.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import DatePickerModal from '@withbee/ui/date-picker-modal';
import { formatDate, getDateObject, countriesList } from '@withbee/utils';
import { useToast } from '@withbee/hooks/useToast';
import { validators } from '@withbee/utils';
import { TravelFormProps } from '@withbee/types';

export default function TravelForm({
  mode,
  travelData,
  onSubmit,
}: TravelFormProps) {
  const router = useRouter();

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    travelId: travelData?.travelId ?? 1,
    travelName: travelData?.travelName || '',
    isDomesticTravel: travelData?.isDomesticTravel ?? true,
    travelCountries: travelData?.travelCountries || [],
    travelStartDate:
      travelData?.travelStartDate ||
      formatDate(getDateObject(new Date().toISOString())),
    travelEndDate:
      travelData?.travelEndDate ||
      formatDate(getDateObject(new Date().toISOString())),
  });

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  //DatePickerModal 관련 상태
  const [isStartDateModalOpen, setIsStartDateModalOpen] = useState(false);
  const [isEndDateModalOpen, setIsEndDateModalOpen] = useState(false);

  // 날짜 선택 핸들러
  const handleDateSelect =
    (type: 'start' | 'end') =>
    (date: { year: number; month: number; day: number }) => {
      const formattedDate = formatDate(date);
      setFormData((prev) => ({
        ...prev,
        [type === 'start' ? 'travelStartDate' : 'travelEndDate']: formattedDate,
      }));
    };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (isDomesticTravel: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDomesticTravel,
      travelCountries: [], // 위치 변경 시 선택된 국가 초기화
    }));
    setSearchQuery(''); // 검색어 초기화
  };

  // 검색어 변경 처리
  // 검색어 변경 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      // 객체를 배열로 변환하고, 값이 검색어를 포함하는지 확인
      const filtered = Object.entries(countriesList)
        .filter(([code, name]) =>
          name.toLowerCase().includes(query.toLowerCase()),
        )
        .map(([code, name]) => name); // 코드가 필요 없다면 값만 추출

      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // 국가 선택 처리
  const handleCountrySelect = (country: string) => {
    if (!formData.travelCountries.includes(country)) {
      setFormData((prev) => ({
        ...prev,
        travelCountries: [...prev.travelCountries, country],
      }));
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  // 국가 삭제 하기
  const removeCountry = (countryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      travelCountries: prev.travelCountries.filter(
        (country) => country !== countryToRemove,
      ),
    }));
  };

  const { formValidation } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 여행명 검증
    if (!validators.travelName(formData.travelName)) {
      formValidation.invalidName();
      return;
    }

    // 해외 여행 시 국가 선택 검증
    if (!formData.isDomesticTravel && formData.travelCountries.length === 0) {
      formValidation.invalidCountrySelection();
      return;
    }

    // 날짜 검증
    const dateValidation = validators.travelDates(
      formData.travelStartDate,
      formData.travelEndDate,
    );

    if (!dateValidation.isValid) {
      if (dateValidation.error === 'EXCEED_DURATION') {
        formValidation.invalidDateDuration();
      } else if (dateValidation.error === 'INVALID_ORDER') {
        formValidation.invalidDateOrder();
      }
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>여행명</label>
          <input
            type="text"
            name="travelName"
            value={formData.travelName}
            onChange={handleInputChange}
            placeholder="여행명"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>여행지</label>
          <div className={styles.locationButtons}>
            <Button
              primary={formData.isDomesticTravel}
              size="large"
              label="국내"
              onClick={() => handleLocationChange(true)}
              className={styles.domesticBtn}
            />

            <Button
              primary={!formData.isDomesticTravel}
              size="large"
              label="해외"
              onClick={() => handleLocationChange(false)}
              className={styles.overseasBtn}
            />
          </div>

          {!formData.isDomesticTravel && (
            <div className={styles.searchSection}>
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  placeholder="국가 검색"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`${styles.input} ${styles.searchInput}`}
                />
                <span className={styles.searchIcon}>
                  <Image
                    src="/imgs/travelform/Search.png"
                    alt="검색창 아이콘"
                    className={styles.serach}
                    width={24}
                    height={24}
                  />
                </span>
              </div>

              {/* 선택된 국가 태그 */}
              <div className={styles.selectedCountries}>
                {formData.travelCountries.map((country) => (
                  <div key={country} className={styles.countryTag}>
                    <Item
                      label={country}
                      type="delete"
                      onDelete={() => removeCountry(country)}
                      size="medium"
                    />
                  </div>
                ))}
              </div>

              {/* 검색 결과 */}
              {searchQuery && searchResults.length > 0 && (
                <div className={styles.searchResults}>
                  {searchResults.map((country) => (
                    <div
                      key={country}
                      className={styles.searchResultItem}
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label>기간</label>
          <div className={styles.dateGroup}>
            <div className={styles.dateInput}>
              <span>시작일</span>
              <div
                className={styles.customDateInput}
                onClick={() => setIsStartDateModalOpen(true)}
              >
                <p className={styles.date}>{formData.travelStartDate}</p>
                <span className={styles.customIcon}>
                  <Image
                    src="/imgs/travelform/cal.png"
                    alt="달력 아이콘"
                    className={styles.cal}
                    width={21}
                    height={21}
                  />
                </span>
                <DatePickerModal
                  title="시작일"
                  isOpen={isStartDateModalOpen}
                  initialDate={getDateObject(formData.travelStartDate)}
                  onSelectDate={handleDateSelect('start')}
                  onClose={() => setIsStartDateModalOpen(false)}
                />
              </div>
            </div>
            <div className={styles.dateInput}>
              <span>종료일</span>
              <div
                className={styles.customDateInput}
                onClick={() => setIsEndDateModalOpen(true)}
              >
                <p className={styles.date}>{formData.travelEndDate}</p>
                <span className={styles.customIcon}>
                  <Image
                    src="/imgs/travelform/cal.png"
                    alt="달력 아이콘"
                    className={styles.cal}
                    width={21}
                    height={21}
                  />
                </span>
              </div>
              <DatePickerModal
                title="종료일"
                isOpen={isEndDateModalOpen}
                initialDate={getDateObject(formData.travelEndDate)}
                onSelectDate={handleDateSelect('end')}
                onClose={() => setIsEndDateModalOpen(false)}
              />
            </div>
          </div>
        </div>

        <div className={styles.btnWrap}>
          <Button
            type="submit"
            label={mode === 'create' ? '여행 생성 완료' : '여행 편집 완료'}
            primary={true}
            size="large"
            className={styles.btn}
          />
        </div>
      </form>
    </div>
  );
}
