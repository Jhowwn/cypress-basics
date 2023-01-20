/// <reference types="cypress" />
describe('Working with Iframe', () => {
  it('Deve preencher campo de texto', () => {
    cy.visit('https://wcaquino.me/cypress/componentes.html');
    cy.get('#frame1').then(iframe => {
      const body = iframe.contents().find('body')
      cy.wrap(body).find('#tfield')
        .type('teste')
        .should('have.value', 'teste')
    })
  })
  it('Deve testar frame diretamente', () => {
    cy.visit('https://wcaquino.me/cypress/frame.html');
    cy.get('#otherButton').click()
    cy.on('window:alert', msg => {
      console.log(msg)
      expect(msg).to.be.equal('Click OK!')
    })
  })
})