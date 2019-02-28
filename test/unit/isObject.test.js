import { isObject } from "../../watchers";
import assert from 'assert';

describe('isObect', () => {

  it('should return true for object', () => {
    assert(isObject({}) == true);
    assert(isObject({a:'a'}) == true);
    assert(isObject( new Object()) == true);
  });

  it('should return false for none object', () => {
    assert(isObject() == false);
    assert(isObject(null) == false);
    assert(isObject(undefined) == false);
    assert(isObject(NaN) == false);
    assert(isObject(1) == false);
    assert(isObject(2) == false);
    assert(isObject(2.1) == false);
    assert(isObject('2.1') == false);
    assert(isObject([]) == false);
    assert(isObject([{}]) == false);
    assert(isObject(()=>{}) == false);
  });

});
