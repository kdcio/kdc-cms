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
    cy.login(Cypress.env('username'), Cypress.env('password'));
  });

  it('should define content', () => {
    cy.visit('/');
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
    cy.get('#topBarTitle').should('contain', 'Dashboard');
    cy.get(':nth-child(9) > .nav-link > span').click();
    cy.location('pathname').should('eq', '/define/types');
    cy.get('#topBarTitle').should('contain', 'Define Content Types');
    cy.get('.card-header > .btn').click();

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
    cy.location('pathname').should('eq', '/define/types');
    cy.get('tbody > tr > th').should('have.text', 'blogs');
  });

  it('should create content', () => {
    cy.visit('/');
    cy.get('.sidebar-brand-text').should('contain', 'KDC CMS');
    cy.get('#topBarTitle').should('contain', 'Dashboard');
    cy.get(':nth-child(7) > .nav-link > span').click();

    cy.location('pathname').should('eq', '/contents/blogs');
    cy.get('#topBarTitle').should('contain', 'Content');
    cy.get('.card-header > .btn').click();

    cy.location('pathname').should('eq', '/contents/blogs/add');
    cy.get('.m-0').should('contain', 'Add Blogs');
    cy.get(':nth-child(1) > .col-sm-10 > .form-control').type('My First Blog');
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').should('have.value', 'my-first-blog');
    cy.get(':nth-child(3) > .col-sm-10 > .form-control').type('Oct. 6, 2019');
    cy.type_ckeditor('Enim cillum aliqua velit officia nulla dolore duis.');
    cy.get(':nth-child(5) > .col-sm-10 > .form-control').type('Juan Dela Cruz');
    cy.get('form > .btn').click();

    cy.location('pathname').should('eq', '/contents/blogs');
    cy.get('tbody > tr > :nth-child(1)').should('have.text', 'My First Blog');
    cy.get('tbody > tr > :nth-child(2)').should('have.text', 'Oct. 6, 2019');
    cy.get('.card-header > .btn').click();

    cy.location('pathname').should('eq', '/contents/blogs/add');
    cy.get('.m-0').should('contain', 'Add Blogs');
    cy.get(':nth-child(1) > .col-sm-10 > .form-control').type('My Second Blog');
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').should('have.value', 'my-second-blog');
    cy.get(':nth-child(3) > .col-sm-10 > .form-control').type('Oct. 8, 2019');
    cy.type_ckeditor('Nulla ut qui cillum ex minim ullamco sint id id.');
    cy.get(':nth-child(5) > .col-sm-10 > .form-control').type('Juan Dela Cruz');
    cy.get('form > .btn').click();

    cy.location('pathname').should('eq', '/contents/blogs');
    cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text', 'My Second Blog');
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', 'Oct. 8, 2019');
    cy.get('tbody > :nth-child(2) > :nth-child(1)').should('have.text', 'My First Blog');
    cy.get('tbody > :nth-child(2) > :nth-child(2)').should('have.text', 'Oct. 6, 2019');
    cy.get(':nth-child(2) > .text-center > .btn-secondary').click();

    cy.location('pathname').should('eq', '/contents/blogs/edit/my-first-blog');
    cy.get('.m-0').should('contain', 'Edit Blogs');
    cy.get(':nth-child(1) > .col-sm-10 > .form-control').should('have.value', 'My First Blog');
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').should('have.value', 'my-first-blog');
    cy.get(':nth-child(3) > .col-sm-10 > .form-control').should('have.value', 'Oct. 6, 2019');
    cy.getData_ckeditor().then((d) => {
      expect(d).to.equal('<p>Enim cillum aliqua velit officia nulla dolore duis.</p>');
    });
    cy.get(':nth-child(5) > .col-sm-10 > .form-control').should('have.value', 'Juan Dela Cruz');

    cy.get(':nth-child(1) > .col-sm-10 > .form-control').type(' edited');
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').should(
      'have.value',
      'my-first-blog-edited'
    );
    cy.get(':nth-child(3) > .col-sm-10 > .form-control')
      .clear()
      .type('Oct. 1, 2019');
    cy.type_ckeditor('Ea labore irure magna eiusmod ullamco aliquip nisi.');
    cy.get(':nth-child(5) > .col-sm-10 > .form-control')
      .clear()
      .type('Happy Dela Cruz');
    cy.get('form > .btn').click();

    cy.location('pathname').should('eq', '/contents/blogs');
    cy.get('tbody > :nth-child(1) > :nth-child(1)').should('have.text', 'My Second Blog');
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', 'Oct. 8, 2019');
    cy.get('tbody > :nth-child(2) > :nth-child(1)').should('have.text', 'My First Blog edited');
    cy.get('tbody > :nth-child(2) > :nth-child(2)').should('have.text', 'Oct. 1, 2019');

    cy.get(':nth-child(1) > .text-center > .btn-danger').click();
    cy.get('tbody > tr > :nth-child(1)').should('have.text', 'My First Blog edited');
    cy.get('tbody > tr > :nth-child(2)').should('have.text', 'Oct. 1, 2019');
    cy.get('.btn-secondary').click();

    cy.location('pathname').should('eq', '/contents/blogs/edit/my-first-blog-edited');
    cy.get(':nth-child(1) > .col-sm-10 > .form-control').should(
      'have.value',
      'My First Blog edited'
    );
    cy.get(':nth-child(2) > .col-sm-10 > .form-control').should(
      'have.value',
      'my-first-blog-edited'
    );
    cy.get(':nth-child(3) > .col-sm-10 > .form-control').should('have.value', 'Oct. 1, 2019');
    cy.getData_ckeditor().then((d) => {
      expect(d).to.equal('<p>Ea labore irure magna eiusmod ullamco aliquip nisi.</p>');
    });
    cy.get(':nth-child(5) > .col-sm-10 > .form-control').should('have.value', 'Happy Dela Cruz');

    cy.get('.card-header > .btn').click();
    cy.location('pathname').should('eq', '/contents/blogs');
    cy.get('.m-0').should('contain', 'List Blogs');
  });
});
