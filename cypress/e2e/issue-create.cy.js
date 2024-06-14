// Import Faker
import { faker } from '@faker-js/faker';
describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        // System will already open issue creating modal in before-Each block
        cy.visit(url + '/board?modal-issue-create=true');
      });
  
  it('Should create an issue and validate it successfully', () => {
      // System finds modal for creating issue and does next steps inside of it
      cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('.ql-editor').should('have.text', 'TEST_DESCRIPTION');

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      cy.get('input[name="title"]').should('have.value', 'TEST_TITLE');

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]').wait(1000).trigger('mouseover').trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible');

      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert that only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains('TEST_TITLE')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible')
        cy.get('[data-testid="icon:story"]').should('be.visible')
      })
  })
  
 it('Should validate title is required field if missing', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();
      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    })
 })
  it('Should create a Bug issue and validate it successfully', () => {
       //  Ensure Modal is visible 
       cy.get('[data-testid="modal:issue-create"]', { timeout: 60000 }).within(() => {
         
        //Type value to the description input field
        cy.get('.ql-editor').type('My bug description');
        cy.get('.ql-editor').should('have.text', 'My bug description')
      
            // type value to the title input field
         cy.get('input[name="title"]').type('Bug');
         cy.get('input[name="title"]').should('have.value','Bug')
      
      // Open issue type dropdown and choose Bug
       cy.get('[data-testid="select:type"]').click();
       cy.get('[data-testid="select-option:Bug"]').wait(10000).trigger('mouseover').trigger('click');
       cy.get('[data-testid="icon:bug"]').should('be.visible');

       //Set priority to the Highest
       cy.get('[data-testid="select:priority"]').click();
       cy.get('[data-testid="select-option:Highest"]').click()

       // select Pickle Rick as reporter
       cy.get('[data-testid="select:reporterId"]').click();
       cy.get('[data-testid="select-option:Pickle Rick"]').click();

       //  select Lord Gaben as assignee 
       cy.get('[data-testid="form-field:userIds"]').click();
       cy.get('[data-testid="select-option:Lord Gaben"]').click();

       // Click on button "Create issue button"
       cy.get('button[type="submit"]').click({ force: true });
      })
    // wait for modal to close
        cy.wait(5000)
      
    // Assert that modal window is closed and successful message is visible
      cy.log('Asserting the modal is closed and success message is visible')
      cy.get ('[data-testid="modal:issue-create"]').should('exist')
      cy.contains('Issue has been successfully created.', { timeout: 60000 }).should('be.visible')

    // Reload the page to see the recently created issue
       cy.reload()
       cy.contains('issue has been successfully created.').should('not.exist')
      
      // Assert that the issue is in the backlog list
       cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('Bug')
        .siblings()
        .within(() => {
         cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible')
         cy.get('[data-testid="icon:bug"]').should('be.visible')
        })  
      })
    })
  it('Should create a Task issue with random data and validate it successfully', () => {
     // Generate random title and description
      const randomTitle = faker.lorem.word(6)
     const randomDescription = faker.lorem.words(8)
    // Ensure modal is visible
     cy.get('[data-testid="modal:issue-create"]', { timeout: 60000 }).within(() => {
     //Fill in description
     cy.get('.ql-editor').type(randomDescription)
     cy.get('.ql-editor').should('have.text', randomDescription)

    // Fill in title
     cy.get('input[name="title"]').type(randomTitle)
     cy.get('input[name="title"]').should('have.value', randomTitle)
      
     // Check  that the issue type "Task" is already selected
     cy.get('[data-testid="select:type"]').should('have.text','Task')
     
      // Set the priority to Low
      cy.get('[data-testid="select:priority"]').click()
      cy.get('[data-testid="select-option:Low"]').click()

     // Select reporter as Baby Yoda
     cy.get('[data-testid="select:reporterId"]').click()
     cy.get('[data-testid="select-option:Baby Yoda"]').click()

     // Click on button "Create issue"
      cy.get('button[type="submit"]').click()
  });

  // Assert that modal window is closed and successful message is visible
  cy.get('[data-testid="modal:issue-create"]').should('not.exist')
  cy.contains('Issue has been successfully created.').should('be.visible')

  // Reload the page to see the recently created issue
  cy.reload();
  cy.contains('Issue has been successfully created.').should('not.exist')

  // Assert that the issue is in the backlog list
      cy.get('[data-testid="board-list:backlog"]')
      cy.get('[data-testid="list-issue"]')
        .should('contain', randomTitle)
        .should('be.visible')
    .and('have.length', '1')
    .within(() => {
   // Assert that this list contains 5 issues and first element with tag p has specified text

    cy.get('[data-testid="list-issue"]')
      .should('have.length', '5')
      .first()
      .find('p')
      .contains(randomTitle)
      .siblings()
      .within(() => {
      })
      // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(randomTitle)
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          })
        })
     })
})
     it('Should remove unnecessary spaces from issue title on the board', () => {
    const titleWithSpaces = '  Hello   world!  ' // Title with multiple spaces
    const expectedTitle = 'Hello world!';

    // Function to create an issue with the title containing extra spaces
    const createIssue = (title) => {
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('input[name="title"]').type(title);
        cy.get('button[type="submit"]').click();
      });
    };

    // Create an issue with the title containing extra spaces
    createIssue(titleWithSpaces)

     // Access the created issue title on the board
     cy.get('[data-testid="board-list:backlog"]').within(() => {
      // The newly created issue will be the first in the backlog
      cy.get('[data-testid="list-issue"]').first().invoke('text').then((actualTitle) => {
        // Log the actual title for debugging
        cy.log('Actual Title:', actualTitle);
        // Trim the actual title and compare with expected title
        expect(actualTitle.trim()).to.equal(expectedTitle);
        
      })
    })
  })
})