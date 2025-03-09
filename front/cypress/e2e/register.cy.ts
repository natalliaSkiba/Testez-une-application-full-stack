describe('Register tests', () => {
    it('should register successfull', () => {
        cy.register();
    })

    it('should submit button be disabled if a mandatory field is empty', () => {
        cy.intercept('POST', '/api/auth/register', {
            body: {
                id: 1,
                username: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                admin: true
            },
        })

        cy.visit('/register');

        cy.get('input[formControlName=firstName]').click();
        cy.get('input[formControlName=lastName]').type("studio")
        cy.get('input[formControlName=email]').type("yoga@studio.com")
        cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

        cy.get('button[type="submit"]').should('be.disabled');
    })
});