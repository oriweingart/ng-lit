const get = (obj, path) => {
    let paths = path.split('.')
        , current = obj
        , i;

    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}

const SECOND = 1000;

/**
 * Enables the nofity option for properties to fire change notification events
 *
 * @param {LitElement} baseElement - the LitElement to extend
 */
export const NgLit = (baseElement) => class extends baseElement {
    /**
     * Extend the LitElement `createProperty` method to map properties to events
     */


    static createProperty(name, options) {
        super.createProperty(name, options);

        if (options.fromNg) {
            if (!this._ngProp) {
                this._ngProp = {}
            }

            this._ngProp[name] = options;
        }
    }

    /**
     * check for changed properties with notify option and fire the events
     */


    update(changedProps) {

        if (!this.constructor._ngProp) {
            super.update(changedProps);
            return;
        }

        for (let [name] of Object.entries(this.constructor._ngProp)) {
            const ngPropRawValue = this.getAttribute(name);
            if (ngPropRawValue) {
                const $body = angular.element(
                    document.getElementsByTagName('ng-app')[0] ||
                    document.querySelector("[ng-app]"));
                const nextDigest = get($body, 'scope().$root.$apply') || setTimeout;
                nextDigest(() => {
                    let scope;
                    if (scope) {
                        // TODO: validation
                        this._commitWIthScope({scope, elm: this, changedProps, ngPropRawValue, name})
                    } else {
                        nextDigest(() => {
                            scope = angular.element(this.parentElement).scope();
                            if (!scope) {
                                setTimeout(() => {
                                    scope = angular.element(this.parentElement).scope();
                                    if (!scope) {
                                        return;
                                    }
                                    this._commitWIthScope({scope, elm: this, changedProps, ngPropRawValue, name});
                                }, SECOND * 0.3)
                            } else {
                                this._commitWIthScope({scope, elm: this, changedProps, ngPropRawValue, name});
                            }
                        });
                    }
                });
            }
        }

    }

    _commitWIthScope ({scope, changedProps, ngPropRawValue, name}) {
        let ngValue = get(scope, ngPropRawValue);
        changedProps.set(name, ngValue);
        this[name] = ngValue;
        super.update(changedProps);
    }

};

export default NgLit;
