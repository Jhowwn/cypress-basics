/// <reference types="cypress" />
describe('Cypress basic', () => {
  it.only('Should visit a page and assert title', () => {
    cy.viewport(1440, 900)
    cy.visit('https://wcaquino.me/cypress/componentes.html');

    // cy.pause() Pausa a execução e realiza passo a passo;

    cy.title().should('be.equal', 'Campo de Treinamento')
    cy.title().should('contain', 'Campo')
    // cy.title().should('contain', 'Campo').debug() Gera um log para ajudar no debug da aplixação

    cy.title()
      .should('be.equal', 'Campo de Treinamento')
      .and('contain', 'Campo')

    let syncTitle;
    cy.title().then(title => {
      console.log(title)
      cy.get('#formNome').type(title)

      syncTitle = title;
    })
    cy.get('[data-cy="dataSobrenome"]').then($el => {
      $el.val(syncTitle)
    })

    cy.get('#elementosForm\\:sugestoes').then($el => {
      cy.wrap($el).type(syncTitle)
    })
  })

  it("Should find and interact with an element", () => {
    cy.visit('https://wcaquino.me/cypress/componentes.html');

    cy.get('#buttonSimple')
      .click()
      .should('have.value', 'Obrigado!')
  })
})