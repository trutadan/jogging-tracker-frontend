// unauthorized_page_spec.js

describe('401 Page', () => {
    beforeEach(() => {
      // Visit the unauthorized page before each test
      cy.visit('http://localhost:5173/unauthorized');
    });
  
    it('should display the 401 message and link to the main page', () => {
      // Assert that the heading and text are present
      cy.get('h2').should('contain', '401 - Unauthorized');
      cy.get('p').should('contain', 'You do not have permission to access this page.');
  
      // Assert that the link to the main page is present and navigate to the main page
      cy.get('a').should('contain', 'Go to the Main Page').click();
  
      // Ensure that the URL changes to the main page
      cy.url().should('eq', 'http://localhost:5173/');
    });
  
    // You can add more test cases as needed
  });
  