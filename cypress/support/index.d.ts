/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to perform login.
     * @param username - The username for login.
     * @param password - The password for login.
     * @param rememberMe - Optional boolean to check the "Remember Me" checkbox.
     * @example
     * cy.login('mitar', 'mitar1234')
     * cy.login('mitar', 'mitar1234', true)
     */
    login(
      username: string,
      password: string,
      rememberMe?: boolean
    ): Chainable<void>;
  }
}
