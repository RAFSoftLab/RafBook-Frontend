/// <reference types="cypress" />

/**
 * Custom command to perform login.
 * @param username - The username for login.
 * @param password - The password for login.
 * @param rememberMe - Optional boolean to check the "Remember Me" checkbox.
 */
Cypress.Commands.add(
  'login',
  (username: string, password: string, rememberMe: boolean = false) => {
    cy.get('[data-cy=username-input]').type(username, { delay: 100 });
    cy.get('[data-cy=password-input]').type(password, { delay: 100 });

    if (rememberMe) {
      cy.get('[data-cy=remember-me-checkbox] input[type="checkbox"]').check();
    }

    cy.get('[data-cy=login-button]').click();
  }
);
