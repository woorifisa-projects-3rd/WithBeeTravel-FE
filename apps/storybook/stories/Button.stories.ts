import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from './Button';

// Meta 설정 부분
const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
  args: { onClick: action('clicked') }, // onClick 이벤트 추적을 위해 action 사용
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: '선택 완료',
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
    label: '돌아가기',
  },
};

export const LargePrimary: Story = {
  args: {
    primary: true,
    size: 'large',
    label: '그룹 선택 완료',
  },
};

export const XLargePrimary: Story = {
  args: {
    primary: true,
    size: 'xlarge',
    label: '그룹 선택 완료',
  },
};

export const LargeSecondary: Story = {
  args: {
    size: 'large',
    label: '돌아가기',
  },
};

export const SmallPrimary: Story = {
  args: {
    primary: true,
    size: 'small',
    label: '불러오기',
  },
};

export const SmallSecondary: Story = {
  args: {
    size: 'small',
    label: '직접 추가',
  },
};
