// MobileFooter.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileFooter.module.css';
import { useEffect, useState } from 'react';

export default function MobileFooter() {
  const pathname = usePathname();

  const [shouldHideFooter, setShouldHideFooter] = useState(false);

  // 여기 네비게이션 숨길 url 추가하면 됩니다
  const hideFooterPaths = [
    '/banking/[id]/transfer',
    '/banking/[id]/deposit',
    '/banking/[id]/payment',
    '/banking/[id]/transfer/detail',
    '/banking/create',
  ];

  useEffect(() => {
    const checkFooterVisibility = async () => {
      const isPathToHideFooter = hideFooterPaths.some((path) => {
        const regexPath = path.replace(/\[id\]/g, '[^/]+');
        const regex = new RegExp(`^${regexPath}$`);
        return regex.test(pathname);
      });

      setShouldHideFooter(isPathToHideFooter);
    };

    checkFooterVisibility();
  }, [pathname]);

  if (shouldHideFooter) {
    return null;
  }

  const menuItems = [
    {
      href: '/',
      label: '카드',
      icon: (
        <svg
          className={styles.svg}
          width="51"
          height="38"
          viewBox="0 0 51 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 19.8676C1 11.2095 1 6.88046 3.83129 4.19071C6.66261 1.50098 11.2195 1.50098 20.3333 1.50098H30C39.1137 1.50098 43.6708 1.50098 46.502 4.19071C49.3333 6.88046 49.3333 11.2095 49.3333 19.8676C49.3333 28.5257 49.3333 32.8549 46.502 35.5445C43.6708 38.2343 39.1137 38.2343 30 38.2343H20.3333C11.2195 38.2343 6.66261 38.2343 3.83129 35.5445C1 32.8549 1 28.5257 1 19.8676Z"
            stroke="#9ca3af"
            strokeWidth="3"
          />
          <path
            d="M20.3332 30.1982H10.6665"
            stroke="#9ca3af"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M15.4998 23.3105H10.6665"
            stroke="#9ca3af"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M1 15.2764H49.3333"
            stroke="#9ca3af"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M30 26.7548C30 24.5902 30 23.508 30.7078 22.8355C31.4157 22.1631 32.5549 22.1631 34.8333 22.1631C37.1118 22.1631 38.251 22.1631 38.9588 22.8355C39.6667 23.508 39.6667 24.5902 39.6667 26.7548C39.6667 28.9193 39.6667 30.0015 38.9588 30.674C38.251 31.3464 37.1118 31.3464 34.8333 31.3464C32.5549 31.3464 31.4157 31.3464 30.7078 30.674C30 30.0015 30 28.9193 30 26.7548Z"
            stroke="#9ca3af"
            strokeWidth="3"
          />
        </svg>
      ),
    },
    {
      href: '/travel',
      label: '여행',
      icon: (
        <svg
          className={styles.svg}
          width="30"
          height="33"
          viewBox="0 0 30 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.3851 31.288L14.0056 28.2425C14.5494 27.7763 15.4506 27.7763 15.9945 28.2425L19.6149 31.288C20.4539 31.7075 21.4795 31.288 21.7902 30.3868L22.4739 28.3202C22.6448 27.8229 22.4739 27.0926 22.101 26.7197L18.5738 23.177C18.3097 22.9284 18.1077 22.4312 18.1077 22.0738V17.6454C18.1077 16.9928 18.5894 16.682 19.1953 16.9306L26.8246 20.2247C28.0211 20.7375 29 20.1004 29 18.7952V16.7908C29 15.7497 28.2231 14.5533 27.2597 14.1493L18.5738 10.4045C18.3252 10.2958 18.1077 9.96947 18.1077 9.68978V5.0283C18.1077 3.5677 17.0355 1.84295 15.7303 1.17481C15.2642 0.941731 14.7203 0.941731 14.2542 1.17481C12.949 1.84295 11.8768 3.58324 11.8768 5.04384V9.70532C11.8768 9.98501 11.6593 10.3113 11.4106 10.4201L2.74029 14.1648C1.77691 14.5533 1 15.7497 1 16.7908V18.7952C1 20.1004 1.97891 20.7375 3.17536 20.2247L10.8047 16.9306C11.3951 16.6665 11.8923 16.9928 11.8923 17.6454V22.0738C11.8923 22.4312 11.6903 22.9284 11.4417 23.177L7.91454 26.7197C7.54162 27.0926 7.3707 27.8074 7.54162 28.3202L8.2253 30.3868C8.50499 31.288 9.53052 31.7231 10.3851 31.288Z"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      href: '/banking',
      label: '뱅킹',
      icon: (
        <svg
          className={styles.svg}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.3335 21.3333C1.3335 15.048 1.3335 11.9052 3.28611 9.95262C5.23875 8 8.38143 8 14.6668 8H21.3335C27.6188 8 30.7617 8 32.7142 9.95262C34.6668 11.9052 34.6668 15.048 34.6668 21.3333C34.6668 27.6187 34.6668 30.7615 32.7142 32.714C30.7617 34.6667 27.6188 34.6667 21.3335 34.6667H14.6668C8.38143 34.6667 5.23875 34.6667 3.28611 32.714C1.3335 30.7615 1.3335 27.6187 1.3335 21.3333Z"
            stroke="#9ca3af"
            strokeWidth="2"
          />
          <path
            d="M24.6668 7.99967C24.6668 4.85697 24.6668 3.28562 23.6905 2.30932C22.7142 1.33301 21.1428 1.33301 18.0002 1.33301C14.8575 1.33301 13.2861 1.33301 12.3098 2.30932C11.3335 3.28562 11.3335 4.85697 11.3335 7.99967"
            stroke="#9ca3af"
            strokeWidth="2"
          />
          <path
            d="M18.0003 26.8882C19.8413 26.8882 21.3337 25.6445 21.3337 24.1105C21.3337 22.5763 19.8413 21.3327 18.0003 21.3327C16.1593 21.3327 14.667 20.089 14.667 18.5548C14.667 17.0208 16.1593 15.7772 18.0003 15.7772M18.0003 26.8882C16.1593 26.8882 14.667 25.6445 14.667 24.1105M18.0003 26.8882V27.9993M18.0003 15.7772V14.666M18.0003 15.7772C19.8413 15.7772 21.3337 17.0208 21.3337 18.5548"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      href: '/mypage',
      label: 'MY',
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
        >
          <path
            d="M13.9999 15.1434C17.692 15.1434 20.6849 12.1505 20.6849 8.45844C20.6849 4.76641 17.692 1.77344 13.9999 1.77344C10.3079 1.77344 7.31494 4.76641 7.31494 8.45844C7.31494 12.1505 10.3079 15.1434 13.9999 15.1434Z"
            stroke="#9ca3af"
            strokeWidth="1.91"
            strokeMiterlimit="10"
          />
          <path
            d="M1.75 27.3937L2.18167 25.002C2.69161 22.2399 4.15302 19.7437 6.31203 17.947C8.47103 16.1503 11.1912 15.1667 14 15.167C16.8121 15.1677 19.535 16.1546 21.6944 17.9559C23.8539 19.7573 25.3132 22.2589 25.8183 25.0253L26.25 27.417"
            stroke="#9ca3af"
            strokeWidth="1.91"
            strokeMiterlimit="10"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.mobile}>
      <footer className={styles.footer}>
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === item.href
                  : pathname.includes(item.href!);

              return (
                <li key={item.href} className={styles.menuItem}>
                  <Link href={item.href || '/'} className={styles.menuLink}>
                    <span
                      className={`${styles.iconWrapper}  ${isActive ? styles.active : ''}`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`${styles.label} ${isActive ? styles.active : ''}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </footer>
    </div>
  );
}
