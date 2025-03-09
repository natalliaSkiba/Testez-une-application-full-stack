describe('Login tests', () => {
  it('should login as admin successfully', () => {
    cy.loginAdmin();

    cy.get('button[routerlink="create"]').should('exist');
  });

  it('should login as user successfully', () => {
    cy.loginUser();

    cy.get('button[routerlink="create"]').should('not.exist');
  });

  it('should logout', () => {
    cy.loginUser();

    cy.contains('span.link', 'Logout').click();

    cy.url().should('include', 'http://localhost:4200');
  });

  it('should display user admin data', () => {
    const user = {
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'yoga@studio.com',
      admin: true
    };

    cy.intercept('GET', '/api/user/1', { body: user }).as('getUser');

    cy.loginAdmin();
    cy.get('span[routerlink="me"]').click();
    
    cy.wait('@getUser');

    cy.get('[data-testid="emailParagraph"]').should('contain', user.email);
    cy.get('[data-testid="nameParagraph"]').should('contain', user.firstName);
    cy.get('[data-testid="nameParagraph"]').should('contain', user.lastName.toUpperCase());
  });

  it('should delete the logged in account', () => {
    cy.intercept('DELETE', '/api/user/1', { statusCode: 200 }).as('deleteUser');
    
    const user = {
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'yoga@studio.com',
      admin: false
    };
    
    cy.intercept('GET', '/api/user/1', { body: user }).as('getUser');

    cy.loginUser();
    cy.get('span[routerlink="me"]').click();
    cy.contains('button', 'Detail').click();

    cy.wait('@deleteUser');
    
    cy.url().should('include', 'http://localhost:4200');
  });
});
