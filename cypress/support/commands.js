// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { locators } from './locators'

Cypress.Commands.add('clickAlert', (locator, message) => {
  cy.get(locator).click()
  cy.on('window:alert', msg => {
    expect(msg).to.be.equal(message)
  })
})

Cypress.Commands.add('login', (user, password) => {
  cy.visit('https://barrigareact.wcaquino.me/');
  cy.get(locators.LOGIN.USER).type(user)
  cy.get(locators.LOGIN.PASSWORD).type(password)
  cy.get(locators.LOGIN.BTN).click()
  cy.get(locators.MESSAGE).should('contain', 'Bem vindo, testfy')
})

Cypress.Commands.add('resetApp', () => {
  cy.get(locators.MENU.SETTINGS).click()
  cy.get(locators.MENU.RESET).click()
})

Cypress.Commands.add('getToken', (user, password) => {
  cy.request({
    method: 'POST',
    url: '/signin',
    body: {
      email: user,
      redirecionar: false,
      senha: password,
    }
  }).its('body.token').should('not.be.empty')
    .then(token => {
      Cypress.env('token', token)
      return token
    })
})

Cypress.Commands.add('resetRest', (email, password) => {
  cy.getToken(email, password).then(token => {
    cy.request({
      method: 'GET',
      url: '/reset',
      headers: {
        Authorization: `JWT ${token}`
      },
    }).its('status').should('be.equal', 200)
  })
})

Cypress.Commands.add('getContaByName', (email, password, name) => {
  cy.getToken(email, password).then(token => {
    cy.request({
      method: 'GET',
      url: '/contas',
      headers: { Authorization: `JWT ${token}` },
      qs: {
        nome: name
      }
    }).then(res => {
      return res.body[0].id
    })
  })
})

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
  if (options.length === 1) {
    if (Cypress.env('token')) {
      options[0].headers = {
        Authorization: `JWT ${Cypress.env('token')}`
      }
    }
  }

  return originalFn(...options)
})