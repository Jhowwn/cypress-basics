/// <reference types="cypress" />

const dayjs = require('dayjs')

describe('Making tests at a functional level', () => {
  before(() => {
    cy.getToken('testfy', '123')
  })

  beforeEach(() => {
    cy.resetRest('testfy', '123')
  })

  it('Should create an account', () => {
    cy.request({
      method: 'POST',
      url: '/contas',
      body: {
        nome: 'Conta via rest'
      }
    }).as('response')

    cy.get('@response').then(res => {
      expect(res.status).to.be.equal(201)
      expect(res.body).to.have.property('id')
      expect(res.body).to.have.property('nome', 'Conta via rest')
    })
  })

  it('Should update an account', () => {
    cy.getContaByName('testfy', '123', 'Conta para movimentacoes')
      .then(contaId => {
        cy.request({
          url: `/contas/${contaId}`,
          method: 'PUT',
          body: {
            nome: 'Conta alterada via rest'
          }
        }).as('response')
      })

    cy.get('@response').its('status').should('be.equal', 200)
  })

  it('Should not create an account with same name', () => {
    cy.request({
      method: 'POST',
      url: '/contas',
      body: {
        nome: 'Conta mesmo nome'
      },
      failOnStatusCode: false
    }).as('response')

    cy.get('@response').then(res => {
      expect(res.status).to.be.equal(400)
      expect(res.body.error).to.have.equal('Já existe uma conta com esse nome!')
    })
  })

  it('Should create a transaction', () => {
    cy.getContaByName('testfy', '123', 'Conta para movimentacoes')
      .then(contaId => {
        cy.request({
          method: 'POST',
          url: '/transacoes',
          body: {
            conta_id: contaId,
            data_pagamento: dayjs().add(1, 'day').format('DD/MM/YYYY'),
            data_transacao: dayjs().format('DD/MM/YYYY'),
            descricao: "desc",
            envolvido: "inter",
            status: true,
            tipo: "REC",
            valor: "123"
          }
        }).as('response')
      })
    cy.get("@response").its('status').should('be.equal', 201)
    cy.get("@response").its('body.id').should('exist')
  })

  it('Should get balance', () => {
    cy.request({
      url: '/saldo',
      method: 'GET',
    }).then(res => {
      let saldoConta = null
      res.body.forEach(c => {
        if (c.conta === 'Conta para saldo') saldoConta = c.saldo
      })
      expect(saldoConta).to.be.equal('534.00')
    })

    cy.request({
      method: 'GET',
      url: '/transacoes',
      qs: { descricao: 'Movimentacao 1, calculo saldo' }
    }).then(res => {
      cy.request({
        url: `/transacoes/${res.body[0].id}`,
        method: 'PUT',
        body: {
          status: true,
          data_transacao: dayjs(res.body[0].data_transacao).format('DD/MM/YYYY'),
          data_pagamento: dayjs(res.body[0].data_pagamento).format('DD/MM/YYYY'),
          descricao: res.body[0].descricao,
          envolvido: res.body[0].envolvido,
          valor: res.body[0].valor,
          conta_id: res.body[0].conta_id,
        }
      }).its('status').should('be.equal', 200)
    })

    cy.request({
      url: '/saldo',
      method: 'GET',
    }).then(res => {
      let saldoConta = null
      res.body.forEach(c => {
        if (c.conta === 'Conta para saldo') saldoConta = c.saldo
      })
      expect(saldoConta).to.be.equal('4034.00')
    })
  })

  it('Should remova a transaction', () => {
    cy.request({
      method: 'GET',
      url: '/transacoes',
      qs: { descricao: 'Movimentacao para exclusao' }
    }).then(res => {
      cy.request({
        url: `/transacoes/${res.body[0].id}`,
        method: 'DELETE',
      }).its('status').should('be.equal', 204)
    })
  })
})