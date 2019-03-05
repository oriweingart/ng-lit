import Nightmare from "nightmare";
import { deepStrictEqual } from 'assert';
import { init, COMMANDS } from '../utils';

const { GET_NG_ELM, GET_NG_LIT_ELM } = COMMANDS;

let nightmare = null;
describe('multiple properties with default values', async function () {

  this.timeout('60s');
  beforeEach(async () => {
    nightmare = new Nightmare();
    await init(nightmare, __dirname);
  });

  it('should validate ng-lit draw the items and user name with default values', async () => {
    const items = await nightmare.evaluate(...GET_NG_LIT_ELM).end();
    deepStrictEqual(items, 'user name and items in ng-lit: Default First Name Default Last Name ["dog","laptop","beer"]');
  });

});
