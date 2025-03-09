describe('Session inscription for users', () => {
    const sessionData = {
        id: 1,
        name: 'Morning Yoga',
        date: '2024-12-25',
        teacher_id: 1,
        description: 'A relaxing yoga session to start the day.',
        users: [],
    };

    const sessionsData = [
        {
            "id": 1,
            "title": "Session 1",
            "date": "2025-01-01",
            "teacher_id": 1,
            "description": "This is the first session",
            "users": []
        },
        {
            "id": 2,
            "title": "Session 2",
            "date": "2025-01-02",
            "teacher_id": 1,
            "description": "This is the second session",
            "users": []
        }];


    beforeEach(() => {
        cy.intercept('POST', '/api/session', sessionData);
        cy.intercept('GET', '/api/session', sessionsData);

        cy.intercept('GET', '/api/session/1', sessionData);
        cy.intercept('PUT', '/api/session/1', sessionData);


        cy.intercept('GET', '/api/teacher/1', {
            body: {
                "id": 1,
                "firstName": "Tata",
                "lastName": "Toto"
            },
        });
    });
    it("should participate button exist if user isn't admin", () => {
        cy.loginUser();
        cy.get('button:contains("Detail")').first().click();
        cy.get('button:contains("Participate")').should('exist');
    });

    it('should not be able to create or edit session', () => {
        cy.loginUser();

        cy.get('button[data-testid="edit"]').should('not.exist');
    });
});