describe('Login Screen', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean state
    cy.clearLocalStorage();
    cy.visit('/login'); // Cypress uses the baseUrl from cypress.config.ts
  });

  it('should display the login form', () => {
    // Check for username and password fields
    cy.get('[data-cy=username-input]').should('be.visible');
    cy.get('[data-cy=password-input]').should('be.visible');

    // Check for Remember Me checkbox
    cy.get('[data-cy=remember-me-checkbox]').should('be.visible');

    // Check for Login button
    cy.get('[data-cy=login-button]').should('be.visible');
  });

  it('should enable the Login button when input fields are filled', () => {
    cy.get('[data-cy=username-input]').type('testuser', { delay: 100 });
    cy.get('[data-cy=password-input]').type('password123', { delay: 100 });

    cy.get('[data-cy=login-button]').should('not.be.disabled');
  });

  it('should disable the Login button when only username is filled', () => {
    cy.get('[data-cy=username-input]').type('testuser', { delay: 100 });

    cy.get('[data-cy=login-button]').should('be.disabled');
  });

  it('should disable the Login button when only password is filled', () => {
    cy.get('[data-cy=password-input]').type('password123', { delay: 100 });

    cy.get('[data-cy=login-button]').should('be.disabled');
  });

  it('should perform successful login and navigate to dashboard', () => {
    // 1. Set up the intercept before the action
    cy.intercept('POST', 'http://192.168.124.28:1524/api/users/auth/login', { fixture: 'login-success.json' }).as('loginRequest');

    // 2. Perform the login action
    cy.login('mitar', 'mitar123');

    // 3. Wait for the intercepted request
    cy.wait('@loginRequest').its('request.body').should('deep.equal', {
      username: 'mitar',
      password: 'mitar123',
    });

    // 4. Additional assertions
    cy.window().then((window) => {
      expect(window.localStorage.getItem('token')).to.exist;
    });

    cy.url().should('include', '/dashboard');
  });

  it('should display default error message on failed login', () => {
    // Intercept the login API request and respond with a 403 status and empty body
    cy.intercept('POST', 'http://192.168.124.28:1524/api/users/auth/login', {
      statusCode: 403,
      body: {}, // No message returned
    }).as('loginRequest');

    // Use the custom login command with invalid credentials
    cy.login('wronguser', 'wrongpassword');

    // Wait for the login API call
    cy.wait('@loginRequest');

    // Check for default error message
    cy.get('[data-cy=error-message]').should(
      'contain.text',
      'Login failed'
    );

    // Ensure token is not stored
    cy.window().then((window) => {
      expect(window.localStorage.getItem('token')).to.be.null;
    });

    // Ensure URL remains on /login
    cy.url().should('include', '/login');
  });

  it('should store token in localStorage when "Remember Me" is checked', () => {
    // Intercept the login API request and respond with the success fixture
    cy.intercept('POST', 'http://192.168.124.28:1524/api/users/auth/login', { fixture: 'login-success.json' }).as('loginRequest');

    // Use the custom login command with "Remember Me" checked
    cy.login('mitar', 'mitar123', true);

    // Wait for the login API call
    cy.wait('@loginRequest');

    // Check that token is stored in localStorage
    cy.window().then((window) => {
      expect(window.localStorage.getItem('token')).to.equal('fake-jwt-token');
    });

    // Additional assertions based on "Remember Me" functionality can be added here
  });

  it('should redirect to dashboard if token exists in localStorage', () => {
    // Set token in localStorage before visiting the page
    cy.window().then((window) => {
      window.localStorage.setItem('token', 'existing-token');
    });

    // Visit the login page
    cy.visit('/login');

    // Check that it redirects to dashboard
    cy.url().should('include', '/dashboard');
  });
});
