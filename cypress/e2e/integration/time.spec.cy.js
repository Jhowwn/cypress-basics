/// <reference types="cypress" />
describe('Time tests', () => {
  beforeEach(() => {
    cy.visit('https://wcaquino.me/cypress/componentes.html');
  })

  beforeEach(() => {
    cy.reload()
  })

  it('"Going back to the past', () => {
    // cy.get('#buttonNow').click()
    // cy.get('#resultado > span').should('contain', '24/01/2023')

    // cy.clock() //Serve para gerar uma data 
    // cy.get('#buttonNow').click()
    // cy.get('#resultado > span').should('contain', '31/12/1969')

    const dt = new Date(2012, 3, 10, 15, 23, 50)
    cy.clock(dt.getTime())
    cy.get('#buttonNow').click()
    cy.get('#resultado > span').should('contain', '10/04/2012')
  })

  it.only("Goes to the future", () => {
    cy.get('#buttonTimePassed').click()
    cy.get('#resultado > span').should('contain', '1674')
    cy.get('#resultado > span').invoke('text').then(t => {
      const number = parseInt(t)
      cy.wrap(number).should('gt', 1674587636781)
    })

    cy.clock()
    cy.get('#buttonTimePassed').click()
    cy.get('#resultado > span').invoke('text').then(t => {
      const number = parseInt(t)
      cy.wrap(number).should('lte', 0)
    })

    // cy.wait(1000)
    // cy.get('#buttonTimePassed').click()
    // cy.get('#resultado > span').invoke('text').then(t => {
    //   const number = parseInt(t)
    //   cy.wrap(number).should('lte', 1000)
    // })

    cy.tick(1000)
    cy.get('#buttonTimePassed').click()
    cy.get('#resultado > span').invoke('text').then(t => {
      const number = parseInt(t)
      cy.wrap(number).should('gte', 1000)
    })
  })
})