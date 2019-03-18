/* eslint-disable no-param-reassign,array-callback-return */
export const { isArray } = Array;

/**
 * Return true if object
 * @param obj
 * @returns {boolean}
 */
export const isObject = obj => (typeof obj === "object" && obj !== null && typeof obj !== "function" && !isArray(obj));
/**
 * Return true if a key object is the original value (__ngWatch<keyName>)
 * @param value
 * @returns {boolean|*}
 */
export const isOriginalObjectKey = value => (value && value.startsWith && value.startsWith('__ngWatch')) || value === '__litElms__';
/**
 * Negation isOriginalObjectKey
 * @param value
 * @returns {boolean}
 */
export const isNotOriginalObjectKey = value => !isOriginalObjectKey(value);

/**
 * Mixing that run lit-element's requestUpdate() when a prop is changed on the object
 * @param obj
 * @param litElm
 */

// Check reflect API
export const objectWatcherMixing = (obj, litElm, ngScope) => {
  obj.__litElms__ = obj.__litElms__ || [];
  obj.__litElms__.push(litElm);
  Object.keys(obj).filter(isNotOriginalObjectKey).map(
    prop => {
      const value = obj[prop];
      delete obj[prop];
      Object.defineProperty(obj, `__ngWatch${prop}`, {
        value,
        writable: true,
        enumerable: false
      });
      Object.defineProperty(obj, prop, {
        get () {
          return obj[`__ngWatch${prop}`];
        },
        set (val) {
          obj[`__ngWatch${prop}`] = val;
          obj.__litElms__.map(
            theElm => theElm.requestUpdate()
          );
          ngScope.$applyAsync();
        }
      });
    }
  );
};
/**
 * Mixing that run lit-element's requestUpdate() when an array was changed
 * @param arr
 * @param elm
 */
// check for proxies to array
export const ARRAY_MUTATIONS = ['fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'];

export const arrayWatcherMixing = (arr, litElm, ngScope) => {
  arr.__litElms__ = arr.__litElms__ || [];
  arr.__litElms__.push(litElm);
  ARRAY_MUTATIONS.map(
    mutationName => {
      arr[mutationName] = function (...args) {
        Array.prototype[mutationName].apply(this, args);
        arr.__litElms__.map(
          litElmWatched => litElmWatched.requestUpdate()
        );
        ngScope.$applyAsync();
      };
    }
  );
};


/**
 * Return true if ng prop need to be watched for changes
 * @param ngPropOptions
 */
export const shouldWatchNgProp = ngPropOptions => ngPropOptions.watch && !ngPropOptions.__ngWatcher__;


/**
 * Watch the props if needed
 * @param ngPropOptions
 * @param litElm
 * @param ngScope
 */
export const watchLitIfNeeded = (ngPropOptions, litElm, ngScope, ngValue) => {
  if (shouldWatchNgProp(ngPropOptions)) {
    // Array
    if (isArray(ngValue)) {
      ngPropOptions.__ngWatcher__ = 'array';
      arrayWatcherMixing(ngValue, litElm, ngScope);
    }
    // Object
    if (isObject(ngValue)) {
      ngPropOptions.__ngWatcher__ = 'object';
      objectWatcherMixing(ngValue, litElm, ngScope);
    }
  }
};
