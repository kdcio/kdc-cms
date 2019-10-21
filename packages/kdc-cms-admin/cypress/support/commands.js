const TOKEN_KEY = '__kdc_cms_token__';
const USER_KEY = '__kdc_cms_user__';

Cypress.Commands.add('login', (username, password) =>
  cy
    .request('POST', 'http://localhost:8101/login', {
      username,
      password,
    })
    .its('body')
    .then((res) => {
      const { token, ...user } = res;
      return cy.window().then((win) => {
        win.localStorage.setItem(TOKEN_KEY, token);
        win.localStorage.setItem(USER_KEY, JSON.stringify(user));
      });
    })
);

Cypress.Commands.add('type_ckeditor', (content) => {
  cy.window().then((win) => {
    win.CKEDITOR.setData(content);
  });
});

Cypress.Commands.add('getData_ckeditor', () => cy.window().then((win) => win.CKEDITOR.getData()));
