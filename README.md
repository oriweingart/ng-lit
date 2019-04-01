### :warning: Under development :hammer_and_wrench:

# 🔌 Boost Your Old [AngularJS](https://github.com/angular/angular.js) App [LitElement](https://github.com/Polymer/lit-element) Components.
[![CircleCI](https://circleci.com/gh/oriweingart/ng-lit.svg?style=svg)](https://circleci.com/gh/oriweingart/ng-lit)
[![NPM version](https://badge.fury.io/js/ng-lit.svg)](https://travis-ci.com/oriweingart/ng-lit)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

Are you stuck maintaining a crufy old angularjs 1.x app? Wish you could be writing straightforward component-based views but can't afford to move the whole thing to the Fancy New Framework™️? With LitElement and some helpers from ng-lit, you can **incrementally update** your old app piece by piece.

## 👩‍🚀 Installing

```bash
npm i -S ng-lit
```

`ng-lit` lets you pass objects and arrays from your [AngularJS](https://github.com/angular/angular.js) application into your [lit-element](https://github.com/Polymer/lit-element) views without parsing or watching them yourself.

## 👨‍💻 Usage

**[Demo on jsfiddle](https://jsfiddle.net/3jd61yh7/)**

### Your New `lit-element` View
```javascript
import { LitElement, html } from "lit-element";
import { NgLit } from "ng-lit";

class NgLitUser extends NgLit(LitElement) {
  static get properties() {
    return {
      age: { type: Number },
      user: { type: Object }
    };
  }

  // declare the angular props
  static get ngProps() {
    return {
      user: { default: {} }
    }
  }

  render() {
    const { age, user } = this;
    return html`
      <span>${user.firstName} ${user.lastName} is ${age} years old</span>
    `;
  }
}
customElements.define('ng-lit-user', NgLitUser);
```

### Your AngularJS App:
```html
<!-- angular -->
<div ng-app="myApp"
     ng-controller="myCtrl">
  <ng-lit-user
       user="ngUser"
       age="15">
  </ng-lit-user>
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

## 🧙‍♀️ Motivation

`ng-lit` allows you to bring your old [AngularJS](https://github.com/angular/angular.js) application up to date piece-by-piece, using `lit-element` components to refactor from the bottom-up.

[Web components work out-of-the-box in angular templates](https://custom-elements-everywhere.com/#angularjs), but due to some quirks in angular's data binding system, it can sometimes be awkward passing your app's data back down into your web components. `ng-lit` helpers make it easier for your new `lit-element` components to live side by side with old AngularJS code, until you can fully drop AngularJS from the app.

### Conceptual example
Consider an angularjs `todo-app` composed of three components:

- Main app entrypoint that loads a list of `todo` objects on to the `$scope`.
    ```html
    <todo-main-app>
    ```
- Component that get a list of `todo` objects and and renders `<todo-item>`s for each one.
    ```html
    <todo-list todos="vm.myTodoList">
    ```    
- Component that get a single `todo` object and render it's text and `isDone` state.
    ```html
    <todo-item todo="vm.singleTodo">
    ```    

For your first incremental change, you can use `ng-lit` to build a new implementation for `<todo-item>` based on `lit-element` with same interface as the old angularjs directive.
```html
<lit-todo-item todo="vm.singleTodo">
```    

You can stop here and the app will still work fine. When you're ready to move on, you can continue by upgrading `<todo-list>` and finally `<todo-main-app>`.

## 👨‍🏫 API


#### Reactive
Dy default `ng-lit` will render your component on changes made to object or array's reference.

The following example will update your element when `$scope.myBook` is updated with new object:

```javascript
class NgBook extends NgLit(LitElement) {
  static get properties() {
    return {
      book: { type: Object }
    };
  }

  static get ngProps() {
    return {
      book: { type: Object }
    }
  }

  render() {
    const { book } = this;
    return html`
      <span>${book.title} by ${book.author}</span>
    `;
  }
}
customElements.define('ng-lit-book', NgBook);
```

```html
<!-- angular -->
<div ng-app="myApp" ng-controller="myCtrl">
    <ng-lit-book book="myBook"></ng-lit-book>
    <button ng-click="selectBook({title: 'Anna Karenina', author: 'Leo Tolstoy'})">
      Anna Karenina
    </button>
    <button ng-click="selectBook({title: '1984', author: 'George Orwell' })">
      1894
    </button>
</div>
<script>
  angular.module('myApp', [])
    .controller('myCtrl', $scope => {
        $scope.myBook = null;
        $scope.selectBook = book => {
            $scope.myBook = book;  
        }
  });
</script>
```

### Properties

When you want your component to get certain props, add them to the `ngProps` static getter. You still have to define those properties in the regular `lit-element` static `properties` getter. The idea is that eventually you'll remove angular from your app entirely, at which point you'll just need to remove the `ngProps` block;

The following example will fetch a list of `books` and a `selectedBook` object from angular while `userId` will be treated as normal custom element property, without special arrangements for angularjs' data system.

```javascript
static get properties() {
  return {
    userId: { type: Number },
    books: { type: Array },
    selectedBook: { type: Object }
  };
}

static get ngProps() {
  return {
    books: { default: [] },
    selectedBook: { default: {} }
  }
}
```

#### Defaults
use the `default` option to pass a default value which your prop will get in case angular doesn't have that value in scope, or the value found was `null`.

```javascript
static get ngProps() {
  return {
    selectedBook: { default: { title: '1984', author: 'George Orwell' } }
  }
}
```

If you pass an object as the default, it will be cloned before it's assigned to the instance.

#### Watch
Set the `watch` boolean option to make your element update when angular changes the property.

The following example will update your element when `$scope.addBook()` is called:

```javascript
class NgListBookList extends NgLit(LitElement) {
  static get properties() {
    return {
      books: { type: Array }
    };
  }

  static get ngProps() {
    return {
      books: { default: [], watch: true }
    }
  }

  render() {
    const { books } = this;
    return html`
      <ul>
        ${books.map(({title, author}) => html`
          <li>${title} by ${author}</li>
        `)}
      </ul>
    `;
  }
}
customElements.define('ng-lit-books', NgListBookList);
```

```html
<!-- angular -->
<div ng-app="myApp" ng-controller="myCtrl">
    <ng-lit-books books="myBooks"></ng-lit-books>
    <button ng-click="addBook({title: 'Anna Karenina', author: 'Leo Tolstoy'})">
      Anna Karenina
    </button>
</div>
<script>
  angular.module('myApp', [])
    .controller('myCtrl', $scope => {
        $scope.myBooks = [];
        $scope.addBook = book => {
            $scope.myBooks.push(book)  
        }
  });
</script>
```

## 👨🏽‍💻 Unit Test your components

We recommend using [@open-wc/testing-helpers](https://github.com/open-wc/open-wc/tree/master/packages/testing-helpers) for unit testing your Web Components.

In order to Unit Test `ng-lit` component we just need to mock angular scope, to do so we expose `MockScope` API.

The following example will text `NgListBookList` component:

```javascript
  import {fixture, html} from '@open-wc/testing-helpers';
  import {MockScope} from 'ng-lit/mock';

  describe('ng-lit-books', async () => {
    it('should render component with 2 books', async () => {
      // Mock angular's scope with 2 books
      MockScope({myBooks: [
        {title: 'Anna Karenina', author: 'Leo Tolstoy'},
        {title: '1984', author: 'George Orwell' }
      ]});
      const {shadowRoot} = await fixture(html`
          <ng-lit-books books="myBooks">
          </ng-lit-books>
      `);
      const renderedBooks = shadowRoot.querySelectorAll('li');
      expect(renderedBooks.length).to.equal(0);
      expect(renderedBooks[0]).to.equal('Anna Karenina by Leo Tolstoy');
      expect(renderedBooks[1]).to.equal('1984 by George Orwell');
    })
  });
```

## 👨🏽‍💻 Developing

Installation
```bash
git clone git@github.com:oriweingart/ng-lit.git
cd ng-lit
npm i
```
Run Locally
```bash
npm run dev
```
Run demo examples
```bash
npm run demo
```
Run end-to-end tests
```bash
npm run test:e2e
```
Run unit tests
```bash
npm run test:unit
```
Run both unit and e2e tests
```bash
npm run test
```
Run Lint
```bash
npm run lint
```
