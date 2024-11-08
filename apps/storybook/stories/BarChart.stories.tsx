import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from '@withbee/ui/chart';
import React from 'react';

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['chart'],
};

export default meta;

type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  render: () => <BarChart />,
};
