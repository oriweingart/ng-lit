/* eslint-disable no-prototype-builtins,no-restricted-syntax,no-param-reassign */
import { get, cloneDeep } from "lodash-es";
import { watchLitIfNeeded } from "./watchers";

const SECOND = 1000;

/**
 * @param {LitElement} baseElement - the LitElement to extend
 */
export const NgLit = baseElement => {
    return class extends baseElement {

        /**
         * Extend the LitElement `createProperty` to override ngProp's type into String
         */
        static createProperty(name, options) {
            if (this.ngProps && this.ngProps[name]) {
                options = options || {};
                options.type = String;
            }
            super.createProperty(name, options);
        }


        /**
         * Extend the LitElement `update` to check for changed properties and inject angular properties from scope if possible
         */
        update(changedProps) {
            if (this.__shouldUpdateNgProps(changedProps)) {
                this.__updateWithoutNgScopeSync(changedProps);
                (async () => {
                    const { ngScope, ngInjector } = await this.__getNgScope();
                    // eslint-disable-next-line no-unused-expressions
                    ngScope && ngInjector && this.__updateWithNgScopeAsync(ngScope, ngInjector, changedProps);
                })();
            } else {
                super.update(changedProps);
            }
        }

        /**
         *
         * INTERNAL METHODS
         *
         */


        /**
         * Check if a given prop name is an angular prop
         * @param propName
         * @returns {*|boolean}
         * @private
         */

        __isNgProp(propName) {
            return this.constructor.ngProps && this.constructor.ngProps[propName];
        }

        /**
         * Return true if we should update angular properties
         * @returns {boolean}
         * @private
         */
        __shouldUpdateNgProps(changedProps) {
            if (!this.constructor.ngProps) {
                return false;
            }
            if (!this.parentElement) {
                return false;
            }
            for (const changedPropKey of changedProps.keys()) {
                if (this.__isNgProp(changedPropKey)) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Return a promise that is resolved with angular's parent scope
         * @returns {Promise<any>}
         * @private
         */
        __getNgScope() {
            return new Promise((resolve) => {
                const { angular } = window;
                if (this.__ngScope && this.__ngInjector) {
                    resolve({ ngScope: this.__ngScope, ngInjector: this.__ngInjector });
                }
                let ngElement = angular ? angular.element(this.parentElement) : null;
                let ngScope = ngElement ? ngElement.scope() : null;
                let ngInjector = ngElement ? ngElement.injector() : null;
                if (ngScope && ngInjector) {
                    this.__ngScope = ngScope;
                    this.__ngInjector = ngInjector;
                    resolve({ ngScope: this.__ngScope, ngInjector: this.__ngInjector });
                } else {
                    setTimeout(async () => {
                        ngElement = angular ? angular.element(this.parentElement) : null;
                        ngScope = ngElement ? ngElement.scope() : null;
                        ngInjector = ngElement ? ngElement.injector() : null;
                        if (ngScope && ngInjector) {
                            this.__ngScope = ngScope;
                            this.__ngInjector = ngInjector;
                            // Try to extract angular's $apply, otherwise use setTimeout
                            const $body = angular ? angular.element(
                              document.getElementsByTagName('ng-app')[0] ||
                              document.querySelector("[ng-app]")
                            ) : null;
                            const nextDigest = get($body, 'scope().$root.$apply') || setTimeout;
                            nextDigest(() => {
                                resolve({ ngScope: this.__ngScope, ngInjector: this.__ngInjector });
                            });
                        } else {
                            console.warn(`Angular scope was not found on ${this.constructor.name}`);
                            resolve({});
                        }
                    }, SECOND * 0.1);
                }
            });
        }


        /**
         * Commit an update before we have the scope
         * @param ngScope
         * @param changedProps
         * @private
         */
        __updateWithoutNgScopeSync(changedProps) {
            for (const [ngPropName, ngPropOptions] of Object.entries(this.constructor.ngProps)) {
                const ngLitValue = changedProps.get(ngPropName);
                if ((!ngLitValue || typeof ngLitValue === 'string') && ngPropOptions.default) {
                    // apply default if any
                    this[ngPropName] = cloneDeep(ngPropOptions.default);
                }
            }
            super.update(changedProps);
        }


        /**
         * Commit an update with the scope and the changedProp
         * @param ngScope
         * @param changedProps
         * @private
         */
        __updateWithNgScopeAsync(ngScope, ngInjector, changedProps) {
            for (const [ngPropName, ngPropOptions] of Object.entries(this.constructor.ngProps)) {
                // Try to extract the actual value on angular's scope
                const pathOnScope = this.getAttribute(ngPropName);
                // First Try: using angular.$parse
                const $parse = ngInjector.get('$parse');
                const getter = $parse(pathOnScope);
                let ngValueOnScope = getter(ngScope);
                if (typeof ngValueOnScope === 'string') {
                    // Second Try: lodash get
                   ngValueOnScope = get(ngScope, ngValueOnScope);
                }
                if (!ngValueOnScope || typeof ngValueOnScope === 'string') {
                    // apply default if any
                    const ngLitValue = changedProps.get(ngPropName);
                    if (!ngLitValue || typeof ngLitValue === 'string') {
                        // apply default if any
                        if (ngPropOptions.default) {
                            this[ngPropName] = cloneDeep(ngPropOptions.default);
                            changedProps.set(ngPropName, this[ngPropName]);
                        } else {
                        // else delete it
                            this[ngPropName] = null;
                            changedProps.delete(ngPropName);
                        }
                    }
                } else {
                    // watch for array and objects change on lit
                    watchLitIfNeeded(ngPropOptions, this, ngScope, ngValueOnScope);
                    // watch for reference change on scope
                    ngScope.$watch(pathOnScope, newValue=> {
                      this[ngPropName] = newValue;
                      changedProps.set(ngPropName, newValue);
                      super.update(changedProps);
                    });
                    this[ngPropName] = ngValueOnScope;
                    changedProps.set(ngPropName, ngValueOnScope);
                }
            }
            super.update(changedProps);
        }
    };
};

export default NgLit;
