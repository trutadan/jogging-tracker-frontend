// missing_page_spec.js

describe('404 Page', () => {
    beforeEach(() => {
      // Visit the missing page before each test
      cy.visit('http://localhost:5173/missing-page');
    });
  
    it('should display the 404 message and link to the main page', () => {
      // Assert that the heading and text are present
      cy.get('h2').should('contain', '404 - Page Not Found');
      cy.get('p').should('contain', 'The page you are looking for does not exist.');
  
      // Assert that the link to the main page is present and navigate to the main page
      cy.get('a').should('contain', 'Go to the Main Page').click();
  
      // Ensure that the URL changes to the main page
      cy.url().should('eq', 'http://localhost:5173/');
    });
  
    // You can add more test cases as needed
  });
  