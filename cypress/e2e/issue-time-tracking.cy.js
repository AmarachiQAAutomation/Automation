import { faker } from "@faker-js/faker";
import IssueModal from "../pages/IssueModal";
import { values } from "lodash"
values
describe('Time Tracking Functionality', () => {
  const randomTitle = faker.lorem.words(6);
  const randomDescription = faker.lorem.words(8);
  const issueDetails = {
    title: "TIMETRACKING_TITLE",
    type: "Bug",
    description: randomDescription,
    assignee: "Lord Gaben",
  };
  const EXPECTED_AMOUNT_OF_ISSUES = '5';
  const originalEstimateHours = 'input[placeholder="Number"]';
  const estimateTime = '10';
  const updatedEstimateTime = '20';
 
  

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.visit(url + '/board');
      cy.visit(url + '/board?modal-issue-create=true');
    });
    
    // Create new issue
    IssueModal.createIssue(issueDetails);
    IssueModal.ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
  });
  it.only('Should add, update, and remove estimation successfully', () => {
    // Open the newly created issue and click on the first issue in the backlog
    cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 }).should('be.visible').within(() => {
      cy.get('[data-testid="list-issue"]').contains('TIMETRACKING_TITLE').click();
    });

   //Verify that the time tracker is visible and no time logged is visible
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.contains('No time logged').should('be.visible');

       // Add and save estimation value
      // verify the added estimation are visiblein the original estimation hours
      cy.get(originalEstimateHours).first().should('be.visible').clear({ force: true }).type(estimateTime, { force: true })
      cy.get(originalEstimateHours).first().should('contain.value', estimateTime)

      // Close issue details modal
      cy.get('[data-testid="icon:close"]').first().click({ force: true })
 
    });

    // Reopen the issue to verify the added estimated value is saved and visible
    cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 }).should('be.visible').within(() => {
      cy.contains('TIMETRACKING_TITLE').click({ force: true })
    })
       cy.get('[data-testid="modal:issue-details"]').within(() => {
        cy.contains(`estimated: ${estimateTime}`)
       
        // Update estimation value
      cy.get(originalEstimateHours).first().clear({ force: true }).type(updatedEstimateTime, { force: true })
      cy.get(originalEstimateHours).first().should('have.value', updatedEstimateTime);

      // Close issue details modal after updating estimation
      cy.get('[data-testid="icon:close"]').first().click();
    });
     
    // Reopen the issue to verify the updated estimated value is saved
      cy.reload();
      cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 }).should('be.visible').within(() => {
        cy.contains('TIMETRACKING_TITLE').click()
    });
      cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get(originalEstimateHours).first().should('have.value',updatedEstimateTime)
      
    // Remove estimation value
      cy.get(originalEstimateHours).first().clear({ force: true });
      cy.get(originalEstimateHours).first().should('have.value', '');

      // Close the issue details modal after removing estimation
      cy.get('[data-testid="icon:close"]').first().click();
    });

    // Reopen the issue to verify the estimated value is removed
      cy.reload();
      cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 }).should('be.visible').within(() => {
      cy.contains('TIMETRACKING_TITLE').click()
    });

         cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get(originalEstimateHours).first().should('have.value', '')
    });
  });
    
 it.only('Should log time and then remove logged time successfully', () => {
     const timeSpent = '2h'
     const timeRemaining = '5h'
    // Open the newly created issue
     cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 }).should('be.visible').within(() => {
      cy.contains('TIMETRACKING_TITLE').click();
    });

     // Log time and confirm visiblity
     cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get(('[data-testid="icon:stopwatch"]')).click();
      cy.get('input[placeholder="Number"]').eq(0).clear().type(timeSpent)
      cy.get('input[placeholder="Number"]').eq(1).clear().type(timeRemaining)
       cy.contains(`Spent time: ${timeSpent}`).should('be.visible');
      cy.contains(`Remaining time: ${timeRemaining}`).should('be.visible')
      cy.contains('button', 'Done').click({ force: true }).should('not.exist');
      cy.contains(`Spent time: ${timeSpent}`).should('be.visible');
      cy.contains(`Remaining time: ${timeRemaining}`).should('be.visible')

      // Remove logged time
      cy.get(('[data-testid="icon:stopwatch"]')).click();
      cy.get('input[placeholder="Number"]').eq(0).clear({ force: true });
      cy.get('input[placeholder="Number"]').eq(1).clear({ force: true });
      cy.contains('button', 'Done').click({ force: true }).should('not.exist');
      cy.contains('No Time Logged').should('be.visible');

      // Close the issue details modal
      cy.get('[data-testid="icon:close"]').first().click({ force: true });
    });

    // Reopen the issue to verify the logged time is removed
    cy.reload();
    cy.get('[data-testid="board-list:backlog"]', { timeout: 60000 }).should('be.visible').within(() => {
      cy.contains('TIMETRACKING_TITLE').click();
    });

    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.contains('No Time Logged').should('be.visible');
  })
})
})
