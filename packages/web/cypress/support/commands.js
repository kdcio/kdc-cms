const TOKEN_KEY = '__kdc_cms_token__';
const USER_KEY = '__kdc_cms_user__';

Cypress.Commands.add('login', (email, password) => cy
  .request('POST', 'http://localhost:8101/users/authenticate', {
    email,
    password,
  })
  .its('body')
  .then((res) => {
    const { token, ...user } = res;
    return cy.window().then((win) => {
      win.localStorage.setItem(TOKEN_KEY, token);
      win.localStorage.setItem(USER_KEY, JSON.stringify(user));
    });
  }));
