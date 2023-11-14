// home_page_spec.js

describe('Home Page', () => {
    beforeEach(() => {
      // Visit the home page before each test
      cy.visit('http://localhost:5173/');
    });
  
    it('should display the welcome message', () => {
      // Assert that the heading is present
      cy.get('h1').should('contain', 'Welcome to the Jogging Times Tracker');
    });
  
    // You can add more test cases as needed
  });
  