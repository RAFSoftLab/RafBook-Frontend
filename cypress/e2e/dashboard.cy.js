describe('Dashboard - Desktop View', () => {

    beforeEach(() => {
        cy.viewport(1280, 720); // Set viewport to desktop size

        // 1. Clear local storage and cookies to ensure a clean state
        cy.clearLocalStorage();
        cy.clearCookies();

        // 2. Intercept the API call to login
        cy.intercept('POST', '**/api/users/auth/login').as('loginRequest');

        // 3. Intercept the API call to fetch dashboard data and log the response
        cy.intercept('GET', '**/api/text-channel/for-user*').as('fetchDashboard');

        // 4. Visit the login page
        cy.visit('/login');

        // 5. Perform login
        cy.login('mitar', 'mitar123');

        // 6. Wait for the login API call to complete and set the token in local storage
        cy.wait('@loginRequest').then((interception) => {
            // Ensure the login was successful
            expect(interception.response.statusCode).to.eq(200);

            // Extract the token from the response body
            const token = interception.response.body.token;

            // Use cy.window() to access the window object and set the token in local storage
            cy.window().then((window) => {
                window.localStorage.setItem('token', token);
            });
        });

        // 7. Wait for the dashboard data to load
        cy.wait('@fetchDashboard').then((interception) => {
            // Log the API response for debugging
            console.log('For-User API Response:', interception.response.body);
        });

        // 8. Ensure we are on the dashboard page
        cy.url().should('include', '/dashboard');

        cy.wait(1000); // Wait for the dashboard to fully load

        // 9. Handle the study program selector modal if it appears
        cy.get('body').then(($body) => {
            if ($body.find('[data-cy=study-program-selector-modal]').length > 0) {
                // Modal is present
                cy.get('[data-cy=study-program-selector-modal]').should('be.visible');

                // Step 1: Select a study level
                cy.get('[data-cy=study-program-selector-modal] [data-cy^=select-study-level-]')
                    .eq(1)
                    .should('be.visible')
                    .should('contain.text', 'Osnovne akademske studijeOsnovne akademske studije na Racunarskom fakultetu')
                    .click();

                // Optional: Verify study programs are loaded
                cy.get('[data-cy=study-program-selector-modal]').then(($modal) => {
                    console.log('Modal after selecting study level:', $modal.html());
                });

                // Step 2: Select a study program
                cy.get('[data-cy=study-program-selector-modal] [data-cy^=select-study-program-]', { timeout: 10000 })
                    .eq(1)
                    .should('be.visible')
                    .should('contain.text', 'Racunarske naukeRacunarske nauke na Racunarskom fakultetu')
                    .click();
            }

            cy.wait(1000); // Wait for the dashboard to fully load

        });

        //insure that the modal is closed
        cy.get('[data-cy=study-program-selector-modal]').should('not.exist');

        // 10. Ensure the dashboard has fully loaded
        cy.wait('@fetchDashboard'); // Wait again if necessary
    });


    ////////////////////////////////////////////////////////////////////////////////

    it('should display the header with the correct channel name', () => {
        cy.get('[data-cy=header]').should('be.visible');
        cy.get('[data-cy=channel-name]').should('contain.text', 'Channel Description');
    });

    it('should mute and deafen the user via user controls', () => {
        // Verify initial state
        cy.get('[data-cy=mute-button]:visible')
          .should('have.attr', 'aria-label', 'Mute');
        cy.get('[data-cy=deafen-button]:visible')
          .should('have.attr', 'aria-label', 'Deafen');
    
        // Mute the user
        cy.get('[data-cy=mute-button]:visible').click();
        cy.get('[data-cy=mute-button]:visible')
          .should('have.attr', 'aria-label', 'Unmute');

        cy.wait(250);
    
        // Deafen the user
        cy.get('[data-cy=deafen-button]:visible').click();
        cy.get('[data-cy=deafen-button]:visible')
          .should('have.attr', 'aria-label', 'Undeafen');

        cy.wait(500);
    
        // Unmute the user
        cy.get('[data-cy=mute-button]:visible').click();
        cy.get('[data-cy=mute-button]:visible')
          .should('have.attr', 'aria-label', 'Mute');

        cy.wait(250);
    
        // Undeafen the user
        cy.get('[data-cy=deafen-button]:visible').click();
        cy.get('[data-cy=deafen-button]:visible')
          .should('have.attr', 'aria-label', 'Deafen');

        cy.wait(500);
    });

    it('should open and close the settings modal, switch to Appearance tab, and toggle Dark Mode', () => {
        // Step 1: Click the visible settings button (desktop or mobile)
        cy.get('[data-cy=settings-button]:visible')
          .should('have.length', 1) // Ensure only one settings button is visible
          .click();
    
        // Step 2: Assert that the settings modal is visible
        cy.get('[aria-labelledby="settings-modal-title"]')
          .should('be.visible');
    
        // Step 3: Switch to the Appearance tab by clicking the visible tab labeled "Appearance"
        cy.get('[role="tab"]:visible')
          .contains('Appearance')
          .should('have.length', 1) // Ensure only one visible "Appearance" tab exists
          .click();

        cy.wait(500);
    
        // Step 4: Toggle the Dark Mode switch directly using the data-cy attribute
        cy.get('[data-cy=dark-mode-switch]')
          .should('not.be.checked') // Ensure it's initially unchecked
          .click(); // Force the click if necessary
    
        // Step 5: Assert that Dark Mode is enabled by checking the body's background color
        cy.get('body')
          .should('have.css', 'background-color', 'rgb(33, 33, 33)'); // Replace with your dark mode RGB value
    
        cy.wait(2000)

        // Optional Step 6: Toggle the Dark Mode switch back to its original state
        cy.get('[data-cy=dark-mode-switch]')
          .click();
    
        cy.wait(500);

        cy.get('body')
          .should('have.css', 'background-color', 'rgb(245, 245, 245)'); // Replace with your light mode RGB value
    
        // Step 7: Close the settings modal by clicking the close button
        cy.get('svg[data-testid="CloseIcon"]:visible').parent('button').click();
    
        // Step 8: Assert that the settings modal is no longer visible
        cy.get('[aria-labelledby="settings-modal-title"]')
          .should('not.exist');
    });
    



    it('should display 4 categories in the sidebar, each with 3 channels, and allow expanding/collapsing each', () => {

        // 1. Select the sidebar within the desktop drawer and scope all subsequent commands within it
        cy.get('[data-cy=desktop-drawer] [data-cy=sidebar]:visible')
            .should('be.visible')
            .within(() => {
                // 2. Get all category container elements (excluding category buttons) within the desktop sidebar
                cy.get('[data-cy^=category-]:not([data-cy^=category-button-])')
                    .then(($categories) => {
                        cy.log(`Found ${$categories.length} categories`);

                        // Log each category's data-cy attribute
                        $categories.each((index, category) => {
                            const dataCy = Cypress.$(category).attr('data-cy'); // Corrected
                            cy.log(`Category ${index + 1}: ${dataCy}`);
                        });

                        // Assert that there are exactly 4 categories
                        expect($categories).to.have.length(4);

                        // Iterate over each category
                        cy.wrap($categories).each(($category) => {
                            // Extract the category ID from the data-cy attribute
                            const dataCy = Cypress.$($category).attr('data-cy'); // Corrected attribute access
                            const categoryId = dataCy?.split('-').pop(); // e.g., '1001'
                            cy.log(`Processing Category ID: ${categoryId}`);

                            if (categoryId) {
                                // 4. Click to expand the category
                                cy.log(`Expanding Category ${categoryId}`);
                                cy.get(`[data-cy=category-button-${categoryId}]`).click();

                                // 5. Assert that 3 channels are visible within the category, excluding 'channel-name-*'
                                cy.get(`[data-cy=category-${categoryId}] [data-cy^=channel-]:not([data-cy^=channel-name-])`)
                                    .then(($channels) => {
                                        cy.log(`Category ${categoryId} has ${$channels.length} channels (excluding 'channel-name-*')`);
                                        cy.log(`Channels: ${$channels.map((i, el) => Cypress.$(el).attr('data-cy')).get().join(', ')}`);
                                        expect($channels).to.have.length(3); // Re-enable assertion

                                        // Log each channel's data-cy attribute
                                        $channels.each((index, channel) => {
                                            const channelDataCy = Cypress.$(channel).attr('data-cy'); // Corrected attribute access
                                            cy.log(`Channel ${index + 1} in Category ${categoryId}: ${channelDataCy}`);
                                        });
                                    });

                                    cy.wait(500); // Wait for the channels to fully load

                                // 6. Click again to collapse the category
                                cy.get(`[data-cy=category-button-${categoryId}]`).click();

                                // 7. Assert that channels are no longer visible (excluding 'channel-name-*')
                                cy.get(`[data-cy=category-${categoryId}] [data-cy^=channel-]:not([data-cy^=channel-name-])`)
                                    .should('not.exist');
                            }
                        });
                    });
            });
    });

    

    // it('should select a text channel and display messages', () => {
    //     // Expand study level and select study program
    //     cy.get('[data-cy=study-level-item-1]').click();
    //     cy.get('[data-cy=select-study-program-101]').click();

    //     // Select a text channel
    //     cy.get('[data-cy=channel-5002]').click();

    //     // Verify that MessageList and MessageInput are visible
    //     cy.get('[data-cy=message-list-container]').should('be.visible');
    //     cy.get('[data-cy=message-input-container]').should('be.visible');

    //     // Verify the channel name in the header updates
    //     cy.get('[data-cy=channel-name]').should('contain.text', 'general-chat');
    // });

    // it('should send a text message successfully', () => {
    //     // Intercept the POST request for sending messages and respond with the new message
    //     cy.intercept('POST', 'http://192.168.124.28:1524/api/messages/send', (req) => {
    //         req.reply({
    //             statusCode: 200,
    //             body: {
    //                 id: 10004,
    //                 content: 'Hello, this is a test message!',
    //                 createdAt: '2025-01-20T23:07:00.000Z',
    //                 type: 'TEXT',
    //                 mediaUrl: null,
    //                 sender: {
    //                     id: 2,
    //                     firstName: 'John',
    //                     lastName: 'Doe',
    //                     username: 'johndoe',
    //                     email: 'john@raf.rs',
    //                     role: ['USER']
    //                 },
    //                 reactions: [],
    //                 parentMessage: null,
    //                 deleted: false,
    //                 edited: false
    //             }
    //         });
    //     }).as('sendMessage');

    //     // Expand study level and select study program
    //     cy.get('[data-cy=study-level-item-1]').click();
    //     cy.get('[data-cy=select-study-program-101]').click();

    //     // Select a text channel
    //     cy.get('[data-cy=channel-5002]').click();

    //     // Type a message
    //     cy.get('[data-cy=message-textfield]').type('Hello, this is a test message!', { delay: 100 });

    //     // Click send
    //     cy.get('[data-cy=send-message-button]').click();

    //     // Wait for the message send API call
    //     cy.wait('@sendMessage').its('response.statusCode').should('eq', 200);

    //     // Verify the message appears in the message list
    //     cy.get('[data-cy=message-list]').should('contain.text', 'Hello, this is a test message!');
    // });

    // it('should retain channel selection after page refresh', () => {
    //     // Expand study level and select study program
    //     cy.get('[data-cy=study-level-item-1]').click();
    //     cy.get('[data-cy=select-study-program-101]').click();

    //     // Select a text channel
    //     cy.get('[data-cy=channel-5002]').click();

    //     // Refresh the page
    //     cy.reload();

    //     // Verify the selected channel is still active
    //     cy.get('[data-cy=channel-5002]').should('have.class', 'Mui-selected');
    //     cy.get('[data-cy=message-list-container]').should('be.visible');
    // });

});
