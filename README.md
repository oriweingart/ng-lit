### :warning: Under development :hammer_and_wrench:

# Pass objects and arrays from AngularJS scope to lit-element


Mixing class to pass angular objects and arrays from [AngularJS](https://github.com/angular/angular.js) application into lit-element without parsing them as json.


## Install

```bash
npm install ng-lit
```


## Simple usage

#### lit-element
```javascript
import { LitElement, html } from "lit-element";
import { NgLit } from "ng-lit";

export class NgLitUser extends NgLit(LitElement) {
  static get properties() {
    return {
      user: {fromNg: true} // Flag this is an angular prop
    };
  }
  render() {
    const {
      user
    } = this;

    return html`<h2>${user.firstName + " " + user.lastName}</h2>`;
  }
}
customElements.define('ng-lit-user', NgLitUser);
```

#### angular controller
```html
<div ng-app="myApp" ng-controller="myCtrl">
    <ng-lit-user user="ngUser"></nglit-user>
</div>
<script>
  angular.module('myApp', [])
    .controller('myCtrl', $scope => {
        $scope.ngUser = {
          firstName: "John",
          lastName: "Doe"
        };
  });
</script>
```
