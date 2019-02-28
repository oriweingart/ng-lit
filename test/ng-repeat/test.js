const Nightmare = require('nightmare');
const {
  deepStrictEqual
} = require('assert');
const {
  init,
  NG_LIT_ELM,
  COMMANDS :{ GET_NG_ELM, GET_NG_LIT_ELM }
} = require('../utils');

let nightmare = null;
describe('ng-repeat directive', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit draw all items within ng-repeat loop', async () => {
    let NG_LIT_ELM_WITH_ID = `${NG_LIT_ELM}-0`;
    let userName = await nightmare.evaluate(NG_LIT_ELM_WITH_ID => document.querySelector(NG_LIT_ELM_WITH_ID).shadowRoot.children[0].innerText, NG_LIT_ELM_WITH_ID);
    deepStrictEqual(userName, "user name in ng-lit: Freddy krueger");

    NG_LIT_ELM_WITH_ID = `${NG_LIT_ELM}-1`;
    userName = await nightmare.evaluate(NG_LIT_ELM_WITH_ID => document.querySelector(NG_LIT_ELM_WITH_ID).shadowRoot.children[0].innerText, NG_LIT_ELM_WITH_ID);
    deepStrictEqual(userName, "user name in ng-lit: Jason Voorhees");

    NG_LIT_ELM_WITH_ID = `${NG_LIT_ELM}-2`;
    userName = await nightmare.evaluate(NG_LIT_ELM_WITH_ID => document.querySelector(NG_LIT_ELM_WITH_ID).shadowRoot.children[0].innerText, NG_LIT_ELM_WITH_ID).end();
    deepStrictEqual(userName, "user name in ng-lit: Michael Myers");
  });


});
