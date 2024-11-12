import styles from './tag.module.css';

interface TagProps {
  label: string;
  size?: "small" | "medium";
}

export const Tag = ({ label, size = "medium" }: TagProps) => {
  return <i className={[styles.tag, styles[size]].join(" ")}>{label}</i>;
};
