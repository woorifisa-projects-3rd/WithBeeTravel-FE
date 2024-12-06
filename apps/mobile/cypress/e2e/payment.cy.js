// cypress/e2e/payment.cy.js
describe('Payment Component', () => {
  beforeEach(() => {
    // 로그인 페이지로 이동
    cy.visit('/login');

    // 로그인 수행
    cy.get('#email').type('1@naver.com');
    cy.get('#password').type('password123!');
    cy.get('button[type="submit"]').click();

    // 메인 페이지로 리디렉션 될 때까지 대기
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 결제 페이지로 이동
    cy.visit('/travel/1/payments');
  });

  it('결제 정보가 올바르게 표시되는지 확인', () => {
    // 페이지가 로드될 때까지 대기
    cy.contains('Taco World').should('be.visible');

    cy.contains('60,000원');
    cy.contains('09:00');
  });

  it('정산 인원 선택 모달이 작동하는지 확인', () => {
    // 페이지가 로드될 때까지 대기
    cy.contains('5명').should('be.visible').click();

    cy.contains('정산을 함께 할').should('be.visible');
    cy.contains('이도이').click();
    cy.contains('확인').click();
    cy.contains('5명').should('be.visible');
  });

  it('기록 추가 버튼이 작동하는지 확인', () => {
    // 페이지가 로드될 때까지 대기
    cy.contains('기록 추가').should('be.visible').click();
    cy.get('[data-cy="record-modal"]').should('be.visible');
  });
});
