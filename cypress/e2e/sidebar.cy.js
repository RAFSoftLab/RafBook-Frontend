// cypress/e2e/sidebar.spec.cy.ts

describe('Sidebar Component', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit('/login');
  
      // Perform login to reach the dashboard
      cy.intercept('POST', 'http://192.168.124.28:1524/api/users/auth/login', { fixture: 'login-success.json' }).as('loginRequest');
      cy.login('mitar', 'mitar123');
      cy.wait('@loginRequest');
      cy.url().should('include', '/dashboard');
    });
  
    it('should render the sidebar with all channels', () => {
      // Verify Sidebar is visible
      cy.get('aside').should('be.visible'); // Assuming the Sidebar is rendered within an <aside> tag
  
      // Verify all channels are listed
      const channels = [
        { id: 1, name: 'General', type: 'text' },
        { id: 2, name: 'Announcements', type: 'text' },
        { id: 3, name: 'Random', type: 'text' },
        { id: 4, name: 'Gaming', type: 'voice' },
        { id: 5, name: 'Music', type: 'voice' },
        { id: 6, name: 'Study Group', type: 'voice' },
      ];
  
      channels.forEach((channel) => {
        cy.get(`[data-cy=channel-${channel.id}]`)
          .should('contain.text', channel.name)
          .and('be.visible');
      });
    });
  
    it('should display correct icons for each channel type', () => {
      // Text channels should have TextsmsIcon
      cy.get('[data-cy=channel-1] svg').should('have.attr', 'data-icon', 'textsms');
      cy.get('[data-cy=channel-2] svg').should('have.attr', 'data-icon', 'textsms');
      cy.get('[data-cy=channel-3] svg').should('have.attr', 'data-icon', 'textsms');
  
      // Voice channels should have VolumeUpIcon
      cy.get('[data-cy=channel-4] svg').should('have.attr', 'data-icon', 'volumeup');
      cy.get('[data-cy=channel-5] svg').should('have.attr', 'data-icon', 'volumeup');
      cy.get('[data-cy=channel-6] svg').should('have.attr', 'data-icon', 'volumeup');
    });
  });
  