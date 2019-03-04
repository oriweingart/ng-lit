import Nightmare from "nightmare";
import { deepStrictEqual } from 'assert';
import { init, COMMANDS } from '../utils';

const { GET_NG_LIT_ELM } = COMMANDS;

let nightmare = null;
describe('no angular', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit draw without angular', async () => {
    const items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items,  'items in ng-lit: null and name: John');
  });

});
