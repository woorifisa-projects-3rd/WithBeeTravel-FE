import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './toast-container.module.css';

export const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      className={styles.customToast}
      bodyClassName={styles.toastBody}
      progressClassName={styles.toastProgress}
      limit={1} // 최대 1개만 표시
    />
  );
};
