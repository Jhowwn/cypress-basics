/// <reference types="cypress" />
describe('Working with sync', () => {
  // before(() => {
  //   cy.visit('https://wcaquino.me/cypress/componentes.html');
  // })

  beforeEach(() => {
    cy.visit('https://wcaquino.me/cypress/componentes.html');
  })

  beforeEach(() => {
    cy.reload()
  })

  it('Deve aguardar elemento estar disponivel', () => {
    cy.get('#novoCampo').should('not.exist')

    cy.get('#buttonDelay').click()
    cy.get('#novoCampo').should('not.exist')
    cy.get('#novoCampo').should('exist')
    cy.get('#novoCampo').type('funcionou')
  })

  it('Deve fazer retrys', () => {
    cy.get('#buttonDelay').click()
    cy.get('#novoCampo')
      // .should('not.exist')
      .should('exist')
      .type('funcionou')
  })

  it('Uso do find', () => {
    //Sucesso com button list
    cy.get('#buttonList').click()
    cy.get('#lista li')
      .find('span')
      .should('contain', 'Item 1')
    cy.get('#lista li span')
      .should('contain', 'Item 2')

    // cy.get('#buttonListDOM').click()
    // cy.get('#lista li')
    // .find('span')
    // .should('contain', 'Item 1')
    // cy.get('#lista li')
    // .find('span')
    // .should('contain', 'Item 2')
  })

  it('Uso do timeout', () => {
    // cy.get('#buttonDelay').click()
    // cy.get('#novoCampo').should('exist') 

    // cy.get('#buttonList').click()
    // cy.get('#lista li')
    //   .find('span')
    //   .should('contain', 'Item 1')
    // // cy.wait(5000) Evitar de usar
    // cy.get('#lista li span', {timeout: 30000})
    //   .should('contain', 'Item 2')

    cy.get('#buttonList').click()
    cy.get('#lista li span')
      .should('have.length', 1)
    cy.get('#lista li span')
      .should('have.length', 2)
  })

  it('Click Retry', () => {
    cy.get('#buttonCount')
      .click()
      .click()
      .should('have.value', 111)
  })

  it.only('Should x then', () => {
    cy.get('#buttonListDOM').then($el => {
      // console.log($el)
      expect($el).to.have.length(1)
      cy.get('#buttonList')
    })
  })
})