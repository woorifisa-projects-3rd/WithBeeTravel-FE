import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '@withbee/ui/modal';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button onClick={() => setIsOpen(true)}>모달 열기</button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="모달 제목">
          <p>여기에 모달 내용이 들어갑니다.</p>
        </Modal>
      </>
    );
  },
};
