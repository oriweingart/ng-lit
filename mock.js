/* eslint-disable no-undef,no-param-reassign */
import { get } from "lodash-es";

export const MockScope = (mockedScope = {}) => {
  // patch $scope.$watch(..) as empty function
  mockedScope.$watch = () => {};
  // patch window.angular
  window.angular = {
    // patch angular.element(..)
    element () {
      return {
        // patch ngElement.injector()
        injector: () => {
          return {
            // patch injector.get with a thunk that will return prop on the mockedScope
            get: () => (pathOnScope) => (ngScope) => {
              return get(ngScope, pathOnScope);
            }
          };
        },
        // patch ngElement.scope() to return the given scope
        scope: () => {
          return mockedScope;
        }
      };
    }
  };
};

export default MockScope;
