import { locators } from './locators'

Cypress.Commands.add('acessarMenuConta', () => {
  cy.get(locators.MENU.SETTINGS).click()
  cy.get(locators.MENU.CONTAS).click()
})

Cypress.Commands.add('inserirConta', conta => {
  cy.get(locators.CONTAS.NOME).type(conta)
  cy.get(locators.CONTAS.BTN_SALVAR).click()
})