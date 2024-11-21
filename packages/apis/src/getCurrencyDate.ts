const BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@';

export const getCurrencyData = async (
  date: string,
  apiVersion: string,
  unit: string,
): Promise<number | null> => {
  try {
    let response = await fetch(
      `${BASE_URL}${date}/${apiVersion}/currencies/${unit.toLowerCase()}.json`,
    );

    // 404 에러 발생 시, date를 'latest'로 변경하여 재시도
    if (response.status === 404) {
      console.log(
        `Fetch Error: ${date}에 대한 환율 정보 불러오기 실패. 최근 환율 정보를 반환합니다.`,
      );
      response = await fetch(
        `${BASE_URL}latest/${apiVersion}/currencies/${unit.toLowerCase()}.json`,
      );
    }

    if (!response.ok) {
      throw new Error('Fetch Error: 환율 정보 불러오기 실패');
    }

    const data = await response.json();
    return data?.[unit.toLowerCase()]?.krw ?? null; // unit에 해당하는 krw 값을 반환
  } catch (error) {
    console.error(error);
    return null; // 에러 발생 시 null 반환
  }
};
