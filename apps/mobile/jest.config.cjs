module.exports = {
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.scss$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Jest 환경설정 파일 지정
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json', // TypeScript 설정 파일 경로
    },
  },
};
