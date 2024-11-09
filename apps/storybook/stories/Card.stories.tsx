import { Meta, StoryObj } from "@storybook/react";
import { Card } from "@withbee/ui/card";
import "@withbee/styles";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Card>;

export const CardWithImage: Story = {
  args: {
    imageSrc: "https://via.placeholder.com/300x180",
    time: "10:00 AM",
    comment: "Amazing coffee with a cozy ambiance!",
    price: "$5.99",
    storeName: "Cafe Aroma",
  },
};

export const CardWithoutImage: Story = {
  args: {
    time: "12:30 PM",
    comment: "Limited-time sale on espresso drinks!",
    price: "$3.99",
    storeName: "Espresso House",
  },
};
