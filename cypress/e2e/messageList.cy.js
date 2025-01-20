// cypress/e2e/messageList.spec.cy.ts

describe('MessageList Component', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('/login');

        // Perform login to reach the dashboard
        cy.intercept('POST', 'http://192.168.124.28:1524/api/users/auth/login', { fixture: 'login-success.json' }).as('loginRequest');
        cy.login('mitar', 'mitar123');
        cy.wait('@loginRequest');
        cy.url().should('include', '/dashboard');

        // Select the 'General' channel
        cy.get('[data-cy=channel-1]').click();
    });

    it('should display messages for the selected channel', () => {
        // Verify MessageList is visible
        cy.get('[data-cy=message-list]').should('be.visible');

        // Verify specific messages are present
        cy.get('[data-cy=message-list]')
            .should('contain.text', 'Welcome to the General channel!')
            .and('contain.text', 'Feel free to chat here.');

        // Verify message sender and timestamp
        cy.get('[data-cy=message-list] [data-cy=message]')
            .each(($msg) => {
                cy.wrap($msg).should('have.attr', 'data-sender').and('not.be.empty');
                cy.wrap($msg).should('have.attr', 'data-timestamp').and('not.be.empty');
            });
    });

    it('should update MessageList when a new message is sent', () => {
        const newMessage = 'This is a new test message!';

        // Send a new message
        cy.get('[data-cy=message-input]').type(`${newMessage}{enter}`);

        // Verify the new message appears in the MessageList
        cy.get('[data-cy=message-list]')
            .should('contain.text', newMessage);
    });
});
