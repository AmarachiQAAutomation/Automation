/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal"
  const issueTitle = 'This is an issue of type: Task.';

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.contains(issueTitle).click();
   
    })
  })
  //issue title, that we are testing with, saved into variable
  const issueTitle = 'This is an issue of type: Task.';

 it('Should delete issue successfully', () => {
      // Click the delete button
      IssueModal.clickDeleteButton()

       // verify confirmation dialog is visible and confirm delete
       IssueModal.confirmDeletion()
  
       //verify the issuedetial is closed
      IssueModal.closeDetailModal
      //verify the number of issue visible on the issue backloglist
      IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
       
 })
 it('Should cancel deletion process successfully', () => {
   //add steps to start deletion proces but cancel it
    //verify visbility of  delete button and click
   IssueModal.clickDeleteButton();
   //Confirm cancellation
   IssueModal.cancelDeletion()
   //confirm issue detail modal is closed
   IssueModal.closeDetailModal()
   //confirm that the issue is visible on the Board
   IssueModal.ensureIssueIsVisibleOnBoard(issueTitle)
   
 })


})