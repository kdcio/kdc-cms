describe('Login / Logout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('unsuccessful login', () => {
    cy.get('.h4').should('contain', 'Welcome Back!');
    cy.get('#email').type('fake@pogi.com');
    cy.get('#password').type('test');
    cy.get('.btn-user').click();
    cy.get('.h4').should('contain', 'Welcome Back!');
    cy.get('.text-danger').should('contain', 'Username and/or password is incorrect');
  });

  it('successfully login', () => {
    cy.get('.h4').should('contain', 'Welcome Back!');
    cy.get('#email').type(Cypress.env('email'));
    cy.get('#password').type(Cypress.env('password'));
    cy.get('.btn-user').click();
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
    cy.get('.nav-link > .mr-2').click();
    cy.get('.dropdown-item').should('contain', 'Logout');
    cy.get('.dropdown-item').click();
    cy.get('.h4').should('contain', 'Welcome Back!');
  });
});
