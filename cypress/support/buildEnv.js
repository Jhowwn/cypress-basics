export const buildEnv = () => {
  cy.intercept({
    method: 'POST',
    url: '/signin',
  },
    {
      id: 5000,
      nome: "notestfy",
      token: "dkfamkmgkafkre gvjsac mfdekfmkvma"
    }
  ).as('signin')

  cy.intercept(
    { method: 'GET', url: '/saldo' },
    [{
      conta_id: 5000,
      conta: "Conta teste",
      saldo: "150.000"
    },
    {
      conta_id: 15000,
      conta: "Conta Banco",
      saldo: "1500000000.00"
    }]).as("saldo")

  cy.intercept({ method: 'GET', url: '/contas' }, [
    { id: 3, nome: 'Carteira', visible: true, usuario_id: 1 },
    { id: 5, nome: 'Carteira teste', visible: true, usuario_id: 1 }
  ]).as('contas')

  cy.intercept({ method: 'GET', url: '/extrato/**' },
    { fixture: "movimentacaoSalva" }).as('extrato')
}