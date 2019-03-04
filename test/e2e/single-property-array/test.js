import Nightmare from "nightmare";
import { deepStrictEqual } from 'assert';
import { init, COMMANDS } from '../utils';

const { GET_NG_LIT_ELM, GET_NG_ELM } = COMMANDS;

let nightmare = null;
describe('single array property', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate angular draw the items', async () => {
    const items = await nightmare.evaluate(...GET_NG_ELM).end();
    deepStrictEqual(items, 'items in angular: ["dog","laptop","beer"]');
  });

  it('should validate ng-lit draw the items', async () => {
    const items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items,  'items in ng-lit: ["dog","laptop","beer"]');
  });

});
