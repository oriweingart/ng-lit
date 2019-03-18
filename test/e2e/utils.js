/* eslint-disable no-shadow */
import Nightmare from "nightmare";

export const CONFIG = {
  URL: 'http://127.0.0.1:8081',
  PATH: 'test/e2e',
  FIXTURE: 'fixture.html',
  WAIT: 3000
};

const sleepIt = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Register common actions
Nightmare.action('getNgElement', function(done) {
  this.evaluate_now(() => document.querySelector('#ng-element').innerText, done);
});
Nightmare.action('getNgLitElement', function(done) {
  this.evaluate_now(() => document.querySelector('#ng-lit-element').shadowRoot.children[0].innerText, done);
});
Nightmare.action('getNgLitElementWithId', function(index, done) {
  this.evaluate_now((index) => document.querySelector(`#ng-lit-element-${index}`).shadowRoot.children[0].innerText, done, index);
});
Nightmare.action('removeItemInNgLit', function(index, done) {
  this.evaluate_now((index) => document.querySelector('#ng-lit-element').shadowRoot.querySelector(`div > button:nth-child(${index})`).click(), done, index);
});

export const NgNightmare = Nightmare;

export const init = async (nightmare, testFolder, { sleep, wait } = {}) => {
  const testName = testFolder.split("/")[testFolder.split("/").length-1];
  const url = `${CONFIG.URL}/${CONFIG.PATH}/${testName}/${CONFIG.FIXTURE}`;
  await nightmare.goto(url).wait(wait || CONFIG.WAIT);
  await sleepIt(sleep || 5000);
  return nightmare;
};

export const removeWhiteSpaces = (s = '') => s.replace(/ /g,'');
