'use client';

import { Component, ReactNode } from 'react';
import { PaymentSkeleton } from './payment-skeleton';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class PaymentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          {[1, 2, 3].map((index) => (
            <PaymentSkeleton key={index} />
          ))}
        </>
      );
    }

    return this.props.children;
  }
}
