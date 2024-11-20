import { Meta, StoryObj } from '@storybook/react';
import '@withbee/styles';
import DatePickerModal from '@withbee/ui/date-picker-modal';

const meta: Meta<typeof DatePickerModal> = {
  title: 'Components/DatePickerModal',
  component: DatePickerModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof DatePickerModal>;

export const DatePicker: Story = {
  args: {},
};
