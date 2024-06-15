describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben",
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick",
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title,
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it("Should check the Priority dropdown options", () => {
    const expectedLength = 5;
    let priorityOptions = [];
    getIssueDetailsModal().within(() => {
      // Push the initially selected priority value into the array
      cy.get('[data-testid="select:priority"]')
        .invoke("text")
        .then((initialPriority) => {
          priorityOptions.push(initialPriority.trim());
          cy.log(`Initial Priority: ${initialPriority.trim()}`);
        });

      // Open the priority dropdown
      cy.get('[data-testid="select:priority"]').click("bottomRight");

      // Access all priority options and loop through them
      cy.get('[data-testid^="select-option:"]')
        .each(($option, index, $list) => {
          const optionText = $option.text().trim();
          priorityOptions.push(optionText);
          cy.log(`Option ${index + 1}: ${optionText}`);
          cy.log(`Array Length: ${priorityOptions.length}`);
        })
        .then(() => {
          // Assert that the array length is as expected
          cy.wrap(priorityOptions).should("have.length", expectedLength);
        });
    });
  });
  it("Should validate that reporter's name contains only characters", () => {
    getIssueDetailsModal().within(() => {
      // Access the reporter name
      cy.get('[data-testid="select:reporter"]')
        .invoke("text")
        .then((reporterName) => {
          cy.log(`Reporter Name: ${reporterName.trim()}`);
          // Assert that the reporter name contains only letters and spaces
          expect(reporterName.trim()).to.match(/^[A-Za-z\s]+$/);
        })
    })
  })
})
