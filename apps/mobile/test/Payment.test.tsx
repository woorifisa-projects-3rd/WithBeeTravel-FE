import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TravelHome } from '@withbee/types';
import { Payment } from '@withbee/ui/payment';
import { mockUseToast } from '../__mocks__/hooks';
import { mockChooseParticipants } from '../__mocks__/apis';

jest.mock('@withbee/hooks/useToast', () => ({
  mockUseToast,
}));

jest.mock('@withbee/apis', () => ({
  mockChooseParticipants,
}));

describe('Payment Component', () => {
  const mockPaymentInfo = {
    id: 1,
    adderProfileIcon: 1,
    paymentDate: '2024-01-01T12:00:00',
    paymentAmount: 30000,
    storeName: '테스트 가게',
    foreignPaymentAmount: 25,
    unit: 'USD',
    exchangeRate: 1200,
    participatingMembers: [
      { id: 1, name: '홍길동', profileImage: 1 },
      { id: 2, name: '김철수', profileImage: 2 },
    ],
    isAllMemberParticipated: true,
    isManuallyAdded: false,
    category: '식비',
  };

  const mockTravelInfo: TravelHome = {
    travelId: 1,
    id: 1,
    travelName: '테스트 여행',
    travelStartDate: '2024-01-01',
    travelEndDate: '2024-01-10',
    travelMembers: [
      { id: 1, name: '홍길동', profileImage: 1 },
      { id: 2, name: '김철수', profileImage: 2 },
      { id: 3, name: '이영희', profileImage: 3 },
    ],
    isDomesticTravel: false,
    countries: ['Korea', 'Japan'],
    mainImage: '/mainImage.jpg',
    statistics: {
      식비: 10,
      교통: 0,
      숙박: 0,
      관광: 0,
      액티비티: 0,
      쇼핑: 0,
      항공: 0,
      기타: 0,
    },
    captain: true,
    isAgreed: true,
    settlementStatus: 'PENDING',
  };

  const mockShowToast = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    (mockUseToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });
  });

  it('renders payment information correctly', () => {
    render(
      <Payment
        travelId={1}
        paymentInfo={mockPaymentInfo}
        travelInfo={mockTravelInfo}
      />,
    );

    expect(screen.getByText('30,000원')).toBeInTheDocument();
    expect(screen.getByText('(25USD)')).toBeInTheDocument();
    expect(screen.getByText('테스트 가게')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  it('shows participating members count', () => {
    render(
      <Payment
        travelId={1}
        paymentInfo={mockPaymentInfo}
        travelInfo={mockTravelInfo}
      />,
    );

    expect(screen.getByText('2명')).toBeInTheDocument();
  });

  it('opens member selection modal on click', async () => {
    render(
      <Payment
        travelId={1}
        paymentInfo={mockPaymentInfo}
        travelInfo={mockTravelInfo}
      />,
    );

    fireEvent.click(screen.getByText('2명'));

    await waitFor(() => {
      expect(
        screen.getByText('정산을 함께 할 그룹원을 선택해주세요!'),
      ).toBeInTheDocument();
    });
  });

  it('handles member selection', async () => {
    (mockChooseParticipants as jest.Mock).mockResolvedValue({ status: '200' });

    render(
      <Payment
        travelId={1}
        paymentInfo={mockPaymentInfo}
        travelInfo={mockTravelInfo}
      />,
    );

    // 멤버 선택 모달 열기
    fireEvent.click(screen.getByText('2명'));

    // 새 멤버 선택
    const memberRow = screen.getByText('이영희').closest('div');
    fireEvent.click(memberRow!);

    // 확인 버튼 클릭
    const confirmButton = screen.getByText('확인');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockShowToast.success).toHaveBeenCalledWith({
        message: '정산 인원이 변경되었습니다.',
      });
    });
  });

  it('prevents deselecting all members', async () => {
    render(
      <Payment
        travelId={1}
        paymentInfo={mockPaymentInfo}
        travelInfo={mockTravelInfo}
      />,
    );

    // 멤버 선택 모달 열기
    fireEvent.click(screen.getByText('2명'));

    // 모든 멤버 선택 해제 시도
    const memberRows = screen.getAllByText(/홍길동|김철수/);
    memberRows.forEach((row) => {
      fireEvent.click(row.closest('div')!);
    });

    await waitFor(() => {
      expect(mockShowToast.warning).toHaveBeenCalledWith({
        message: '최소 1명은 선택되어야 합니다.',
      });
    });
  });
});
