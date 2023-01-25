/// <reference types="cypress" />
describe('Dinamics tests', () => {
  beforeEach(() => {
    cy.visit('https://wcaquino.me/cypress/componentes.html');
  })

  beforeEach(() => {
    cy.reload()
  })

  const foods = ["Carne", "Frango", "Pizza", "Vegetariano"]
  foods.forEach(food => {
    it(`Cadastro com a comida ${food}`, function () {
      cy.fixture('userData').as('usuario').then(() => {
        cy.get('#formNome').type('usuario')
        cy.get('#formSobrenome').type('sobrenome')
        cy.get(`[name=formSexo][value=F]`).click()
        cy.xpath(`//label[contains(., '${food}')]/preceding-sibling::input`).click()
        cy.get('#formEscolaridade').select('Doutorado')
        cy.get('#formEsportes').select('Corrida')

        cy.get('#formCadastrar').click()
        cy.get('#resultado > :nth-child(1)').should('contain.text', 'Cadastrado!')
      })
    })
  })

  it.only('Deve selecionar todos usando o each', () => {
    cy.fixture('userData').as('usuario').then(() => {
      cy.get('#formNome').type('usuario')
      cy.get('#formSobrenome').type('sobrenome')
      cy.get(`[name=formSexo][value=F]`).click()
      cy.get('[name=formComidaFavorita]').each($el => {
        // $el.click()
        if ($el.val() !== 'vegetariano') {
          cy.wrap($el).click()
        }
      })
      cy.get('#formEscolaridade').select('Doutorado')
      cy.get('#formEsportes').select('Corrida')

      cy.get('#formCadastrar').click()
      cy.get('#resultado > :nth-child(1)').should('contain.text', 'Cadastrado!')
      // cy.clickAlert('#formCadastrar', 'Tem certeza que voce eh vegetariano?')
    })
  })
})