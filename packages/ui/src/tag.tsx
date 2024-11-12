import styles from './tag.module.css';

export const Tag = ({ label }: { label: string }) => {
  return <span className={styles.tag}>{label}</span>;
};
