describe('Pages', () => {
  before(() => {
    cy.task('clearDb', 'page');
    cy.task('clearDb', 'page#data');
  });

  after(() => {
    cy.task('clearDb', 'page');
    cy.task('clearDb', 'page#data');
  });

  beforeEach(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'));
  });

  it('should define page', () => {
    cy.visit('/');
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
    cy.get('#topBarTitle').should('contain', 'Dashboard');
    cy.get(':nth-child(9) > .nav-link > span').click();
    cy.location('pathname').should('eq', '/define/pages');
    cy.get('#topBarTitle').should('contain', 'Define Pages');
    cy.get('#addBtn').click();
    cy.location('pathname').should('eq', '/define/pages/add');
    cy.get(':nth-child(1) > :nth-child(2) > .form-control').type('Home Page');
    cy.get('.col-sm-6 > .form-control').type('Title');
    cy.get('.d-flex > .mr-2').click();
    cy.get(':nth-child(5) > .col-sm-6 > .form-control').type('Intro');
    cy.get('.d-flex > .mr-2').click();
    cy.get(':nth-child(6) > .col-sm-6 > .form-control').type('Spill');
    cy.get(':nth-child(6) > div.col-sm-2 > .form-control').select('Long Text');
    cy.get('.btn-primary').click();
    cy.location('pathname').should('eq', '/define/pages');
    cy.get('tbody > tr > th').should('contain', 'home-page');
    cy.get('tbody > tr > :nth-child(4)').should('contain', '3');
    cy.get('.btn-secondary').click();
    cy.location('pathname').should('eq', '/define/pages/edit/home-page');
    cy.get(':nth-child(1) > :nth-child(2) > .form-control').should('have.value', 'Home Page');
    cy.get(':nth-child(1) > :nth-child(2) > .form-control')
      .clear()
      .type('Home');
    cy.get(':nth-child(1) > :nth-child(4) > .form-control').type('some description');
    cy.get('.d-flex > .mr-2').click();
    cy.get(':nth-child(7) > .col-sm-6 > .form-control').type('Spill2');
    cy.get('.btn-primary').click();
    cy.location('pathname').should('eq', '/define/pages');
    cy.get('tbody > tr > th').should('contain', 'home-page');
    cy.get('tbody > tr > :nth-child(2)').should('contain', 'Home');
    cy.get('tbody > tr > :nth-child(3)').should('contain', 'some description');
    cy.get('tbody > tr > :nth-child(4)').should('contain', '4');
  });

  it('should enter content for page', () => {
    cy.visit('/');
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
    cy.get('#topBarTitle').should('contain', 'Dashboard');
    cy.get(':nth-child(6) > .nav-link > span').click();
    cy.location('pathname').should('eq', '/pages');
    cy.get('tbody > tr > th').should('have.text', 'home-page');
    cy.get('tbody > tr > :nth-child(2)').should('have.text', 'Home');
    cy.get('.text-center > .btn').click();
    cy.get(':nth-child(1) > .col-sm-10 > .form-control').type('KDC CMS');
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').type('Headless CMS for Serverless');
    cy.get(':nth-child(3) > .col-sm-10 > .form-control').type(
      'Incididunt commodo consequat fugiat incididunt eiusmod dolor eu veniam.'
    );
    cy.get(':nth-child(4) > .col-sm-10 > .form-control').type(
      'Quis ad ullamco cupidatat exercitation aliquip tempor sunt pariatur ex Lorem veniam.'
    );
    cy.get('form > .btn').click();
    cy.get('.text-center > .btn').click();
    cy.get(':nth-child(1) > .col-sm-10 > .form-control').should('have.value', 'KDC CMS');
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').should(
      'have.value',
      'Headless CMS for Serverless'
    );
    cy.get(':nth-child(3) > .col-sm-10 > .form-control').should(
      'have.value',
      'Incididunt commodo consequat fugiat incididunt eiusmod dolor eu veniam.'
    );
    cy.get(':nth-child(4) > .col-sm-10 > .form-control').should(
      'have.value',
      'Quis ad ullamco cupidatat exercitation aliquip tempor sunt pariatur ex Lorem veniam.'
    );
    cy.get(':nth-child(1) > .col-sm-10 > .form-control').type(' edited');
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').type(' edited');
    cy.get(':nth-child(3) > .col-sm-10 > .form-control').type(' edited');
    cy.get(':nth-child(4) > .col-sm-10 > .form-control').type(' edited');
    cy.get('form > .btn').click();
    cy.get('.text-center > .btn').click();
    cy.get(':nth-child(1) > .col-sm-10 > .form-control').should('have.value', 'KDC CMS edited');
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').should(
      'have.value',
      'Headless CMS for Serverless edited'
    );
    cy.get(':nth-child(3) > .col-sm-10 > .form-control').should(
      'have.value',
      'Incididunt commodo consequat fugiat incididunt eiusmod dolor eu veniam. edited'
    );
    cy.get(':nth-child(4) > .col-sm-10 > .form-control').should(
      'have.value',
      'Quis ad ullamco cupidatat exercitation aliquip tempor sunt pariatur ex Lorem veniam. edited'
    );
    cy.get('.d-flex > .btn').click();
    cy.get('.m-0').should('contain', 'List');
  });
});
