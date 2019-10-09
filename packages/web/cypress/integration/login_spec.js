describe('Login / Logout', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('successfully login', () => {
    cy.get('.h4').should('contain', 'Welcome Back!');
    cy.get('#email').type('ian@pogi.com');
    cy.get('#password').type('test');
    cy.get('.btn-user').click();
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
  });

  it('unsuccessful login', () => {
    cy.get('.h4').should('contain', 'Welcome Back!');
    cy.get('#email').type('fake@pogi.com');
    cy.get('#password').type('test');
    cy.get('.btn-user').click();
    cy.get('.h4').should('contain', 'Welcome Back!');
    cy.get('.text-danger').should('contain', 'Username and/or password is incorrect');
  });
});
