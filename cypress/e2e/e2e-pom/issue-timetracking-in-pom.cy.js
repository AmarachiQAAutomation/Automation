 import IssueModal from "../../pages/IssueModal";
 const issueTitle = "This is an issue of type: Task.";
describe("Time Tracking", () => {
  
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`).then(() => {
    cy.contains(issueTitle).click();


  
  })
  })
   const issueTitle = "This is an issue of type: Task.";
  const estimateTime = "10";
  const updatedEstimation = "20";
  const timeSpent = "2h";
  const timeRemaining = "5h";
     
  
  it("Should add, update, and remove estimation successfully", () => {
    // Add a time estimation
    IssueModal.addEstimation(estimateTime);

    // Edit the time estimation
    IssueModal.editEstimation(updatedEstimation);

    // Remove the time estimation
    IssueModal.removeEstimation();


  });

  it("Should log time and remove logged successfully", () => {
    // Log time
    IssueModal.logTime(timeSpent, timeRemaining);

    // Remove logged time
    IssueModal.removeLoggedTime()

  });
})