import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Title } from '@withbee/ui/title';

// 모바일 컨테이너 데코레이터 스타일
const mobileContainerStyle = {
  width: '430px',
  padding: '16px',
  borderBottom: '1px solid var(--color-gray-200)',
  borderRadius: '8px',
  backgroundColor: 'white',
};

// Meta 설정 부분
const meta: Meta<typeof Title> = {
  title: 'Components/Title',
  component: Title,
  parameters: {
    layout: 'centered',
  },
  tags: ['title'],
  argTypes: {},
  args: {},
  // 데코레이터 추가
  decorators: [
    (Story) => (
      <div style={mobileContainerStyle}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Title>;

export const Primary: Story = {
  args: {
    label: '여행 홈',
  },
};
