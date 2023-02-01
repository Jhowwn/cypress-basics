/// <reference types="cypress" />
import { buildEnv } from '../../support/buildEnv';
import '../../support/commandsContas';
import { locators } from '../../support/locators';

describe('Making tests at a functional level', () => {
  after(() => {
    cy.clearLocalStorage()
  })

  beforeEach(() => {
    buildEnv()
    cy.login('testfy', '1234')
  })

  it('Should test the responsiveness', () => {
    cy.get('[data-test=menu-home]').should('exist').and('be.visible')
    cy.viewport(500, 700)
    cy.get('[data-test=menu-home]').should('exist').and('be.not.visible')
    cy.viewport('iphone-5')
    cy.get('[data-test=menu-home]').should('exist').and('be.not.visible')
    cy.viewport('ipad-2')
    cy.get('[data-test=menu-home]').should('exist').and('be.visible')
  })

  it('Should create an account', () => {
    cy.intercept(
      { method: 'POST', url: 'contas' },
      { id: 8, nome: 'Conta de Teste', visible: true, usuario_id: 1 })

    cy.acessarMenuConta()

    cy.intercept({ method: 'GET', url: '/contas', }, [
      { id: 3, nome: 'Carteira', visible: true, usuario_id: 1 },
      { id: 5, nome: 'Carteira teste', visible: true, usuario_id: 1 },
      { id: 8, nome: 'Conta de Teste', visible: true, usuario_id: 1 }
    ]).as('contasSave')

    cy.inserirConta('Conta nova')
    cy.get(locators.MESSAGE).should('contain', 'Conta inserida com sucesso!')
  })

  it('Should update an account', () => {
    cy.intercept({ method: 'PUT', url: '/contas/**' },
      { id: 5, nome: 'Conta alterada', visible: true, usuario_id: 1 }
    ).as('contas')

    cy.acessarMenuConta()
    cy.xpath(locators.CONTAS.FN_XP_BTN_ALTERAR('Carteira teste')).click()
    cy.get(locators.CONTAS.NOME)
      .clear()
      .type('Conta alterada')
    cy.get(locators.CONTAS.BTN_SALVAR).click()
    cy.get(locators.MESSAGE).should('contain', 'Conta atualizada com sucesso!')
  })

  it('Should not create an account with same name', () => {
    cy.intercept(
      { method: 'POST', url: '/contas' },
      {
        "error": "Já existe uma conta com esse nome!",
        statusCode: 400
      }).as('saveContaMesmoNome')

    cy.acessarMenuConta()

    cy.get(locators.CONTAS.NOME).type('Conta mesmo nome')
    cy.get(locators.CONTAS.BTN_SALVAR).click()

    cy.get(locators.MESSAGE).should('contain', 'code 400')
  })

  it('Should create a transaction', () => {
    cy.intercept({ method: "POST", url: '/transacoes' }, {
      conta_id: 1574256, data_pagamento: "2023-01-31T03:00:00.000Z", data_transacao: "2023-01-31T03:00:00.000Z", descricao: "ad", envolvido: "asd", id: 1472150, status: true, tipo: "REC", usuario_id: 36229, valor: "123.00"
    })

    cy.intercept({ method: 'GET', url: '/extrato/**' }, { fixture: 'movimentacaoSalva' }).as('extrato')

    cy.get(locators.MENU.MOVIMENTACAO).click()
    cy.get(locators.MOVIMENTACAO.DESCRICAO).type('Desc')
    cy.get(locators.MOVIMENTACAO.VALOR).type(123)
    cy.get(locators.MOVIMENTACAO.INTERESSADO).type('Inter')
    cy.get(locators.MOVIMENTACAO.CONTA).select('Carteira')
    cy.get(locators.MOVIMENTACAO.STATUS).click()
    cy.get(locators.MOVIMENTACAO.BTN_SALVAR).click()

    cy.get(locators.MESSAGE).should('contain', 'sucesso')

    cy.get(locators.EXTRATO.LINHAS).should('have.length', 7)
    cy.xpath(locators.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')
  })

  it('Should get balance', () => {
    cy.intercept({ method: 'GET', url: '/transacoes/**' }, {
      "conta": "Conta para saldo",
      "conta_id": 1575209,
      "data_pagamento": "2023-02-01T03:00:00.000Z",
      "data_transacao": "2023-02-01T03:00:00.000Z",
      descricao: "Movimentacao 1, calculo saldo",
      envolvido: "CCC",
      id: 1472565,
      observacao: null,
      parcelamento_id: null,
      status: false,
      tipo: "REC",
      transferencia_id: null,
      usuario_id: 36229,
      valor: "3500.00",
    })
    cy.intercept({ method: 'PUT', url: '/transacoes/**' }, {
      "conta": "Conta para saldo",
      "conta_id": 1575209,
      "data_pagamento": "2023-02-01T03:00:00.000Z",
      "data_transacao": "2023-02-01T03:00:00.000Z",
      descricao: "Movimentacao 1, calculo saldo",
      envolvido: "CCC",
      id: 1472565,
      observacao: null,
      parcelamento_id: null,
      status: false,
      tipo: "REC",
      transferencia_id: null,
      usuario_id: 36229,
      valor: "3500.00",
    })
    // cy.intercept({ method: 'GET', url: '/extrato/**' }, { fixture: "movimentacaoSalva" })

    cy.get(locators.MENU.HOME).click()
    cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Conta teste')).should('contain', '150,00')

    cy.get(locators.MENU.EXTRATO).click()
    cy.xpath(locators.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click()
    cy.get(locators.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
    cy.get(locators.MOVIMENTACAO.STATUS).click()
    cy.get(locators.MOVIMENTACAO.BTN_SALVAR).click()

    cy.get(locators.MESSAGE).should('contain', 'sucesso')

    cy.intercept(
      { method: 'GET', url: '/saldo' },
      [{
        conta_id: 5000,
        conta: "Conta teste",
        saldo: "4034.00"
      },
      {
        conta_id: 15000,
        conta: "Conta Banco",
        saldo: "150000.00"
      }]).as("saldoFinal")

    cy.get(locators.MENU.HOME).click()
    cy.xpath(locators.SALDO.FN_XP_SALDO_CONTA('Conta teste')).should('contain', '4.034,00')
  })

  it('Should remova a transaction', () => {
    cy.intercept({ method: "DELETE", url: '/transacoes/**' }, {}, { statusCode: 204 }).as('delete')
    cy.get(locators.MENU.EXTRATO).click()
    cy.xpath(locators.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao para exclusao')).click()
    cy.get(locators.MESSAGE).should('contain', 'sucesso')
  })

  it('Should validate data send to create an account', () => {
    cy.intercept('POST', '/contas', (req) => {
      console.log(req)
      expect(req.body.nome).to.be.empty
      // expect(req.body.nome).to.be.not.empty
      expect(req.headers).to.be.have.property('authorization')
      req.reply({
        statusCode: 201,
        body: { id: 8, nome: 'Conta de Teste', visible: true, usuario_id: 1 }
      })
    }
    ).as('saveConta')

    cy.acessarMenuConta()

    cy.intercept({ method: 'GET', url: '/contas', }, [
      { id: 3, nome: 'Carteira', visible: true, usuario_id: 1 },
      { id: 5, nome: 'Carteira teste', visible: true, usuario_id: 1 },
      { id: 8, nome: 'Conta de Teste', visible: true, usuario_id: 1 }
    ]).as('contasSave')

    cy.inserirConta('{control}')
    // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')

    cy.get(locators.MESSAGE).should('contain', 'Conta inserida com sucesso!')
  })

  it('Should test colors', () => {
    cy.intercept({ method: 'GET', url: '/extrato/**' }).as('extrato')
    cy.get(locators.MENU.EXTRATO).click()

    cy.xpath(locators.EXTRATO.FN_XP_LINHA('Receita paga')).should('have.class', 'receitaPaga')
    cy.xpath(locators.EXTRATO.FN_XP_LINHA('Receita pendente')).should('have.class', 'receitaPendente')
    cy.xpath(locators.EXTRATO.FN_XP_LINHA('Despesa paga')).should('have.class', 'despesaPaga')
    cy.xpath(locators.EXTRATO.FN_XP_LINHA('Despesa pendente')).should('have.class', 'despesaPendente')
  })
})