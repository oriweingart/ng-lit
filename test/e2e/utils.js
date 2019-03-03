/* eslint-disable no-shadow */
const CONFIG = {
  URL: 'http://127.0.0.1:8081',
  PATH: 'test/e2e',
  FIXTURE: 'fixture.html',
  WAIT: 3000
}

const NG_LIT_ELM = '#ng-lit-element';
const NG_ELM = '#ng-element';
const COMMANDS = {
  GET_NG_ELM: [NG_ELM => document.querySelector(NG_ELM).innerText, NG_ELM],
  GET_NG_LIT_ELM: [NG_LIT_ELM => document.querySelector(NG_LIT_ELM).shadowRoot.children[0].innerText, NG_LIT_ELM],
  CLICK_REMOVE_ITEM_IN_NG_LIT: [(NG_LIT_ELM, index) => document.querySelector(NG_LIT_ELM).shadowRoot.querySelector(`div > button:nth-child(${index})`).click(), NG_LIT_ELM],
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const init = async (nightmare, testFolder) => {
  const testName = testFolder.split("/")[testFolder.split("/").length-1];
  const url = `${CONFIG.URL}/${CONFIG.PATH}/${testName}/${CONFIG.FIXTURE}`;
  await nightmare.goto(url).wait(CONFIG.WAIT);
  await sleep(5000);
}

module.exports = {
  init,
  NG_LIT_ELM,
  NG_ELM,
  COMMANDS
};
