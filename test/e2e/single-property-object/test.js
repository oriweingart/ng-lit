import Nightmare from "nightmare";
import { deepStrictEqual } from 'assert';
import { init, COMMANDS } from '../utils';

const { GET_NG_LIT_ELM, GET_NG_ELM } = COMMANDS;

let nightmare = null;
describe('single object property', async function() {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the user name', async () => {
    const userName = await nightmare.evaluate(...GET_NG_ELM).end();
    deepStrictEqual(userName, "user name in angular: John Doe");
  });

  it('should validate ng-lit draw the user name', async () => {
    const userName = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(userName, "user name in ng-lit: John Doe");
  });

});
