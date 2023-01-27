export const locators = {
  LOGIN: {
    USER: '[data-test="email"]',
    PASSWORD: '[data-test="passwd"]',
    BTN: '.btn'
  },
  MENU: {
    SETTINGS: '[data-test="menu-settings"]',
    CONTAS: '[href="/contas"]',
    RESET: '[href="/reset"]'
  },
  CONTAS: {
    NOME: '[href="/contas"]',
    BTN_SALVAR: '.btn',
    XP_BTN_ALTERAR: "//table//td[contains(., 'Conta nova')]/..//i[@class='far fa-edit']"
  },
  MESSAGE: '.toast-message',
}
