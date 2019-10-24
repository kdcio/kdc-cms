import { expect } from 'chai';

let username = null;
let password = null;
let token = null;
describe('Apps', () => {
  before(() => {
    cy.task('clearDb', 'user#app');
  });

  after(() => {
    cy.task('clearDb', 'user#app');
  });

  beforeEach(() => {});

  it('should create user', () => {
    cy.login(Cypress.env('username'), Cypress.env('password'));
    cy.visit('/');
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
    cy.get('#topBarTitle').should('contain', 'Dashboard');
    cy.get(':nth-child(11) > .nav-link > span').click();
    cy.location('pathname').should('eq', '/apps');

    cy.get('#topBarTitle').should('contain', 'App Access');
    cy.get('.d-flex > .btn').click();

    cy.location('pathname').should('eq', '/apps/add');
    cy.get(':nth-child(1) > .col-sm-4 > .form-control').type('Gatsby');

    cy.get(':nth-child(2) > :nth-child(2) > .form-control')
      .invoke('val')
      .then((val) => {
        username = val;
      });

    cy.get(':nth-child(4) > .form-control')
      .invoke('val')
      .then((val) => {
        password = val;
      });

    cy.get('form > .btn').click();
  });

  it('should edit user', () => {
    cy.login(Cypress.env('username'), Cypress.env('password'));
    cy.location('pathname').should('eq', `/apps/edit/${username}`);
    cy.get('.m-0').should('have.text', 'Edit App');
    cy.get(':nth-child(2) > :nth-child(2) > .form-control').should('have.value', username);
    cy.get(':nth-child(4) > .form-control').should('have.value', password);
    cy.get('.col-sm-10 > .form-control')
      .invoke('val')
      .should('not.be.empty');
    cy.get('.col-sm-10 > .form-control')
      .invoke('val')
      .then((val) => {
        token = val;
      });
  });

  it('should use token in pages', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/pages`,
      auth: {
        bearer: token,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should be forbidden in users', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}/users`,
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });
});
