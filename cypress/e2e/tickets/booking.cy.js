function addToDate(days, locale) {
  /**
   * Add days and return a string suitable for the test
   **/
  let theDate = new Date()
  theDate.setDate(theDate.getUTCDate() + days)
  // Localize month!
  let theMonth = theDate.toLocaleString(locale, { month: "long" })
  // Work around a bug in the website requiring the first letter of the month to be capitalized
  theMonth = theMonth.charAt(0).toUpperCase() + theMonth.slice(1)
  let theYear = theDate.getUTCFullYear()

  return `${theDate.getUTCDate()} ${theMonth}, ${theYear}`
}

describe('Describe the spec', () => {
  it('Describe the spec', () => {
    cy.log(Cypress.spec)
  })
})

describe('Sanity check fixture data', () => {
  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      Cypress.stop()
      return
    }
  })
  it('Check that the date we try to book from/to is within 2 months', () => {
    // Restriction in API: Check that we are within two months of the start and finishing date
    var checkDate = (days, maxMonthsInFuture) => {
      let nowDate = new Date()
      let maxDate = new Date(nowDate)
      maxDate.setUTCDate(nowDate.getUTCDate() + days)
      // diff in year between dates (e.g. Dec->Jan) times 12 - diff between now
      // date and the maximum date must be less than or equal to two
      const errorMessage = `You can at most select a date that is ${maxMonthsInFuture} months in the future`
      if (12 * (maxDate.getUTCFullYear() - nowDate.getUTCFullYear()) + maxDate.getMonth() - nowDate.getMonth() > maxMonthsInFuture) {
        return `Error: ${errorMessage}`
      }

      return 'OK'
    }

    cy.fixture('tickets').then((tickets) => {
      expect(
        checkDate(tickets.outboundDaysFromNow,
          tickets.maxMonthsInFutureAllowed), 'Check outbound trip').to.equal('OK')
      expect(checkDate(tickets.returnDateDaysFromNow,
        tickets.maxMonthsInFutureAllowed), 'Check return trip').to.equal('OK')
    }
    )
  })

})

describe('Ticket buying tests', () => {
  beforeEach(() => {
    cy.fixture('tickets').as('tickets')
    cy.get('@tickets').then((tickets) => {
      // This is flaky. The server sometimes responds with something other than a `text/html` content which cause
      // the tests to fail
      // TODO: Can we loop here to retry the connection? 
      cy.visit(tickets.ticketUrl[tickets.locale])
    })
  })

  it('Ticket selection abort', () => {
    cy.get('@tickets').then((tickets) => {
      // Convenience function to check value, can be broken out if more tests are added
      let isValueEqual = (alias, equalsString) => {
        cy.get(alias).invoke('val').should('be.equal',
          equalsString)
      }
      // The expected format for the date box is D MM, YYYY
      cy.log('Navigating to page')

      let departDateString = addToDate(tickets.outboundDaysFromNow, tickets.locale)
      let returnDateString = addToDate(tickets.returnDateDaysFromNow, tickets.locale)

      // Alias the fields we are working with
      cy.get('[name="textBoxPartida"]').as('textBoxDeparture')
      cy.get('[name="textBoxChegada"]').as('textBoxReturn')
      cy.get('[name="returnDate"]').as('returnDate')
      cy.get('[name="departDate"]').as('departDate')


      // Wait for the elements to show
      // Start backwards, since there's functionality to change the date back so
      // you don't get a "reverse" trip, where the inbound journey date happens
      // *before* the outbound one
      cy.get('#searchTimetableForm').within(() => {
        // This is inside the select journey form

        // FIXME: Fill in the return date first, seems to be a bug on the page
        // so that if you don't do this, the return date won't take.
        cy.get('@returnDate').clear().type(returnDateString)
        cy.get('@departDate').clear().type(departDateString)

        cy.get('@textBoxDeparture').clear().type(tickets.departStation)
        cy.get('@textBoxReturn').clear().type(tickets.destinationStation)

        // Is the submit enabled?
        cy.get('input[type="submit"]').should('not.be.disabled')

        // Submit the form
        cy.root().submit()
      })

      // Are we at the ticket selection page?
      cy.origin(tickets.ticketSelectionUrl, {
        args: {
          urlSubstring:
            tickets.ticketSelectionUrlSubstring
        }
      },
        ({ urlSubstring }) => {
          cy.url().should('include', urlSubstring)
          cy.get("#exitButton").click()
        })

      // Set up what happens after we return to the trip selection (after pressing cancel)
      // Validate that the input was saved
      cy.get('#searchTimetableForm').within(() => {
        cy.url().should('include', tickets.ticketUrl[tickets.locale])
        isValueEqual('@returnDate', returnDateString)
        isValueEqual('@departDate', departDateString)
        isValueEqual('@textBoxDeparture', tickets.departStation)
        isValueEqual('@textBoxReturn', tickets.destinationStation)
      })
    })
  })
})

