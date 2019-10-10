describe('Contents', () => {
  before(() => {
    cy.task('clearDb', 'content');
    cy.task('clearDb', 'content#blogs');
  });

  after(() => {
    cy.task('clearDb', 'content');
    cy.task('clearDb', 'content#blogs');
  });

  beforeEach(() => {
    cy.login('ian@pogi.com', 'test');
  });

  it('should define page', () => {
    cy.visit('/');
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
    cy.get('#topBarTitle').should('contain', 'Dashboard');
    cy.get(':nth-child(10) > .nav-link > span').click();
    cy.location('pathname').should('eq', '/define/types');
    cy.get('#topBarTitle').should('contain', 'Define Content Types');
    cy.get('.d-flex > .btn').click();

    cy.location('pathname').should('eq', '/define/types/add');
    cy.get('.m-0').should('have.text', 'Add Type');
    cy.get(':nth-child(1) > :nth-child(2) > .form-control').type('Blogs');
    cy.get(':nth-child(4) > .col-sm-6 > .form-control').should('have.value', 'Name');
    cy.get(':nth-child(4) > div.col-sm-2 > .form-control').should('have.value', 'Text');
    cy.get(':nth-child(5) > .col-sm-6 > .form-control').should('have.value', 'Slug');
    cy.get(':nth-child(5) > div.col-sm-2 > .form-control').should('have.value', 'Text');
    cy.get(':nth-child(6) > .col-sm-6 > .form-control').type('Date');
    cy.get('.d-flex > .mr-2').click();
    cy.get(':nth-child(7) > .col-sm-6 > .form-control').type('Body');
    cy.get(':nth-child(7) > div.col-sm-2 > .form-control').select('Long Text');
    cy.get(':nth-child(10) > .col-sm-4 > .form-control').select('Date');
    cy.get('.btn-primary').click();

    cy.location('pathname').should('eq', '/define/types');
    cy.get('tbody > tr > th').should('have.text', 'blogs');
    cy.get(':nth-child(7) > .nav-link > span').should('have.text', 'Blogs');
    cy.get('.btn-secondary').click();

    cy.location('pathname').should('eq', '/define/types/edit/blogs');
    cy.get(':nth-child(1) > :nth-child(2) > .form-control').should('have.value', 'Blogs');
    cy.get(':nth-child(1) > :nth-child(2) > .form-control').type(' edited');
    cy.get(':nth-child(4) > .col-sm-6 > .form-control').should('have.value', 'Name');
    cy.get(':nth-child(4) > div.col-sm-2 > .form-control').should('have.value', 'Text');
    cy.get(':nth-child(5) > .col-sm-6 > .form-control').should('have.value', 'Slug');
    cy.get(':nth-child(5) > div.col-sm-2 > .form-control').should('have.value', 'Text');
    cy.get(':nth-child(6) > .col-sm-6 > .form-control').should('have.value', 'Date');
    cy.get(':nth-child(6) > div.col-sm-2 > .form-control').should('have.value', 'text');
    cy.get(':nth-child(7) > .col-sm-6 > .form-control').should('have.value', 'Body');
    cy.get(':nth-child(7) > .col-sm-6 > .form-control').type(' edited');
    cy.get(':nth-child(7) > div.col-sm-2 > .form-control').should('have.value', 'long-text');
    cy.get('.d-flex > .mr-2').click();
    cy.get(':nth-child(8) > .col-sm-6 > .form-control').type('Author');
    cy.get(':nth-child(11) > .col-sm-4 > .form-control')
      .should('have.value', 'Date')
      .should('have.attr', 'readonly', 'readonly');
    cy.get('.btn-primary').click();

    cy.location('pathname').should('eq', '/define/types');
    cy.get('tbody > tr > th').should('have.text', 'blogs');
    cy.get('tbody > tr > :nth-child(2)').should('have.text', 'Blogs edited');
    cy.get('.btn-secondary').click();

    cy.location('pathname').should('eq', '/define/types/edit/blogs');
    cy.get(':nth-child(1) > :nth-child(2) > .form-control').should('have.value', 'Blogs edited');
    cy.get(':nth-child(1) > :nth-child(2) > .form-control')
      .clear()
      .type('Blogs');
    cy.get(':nth-child(4) > .col-sm-6 > .form-control').should('have.value', 'Name');
    cy.get(':nth-child(4) > div.col-sm-2 > .form-control').should('have.value', 'Text');
    cy.get(':nth-child(5) > .col-sm-6 > .form-control').should('have.value', 'Slug');
    cy.get(':nth-child(5) > div.col-sm-2 > .form-control').should('have.value', 'Text');
    cy.get(':nth-child(6) > .col-sm-6 > .form-control').should('have.value', 'Date');
    cy.get(':nth-child(6) > div.col-sm-2 > .form-control').should('have.value', 'text');
    cy.get(':nth-child(7) > .col-sm-6 > .form-control').should('have.value', 'Body edited');
    cy.get(':nth-child(7) > .col-sm-6 > .form-control')
      .clear()
      .type('Body');
    cy.get(':nth-child(7) > div.col-sm-2 > .form-control').should('have.value', 'long-text');
    cy.get(':nth-child(8) > .col-sm-6 > .form-control').should('have.value', 'Author');
    cy.get(':nth-child(11) > .col-sm-4 > .form-control')
      .should('have.value', 'Date')
      .should('have.attr', 'readonly', 'readonly');
    cy.get('.btn-primary').click();
  });
});
