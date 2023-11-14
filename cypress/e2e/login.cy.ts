// login_page_spec.js

describe('Login Page', () => {
  beforeEach(() => {
    // Mock the login request
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        message: 'Logged in successfully',
        token: 'mockedToken',
        user_id: 'mockedUserId',
        username: 'mockedUsername',
        role: 'user',
      },
    }).as('loginRequest');

    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Visit the login page before each test
    cy.visit('http://localhost:5173/login');
  });

  it('should display the login form and handle successful login', () => {
    // Fill in the login form
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password');

    // Submit the form
    cy.get('form').submit();

    // Wait for the login request to complete
    cy.wait('@loginRequest');

    // Ensure that the user is redirected to the home page after successful login
    cy.url().should('eq', 'http://localhost:5173/');
    // Optionally, you can add assertions to check if the user is logged in
    // For example, check for the presence of a logged-in user's element on the home page
    cy.get('.MuiButtonBase-root.MuiIconButton-root').should('contain', 'mockedUsername');
  });

  it('should display an error message on failed login', () => {
    // Mock a failed login response
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' },
    }).as('loginRequest');

    // Fill in the login form with incorrect credentials
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('wrongpassword');

    // Submit the form
    cy.get('form').submit();

    // Wait for the login request to complete and check for the error message
    cy.wait('@loginRequest');
    cy.get('.Toastify__toast--error').should('contain', 'Invalid credentials');
  });

  // Add more test cases as needed
});
