describe('Session edition by admins', () => {
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
  
      cy.intercept('DELETE', '/api/session/1', { statusCode: 200 });
  
      cy.intercept('GET', '/api/teacher',
        [
          {
            "id": 1,
            "firstName": "Tata",
            "lastName": "Toto"
          }
        ]
      );
      
      cy.intercept('GET', '/api/teacher/1', {
        body: {
          "id": 1,
          "firstName": "Tata",
          "lastName": "Toto"
        },
      });
    });
  
    it('should create a new session', () => {
      cy.loginAdmin();
      cy.get('button[routerlink="create"]').click();
      
      cy.get('input[formControlName=name]').type(sessionData.name);
      cy.get('input[formControlName=date]').type(sessionData.date);
      cy.get('[formControlName=teacher_id]').click();
      cy.get('span.mat-option-text').click();
      cy.get('[formControlName=description]').type(sessionData.description);
      
      cy.get('button[type="submit"]').click();
  
      cy.get('simple-snack-bar').should('contain', 'Session created !');
    });
  
  
    it('should not create a new session because of an empty field', () => {
      cy.loginAdmin();
      cy.get('button[routerlink="create"]').click();
  
      cy.get('input[formControlName=name]').focus();
      cy.get('input[formControlName=date]').type(sessionData.date);
      cy.get('[formControlName=teacher_id]').click();
      cy.get('span.mat-option-text').click();
      cy.get('[formControlName=description]').type(sessionData.description);
      
      cy.get('button[type="submit"]').should('be.disabled');
    });
  
    it('should edit a session', () => {
      cy.loginAdmin();
    
      cy.get('button[data-testid="edit"]').first().click();
      cy.get('[formControlName=description]').type(sessionData.description);
      cy.get('button[type="submit"]').click();
  
      cy.get('simple-snack-bar').should('contain', 'Session updated !')
    });
  
    it('should not edit a session because of an empty field', () => {
      cy.loginAdmin();
    
      cy.get('button[data-testid="edit"]').first().click();
      cy.get('[formControlName=description]').clear();
  
      cy.get('button[type="submit"]').should('be.disabled');
    });
  
     it('should allow to delete session if user is admin', () => {
      cy.loginAdmin();
  
      cy.get('button:contains("Detail")').first().click();
      cy.get('button:contains("Delete")').first().click();
  
      cy.get('simple-snack-bar').should('contain', 'Session deleted !');
     });
  });