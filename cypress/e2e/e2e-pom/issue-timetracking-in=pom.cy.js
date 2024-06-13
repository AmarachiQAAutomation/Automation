
import IssueModal from "../../pages/IssueModal";
describe('Time Tracking Functionality', () => {
beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.contains(TEST_TITLE).click();
   

    
    });
  });
   const originalEstimate = '10';
    const updatedEstimate = '20';
  const loggedTime = '4h';
  const remainingTime = '6h';

  it('Should add, edit, and remove time estimation successfully', () => {
      getIssueDetailsModal().within(() => {
      // Add time estimation
      getIssueDetailsModal().getTimeOriginalEstimate().clear().type(originalEstimate).blur();
      getIssueDetailsModal().validateTimeEstimation(originalEstimate);

      // Edit time estimation
      getIssueDetailsModal().getTimeOriginalEstimate().clear().type(updatedEstimate).blur();
      getIssueDetailsModal().validateTimeEstimation(updatedEstimate);

      // Remove time estimation
      getIssueDetailsModal().getTimeOriginalEstimate().clear().blur();
      getIssueDetailsModal().validateTimeEstimation('');
    });
  });

  it('Should log and validate time successfully', () => {
    getIssueDetailsModal().within(() => {
      // Log time
      getIssueDetailsModal().getTimeSpent().clear().type(loggedTime).blur();
      IssueDetailsPage.validateTimeLogged(loggedTime);

      // Validate remaining time
      IssueDetailsPage.getTimeRemainingEstimate().clear().type(remainingTime).blur();
      IssueDetailsPage.validateTimeLogged(remainingTime);

      // Validate time tracking
      IssueDetailsPage.validateTimeLogged(loggedTime);
      IssueDetailsPage.validateTimeLogged(remainingTime);
    });
  });
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

});
   
