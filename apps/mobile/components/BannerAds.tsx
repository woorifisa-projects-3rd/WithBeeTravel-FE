import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BannerAds.module.css';

const BANNERS = [
  {
    id: 1,
    image: '/imgs/travelselect/howhere_banner.png',
    alt: '아고다 호텔 예약',
    link: 'https://www.agoda.com',
  },
  {
    id: 2,
    image: '/imgs/travelselect/yanolja_banner.png',
    alt: '야놀자 숙소 할인',
    link: 'https://www.yanolja.com',
  },
  {
    id: 3,
    image: '/imgs/travelselect/esim_banner.png',
    alt: '도시락 이심',
    link: 'https://dosirakesim.com',
  },
  {
    id: 4,
    image: '/imgs/travelselect/triple_com_banner.png',
    alt: '트릿닷컴',
    link: 'https://kr.trip.com',
  },
  {
    id: 5,
    image: '/imgs/travelselect/kakaoT_banner.png',
    alt: '카카오티항공',
    link: 'https://www.kakaomobility.com',
  },
];

export default function BannerAds() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const bannerVariants = {
    initial: {
      opacity: 0,
      x: 100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: -150,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.bannerCounter}>
        {currentBanner + 1} / {BANNERS.length}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={BANNERS[currentBanner]!.id}
          variants={bannerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={styles.bannerWrapper}
        >
          <Link
            href={BANNERS[currentBanner]!.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bannerLink}
          >
            <div className={styles.bannerImageContainer}>
              <Image
                src={BANNERS[currentBanner]!.image}
                alt={BANNERS[currentBanner]!.alt}
                fill
                className={styles.bannerImage}
                priority
              />
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
