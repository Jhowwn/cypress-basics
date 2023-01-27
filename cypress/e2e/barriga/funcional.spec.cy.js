/// <reference types="cypress" />
import { locators } from '../../support/locators';

describe('Making tests at a functional level', () => {
  before(() => {
    cy.login('testfy', '123')
    cy.resetApp()
  })

  // beforeEach(() => {
  //   cy.reload()
  // })

  it('Should create an account', () => {
    cy.get(locators.MENU.SETTINGS).click()
    cy.get(locators.MENU.CONTAS).click()
    cy.get(locators.CONTAS.NOME).type('Conta nova')
    cy.get(locators.CONTAS.BTN_SALVAR).click()
    cy.get(locators.MESSAGE).should('contain', 'Conta inserida com sucesso!')
  })

  it.only('Should update an account', () => {
    cy.get(locators.MENU.SETTINGS).click()
    cy.get(locators.MENU.CONTAS).click()
    cy.xpath(locators.CONTAS.XP_BTN_ALTERAR).click()
    cy.get(locators.CONTAS.NOME)
      .clear()
      .type('Conta alterada')
    cy.get(locators.CONTAS.BTN_SALVAR).click()
    cy.get(locators.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
  })
})