import { render, RenderOptions } from '@testing-library/react';
import React from 'react';

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof render> {
  return render(ui, {
    // React 18의 새로운 동시성 기능을 비활성화
    wrapper: ({ children }) => <React.StrictMode>{children}</React.StrictMode>,
    ...options,
  });
}

// testing-library의 나머지 export들을 다시 export
export * from '@testing-library/react';

// render를 override
export { customRender as render };
