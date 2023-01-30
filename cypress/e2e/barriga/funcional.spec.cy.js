/// <reference types="cypress" />
import '../../support/commandsContas';
import { locators } from '../../support/locators';

describe('Making tests at a functional level', () => {
  beforeEach(() => {
    cy.login('testfy', '123')
    cy.resetApp()
  })

  it('Should create an account', () => {
    cy.acessarMenuConta()
    cy.inserirConta('Conta nova')
    cy.get(locators.MESSAGE).should('contain', 'Conta inserida com sucesso!')
  })

  it('Should update an account', () => {
    cy.acessarMenuConta()
    cy.xpath(locators.CONTAS.FN_XP_BTN_ALTERAR('Conta para alterar')).click()
    cy.get(locators.CONTAS.NOME)
      .clear()
      .type('Conta alterada')
    cy.get(locators.CONTAS.BTN_SALVAR).click()
    cy.get(locators.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
  })

  it('Should not create an account with same name', () => {
    cy.acessarMenuConta()

    cy.get(locators.CONTAS.NOME).type('Conta mesmo nome')
    cy.get(locators.CONTAS.BTN_SALVAR).click()

    cy.get(locators.MESSAGE).should('contain', 'code 400')
  })

  it('Should create a transaction', () => {
    cy.get(locators.MENU.MOVIMENTACAO).click()
    cy.get(locators.MOVIMENTACAO.DESCRICAO).type('Desc')
    cy.get(locators.MOVIMENTACAO.VALOR).type(123)
    cy.get(locators.MOVIMENTACAO.INTERESSADO).type('Inter')
    cy.get(locators.MOVIMENTACAO.CONTA).select('Conta para movimentacoes')
    cy.get(locators.MOVIMENTACAO.STATUS).click()
    cy.get(locators.MOVIMENTACAO.BTN_SALVAR).click()

    cy.get(locators.MESSAGE).should('contain', 'sucesso')

    cy.get(locators.EXTRATO.LINHAS).should('have.length', 7)
    cy.xpath(locators.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')
  })

  it.only('Should get balance', () => {
    cy.get(locators.MENU.HOME).click()
    cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '534,00')

    cy.get(locators.MENU.EXTRATO).click()
    cy.xpath(locators.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
    cy.get(locators.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
    cy.get(locators.MOVIMENTACAO.STATUS).click()
    cy.get(locators.MOVIMENTACAO.BTN_SALVAR).click()

    cy.wait(1000)
    cy.get(locators.MESSAGE).should('contain', 'sucesso')

    cy.get(locators.MENU.HOME).click()
    cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Conta para saldo')).should('contain', '4.034,00')
  })

  it('Should remova a transaction', () => {
    cy.get(locators.MENU.EXTRATO).click()
    cy.xpath(locators.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
    cy.get(locators.MESSAGE).should('contain', 'sucesso')
  })
})