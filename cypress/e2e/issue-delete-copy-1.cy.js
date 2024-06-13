describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
         // System will already open issue details modal in before-Each block
         cy.visit(url + '/board?modal-issue-details=true')
         cy.contains('This is an issue of type: Task.').click();

      })
   })
   const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');


it('Should delete an issue and validate it is no longer displayed on the board', () => {
  // Verify the visiblity of the delete button and click
  getIssueDetailsModal()
      .find('[data-testid="icon:trash"]')
      .click();

     // confirm that  the issue is deleted by clicking the delete issue button
     cy.get('[data-testid="modal:confirm"]').should('be.visible')
     .contains('button', 'Delete issue')
     .click()
    
     // Verify that the confirmation dialog is no longer visible
     cy.get('[data-testid="modal:confirm"]').should('not.exist');

    // Verify that the deleted issue is no longer visible on the board
       cy.get('[data-testid="board-list:backlog"]').should('not.contain', 'This is an issue of type: Task.')
      })

it('should initiate issue delete and cancel it',() => {
 // Verify the presence of the delete button
  getIssueDetailsModal()
        .find('[data-testid="icon:trash"]')
        .click();

     // Confirm the deletion modal is visible and confirm cancellation
     cy.get('[data-testid="modal:confirm"]').should('be.visible')
         .contains('button', 'Cancel')
         .click() 

     // Verify that the confirmation dialog is no longer visible
     cy.get('[data-testid="modal:confirm"]').should('not.exist');

     // Verify that the cancelled issue is visible on the board
     cy.get('[data-testid="board-list:backlog"]').should('contain', 'This is an issue of type: Task.')
   })
  })