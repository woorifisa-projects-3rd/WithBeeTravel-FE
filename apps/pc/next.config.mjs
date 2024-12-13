/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.wooricard.com', // 새로운 도메인 추가
        pathname: '/webcontent/cdPrdImgFileList/**', // 필요한 경로 추가
      },
      {
        protocol: 'https',
        hostname: 'withbee-travel.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**', // 모든 경로 허용
      },
      {
        protocol: 'https',
        hostname: 'd1c5n4ri2guedi.cloudfront.net',
        pathname: '/card/2700/card_img/**', // 특정 경로 허용
      },
    ],
  },
};

export default nextConfig;
