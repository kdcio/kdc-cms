describe('Users', () => {
  before(() => {
    cy.task('deleteUser', 'happy');
  });

  after(() => {
    cy.task('deleteUser', 'happy');
  });

  beforeEach(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'));
  });

  it('should create user', () => {
    cy.visit('/');
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
    cy.get('#topBarTitle').should('contain', 'Dashboard');
    cy.get(':nth-child(12) > .nav-link > span').click();
    cy.location('pathname').should('eq', '/users');

    cy.get('#topBarTitle').should('contain', 'Users');
    cy.get('.d-flex > .btn').click();

    cy.location('pathname').should('eq', '/users/add');
    cy.get(':nth-child(1) > .col-sm-4 > .form-control').type('Happy Asilo');
    cy.get('div.col-sm-2 > .form-control').select('dev');
    cy.get(':nth-child(2) > :nth-child(2) > .form-control').type('happy');
    cy.get(':nth-child(2) > :nth-child(4) > .form-control').type('happy@ganda.com');
    cy.get(':nth-child(3) > :nth-child(2) > .form-control').type('ganda');
    cy.get(':nth-child(3) > :nth-child(4) > .form-control').type('ganda');
    cy.get('form > .btn').click();

    cy.location('pathname').should('eq', '/users');
    cy.get('tbody > :nth-child(1) > th').should('have.text', 'Happy Asilo');
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', 'happy');
    cy.get('tbody > :nth-child(1) > :nth-child(3)').should('have.text', 'dev');
    cy.get(':nth-child(1) > .text-center > .btn-secondary').click();

    cy.location('pathname').should('eq', '/users/edit/happy');
    cy.get(':nth-child(1) > .col-sm-4 > .form-control').should('have.value', 'Happy Asilo');
    cy.get(':nth-child(1) > .col-sm-4 > .form-control').type(' Dela Cruz');
    cy.get('div.col-sm-2 > .form-control').should('have.value', 'dev');
    cy.get('div.col-sm-2 > .form-control').select('admin');
    cy.get(':nth-child(2) > :nth-child(2) > .form-control').should('have.value', 'happy');
    cy.get(':nth-child(2) > :nth-child(4) > .form-control').should('have.value', 'happy@ganda.com');
    cy.get('form > .btn').click();

    cy.location('pathname').should('eq', '/users');
    cy.get('tbody > :nth-child(1) > th').should('have.text', 'Happy Asilo Dela Cruz');
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', 'happy');
    cy.get('tbody > :nth-child(1) > :nth-child(3)').should('have.text', 'admin');
    cy.get(':nth-child(1) > .text-center > .btn-secondary').click();

    cy.location('pathname').should('eq', '/users/edit/happy');
    cy.get(':nth-child(1) > .col-sm-4 > .form-control').should(
      'have.value',
      'Happy Asilo Dela Cruz'
    );
    cy.get('div.col-sm-2 > .form-control').should('have.value', 'admin');
    cy.get(':nth-child(2) > :nth-child(2) > .form-control').should('have.value', 'happy');
    cy.get(':nth-child(2) > :nth-child(4) > .form-control').should('have.value', 'happy@ganda.com');
    cy.get('.d-flex > .btn').click();

    cy.location('pathname').should('eq', '/users');
    cy.get('.m-0').should('contain', 'List');

    cy.get('.nav-link > .mr-2').click();
    cy.get('.dropdown-item').click();
    cy.get('.h4').should('contain', 'Welcome Back!');
    cy.get('#username').type('happy');
    cy.get('#password').type('ganda');
    cy.get('.btn-user').click();
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');

    cy.get(':nth-child(9) > .nav-link').should('not.contain', 'Define Content');
    cy.get(':nth-child(10) > .nav-link').should('not.contain', 'Define Pages');
    cy.get(':nth-child(9) > .nav-link').should('contain', 'Users');
  });
});
