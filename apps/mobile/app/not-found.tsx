"use client"
import { Title } from "@withbee/ui/title"
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { Button } from '@withbee/ui/button';
import Image from "next/image";



export default function error () {


    return (
        <div >
          <div className={styles.subtitleContainer}>
            <motion.div
              animate={{ y: [0, -10, 0] }} // 위아래로 움직이기
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <Image
                className={styles.image}
                src="/imgs/friends/agreeWibee.png"
                alt="pending"
                width={240}
                height={320}
              />
            </motion.div>
            <p className={styles.errorTitle}>잘못된 페이지에요!</p>
            <p>404 Error</p>
          </div>
        </div>
      );

}