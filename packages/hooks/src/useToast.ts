//토스트 메시지 표시 로직만
import { toast, ToastOptions } from 'react-toastify';
// import styles from '../../ui/src/toast-container.module.css';

interface ToastProps {
  message: string;
  options?: ToastOptions;
}

export const useToast = () => {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 3000,
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

    error: ({ message, options }: ToastProps) =>
      toast.error(message, { ...defaultOptions, ...options }),

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

    formSuccess: (isEdit: boolean) =>
      toast.success(
        isEdit ? '여행이 수정되었습니다!' : '여행이 생성되었습니다!',
        defaultOptions,
      ),
  };

  return {
    showToast,
    formValidation,
  };
};
