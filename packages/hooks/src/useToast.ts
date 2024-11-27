//토스트 메시지 표시 로직만
import { toast, ToastOptions } from 'react-toastify';
import { deflate } from 'zlib';
// import styles from '../../ui/src/toast-container.module.css';

interface ToastProps {
  message: string;
  options?: ToastOptions;
}

export const useToast = () => {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    // className: styles.customToast,
    // bodyClassName: styles.toastBody,
    // progressClassName: styles.toastProgress,
  };

  const showToast = {
    success: ({ message, options }: ToastProps) =>
      toast.success(message, { ...defaultOptions, ...options }),

    error: ({ message, options }: ToastProps) => {
      toast.dismiss();
      toast.clearWaitingQueue();
      toast.error(message, { ...defaultOptions, ...options });
    },

    info: ({ message, options }: ToastProps) =>
      toast.info(message, { ...defaultOptions, ...options }),

    warning: ({ message, options }: ToastProps) =>
      toast.warning(message, { ...defaultOptions, ...options }),
  };

  // 폼 유효성 검사 관련 토스트 메시지
  const formValidation = {
    invalidName: () =>
      toast.error('여행명은 3~20자 사이로 입력해주세요.', defaultOptions),

    invalidDateDuration: () =>
      toast.error('여행 기간은 1달(30일) 이내로 설정해주세요.', defaultOptions),

    invalidDateOrder: () =>
      toast.error('종료일이 시작일보다 빠를 수 없습니다.', defaultOptions),

    invalidCountrySelection: () =>
      toast.error('해외 여행 시 최소 1개 국가를 추가해주세요.', defaultOptions),

    formSuccess: (isEdit: boolean) =>
      toast.success(
        isEdit ? '여행이 수정되었습니다!' : '여행이 생성되었습니다!',
        defaultOptions,
      ),

    invalidPaymentDate: () =>
      toast.error('결제일자를 입력해주세요.', defaultOptions),

    invalidPaymentTime: () =>
      toast.error('결제 시간을 입력해주세요.', defaultOptions),

    invalidPaymentStoreName: () =>
      toast.error('상호명을 입력해주세요.', defaultOptions),

    invalidPaymentAmount: () =>
      toast.error('결제 금액을 입력해주세요.', defaultOptions),
  };

  return {
    showToast,
    formValidation,
  };
};
