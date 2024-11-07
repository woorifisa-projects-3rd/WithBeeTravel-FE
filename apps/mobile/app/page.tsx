import Image from "next/image";
import { Button } from "@withbee/ui/button";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>윗비트래블</h1>
      <div>모두들 화이팅 합시다!!</div>
    </div>
  );
}
