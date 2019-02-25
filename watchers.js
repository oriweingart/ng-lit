/**
 * Mixing that run lit-element's requestUpdate() when a prop is changed on the object
 * @param obj
 * @param elm
 */
const objectWatcherMixing = (obj, elm, scope) => {
  obj.__litElms = obj.__litElms || [];
  obj.__litElms.push(elm);
  Object.keys(obj).filter(key=>!key.startsWith('__')).map(
    prop => {
      let value = obj[prop];
      delete obj[prop];
      obj[`__${prop}`] = value;
      Object.defineProperty(obj, prop, {
        get: function () {
          return obj[`__${prop}`]
        },
        set: function (val) {
          obj[`__${prop}`] = val;
          obj.__litElms.map(
            theElm => theElm.requestUpdate()
          );
          scope.$applyAsync();
        }
      });
    }
  )
}
/**
 * Mixing that run lit-element's requestUpdate() when an array was changed
 * @param arr
 * @param elm
 */
const ARRAY_MUTATIONS = ['fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'];

const arrayWatcherMixing = (arr, elm, scope) => {
  ARRAY_MUTATIONS.map(
    mutationName => {
      arr.__litElms = arr.__litElms || [];
      arr.__litElms.push(elm);
      arr[mutationName] = function () {
        Array.prototype[mutationName].apply(this, arguments);
        arr.__litElms.map(
          theElm => theElm.requestUpdate()
        );
        scope.$applyAsync();
      }
    }
  );
};
/**
 * Watch the props if needed
 * @param ngPropOptions
 * @param elm
 * @param scope
 */
export const watchIfNeeded = (ngPropOptions, elm, scope, ngValue) => {
  // Watch it
  if (ngPropOptions.watch && !ngPropOptions._watcher) {
    // Array
    if (Array.isArray(ngValue)) {
      ngPropOptions._watcher = true;
      arrayWatcherMixing(ngValue, elm, scope);
    }
    // Object
    if (ngValue.constructor == Object) {
      ngPropOptions._watcher = true;
      objectWatcherMixing(ngValue, elm, scope)
    }
  }
}
