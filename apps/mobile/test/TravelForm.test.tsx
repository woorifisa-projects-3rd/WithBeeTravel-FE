import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TravelForm from '../components/TravelForm';
import { TravelFormProps } from '@withbee/types';
import '@testing-library/jest-dom';

const mockOnSubmit = jest.fn();

const defaultProps: TravelFormProps = {
  mode: 'create',
  travelData: {
    travelId: 1,
    travelName: '',
    isDomesticTravel: true,
    travelCountries: [],
    travelStartDate: '2024-01-01',
    travelEndDate: '2024-01-05',
  },
  onSubmit: mockOnSubmit,
};

describe('TravelForm', () => {
  it('renders travel form correctly', () => {
    render(<TravelForm {...defaultProps} />);

    // 여행명 필드가 렌더링되었는지 확인
    const travelNameInput = screen.getByPlaceholderText('여행명');
    expect(travelNameInput).toBeInTheDocument();

    // 국내/해외 버튼이 렌더링되었는지 확인
    const domesticButton = screen.getByText('국내');
    const overseasButton = screen.getByText('해외');
    expect(domesticButton).toBeInTheDocument();
    expect(overseasButton).toBeInTheDocument();
  });

  it('updates travel name on input change', () => {
    render(<TravelForm {...defaultProps} />);
    const travelNameInput = screen.getByPlaceholderText('여행명');

    fireEvent.change(travelNameInput, { target: { value: '제주도 여행' } });
    expect(travelNameInput).toHaveValue('제주도 여행');
  });

  it('handles form submission correctly', () => {
    render(<TravelForm {...defaultProps} />);
    const submitButton = screen.getByText('여행 생성 완료');

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(defaultProps.travelData);
  });
});
