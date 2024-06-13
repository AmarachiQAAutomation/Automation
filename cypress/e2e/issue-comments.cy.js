      import { faker } from '@faker-js/faker'
describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
     const getConfirmationPopup = ()  => cy.get('[data-testid="modal:confirm"]')


    it('Should create a comment successfully', () => {
        const comment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');
                
                cy.contains('Add a comment...').should('exist');
              cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
       getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');
 
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist')
    })

    it('Should Add,edit and remove a comment successful ', () => {
       //Generate random comments 
    const randomCommentText = faker.lorem.sentence();
    const randomUpdatedCommentText = faker.lorem.sentence();
          // Add comment
          getIssueDetailsModal().within(() => {
              cy.contains('Add a comment...')
                .click()

        cy.get('textarea[placeholder="Add a comment..."]').type(randomCommentText);

           cy.contains('button', 'Save')
                .click()
                .should('not.exist');
                
                cy.contains('Add a comment...').should('exist');
              cy.get('[data-testid="issue-comment"]').should('contain', randomCommentText)

       })
    
                cy.get('[data-testid="issue-comment"]')
                    .first()
                    .contains('Edit')
                    .click()
                    .should('not.exist');
     // verify that the comment is edited with random data
                cy.get('textarea[placeholder="Add a comment..."]')
                    .should('contain', randomCommentText)
                    .clear()
                    .type(randomUpdatedCommentText)
     
                cy.contains('button', 'Save')
                    .click()
                    .should('not.exist');
    
                cy.get('[data-testid="issue-comment"]')
                    .should('contain', 'Edit')
                    .and('contain',randomCommentText)
       // delete comment
         getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click()
        // confirm visiblity of confirmation dialog and confirm delete
        getConfirmationPopup()
            .should('be.visible')
            .contains('button', 'Delete comment')
            .click() 
            .should('not.exist')
      // confirm that the  deleted comment is no longer visible
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.contain', randomCommentText)

    })      
                    
})
