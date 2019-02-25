import {LitElement, html} from "lit-element";
import {NgLit} from "../../index";

export class NgLitUser extends NgLit(LitElement) {
  static get properties() {
    return {
      user: {fromNg: true},
    };
  }

  render() {
    const {
      user = {}
    } = this;

    return html`
                <h2>Name In Lit Element: ${user.firstName + " " + user.lastName}</h2>
            `;
  }
}
export class NgLitWatchItems extends NgLit(LitElement) {
  static get properties() {
    return {
      items: {fromNg: true, watch: true},
    };
  }

  remove(index) {
    const {
      items = []
    } = this;
    items.splice(index, 1);
  }

  render() {
    const {
      items = []
    } = this;

    return html`
                <div>
                    <h2>Lit Items</h2>
                    ${(items).map((item, index) => {
                      return html`<div>${item}<button @click="${e => this.remove(index)}">remove from lit</button></div>`
                    })}
                </div>
            `;
  }
}

export class NgLitWatchUser extends NgLit(LitElement) {
  static get properties() {
    return {
      user: {fromNg: true, watch: true},
    };
  }

  render() {
    const {
      user = {}
    } = this;

    return html`
                <h2>Name In Lit Element: ${user.firstName + " " + user.lastName}</h2>
            `;
  }
}
export class NgLitItems extends NgLit(LitElement) {
  static get properties() {
    return {
      items: {fromNg: true},
    };
  }

  render() {
    const {
      items = [],
      user = {}
    } = this;

    return html`
                <div>
                    <h2>Items In Lit Element</h2>
                    ${(items).map((item, index) => {
                      return html`<h3>${item}</h3>
                   `})}
                </div>
            `;
  }
}
export class NgLitUserWithItems extends NgLit(LitElement) {
  static get properties() {
    return {
      items: {fromNg: true},
      user: {fromNg: true},
    };
  }

  render() {
    const {
      items = [],
      user = {}
    } = this;

    return html`
                <div>
                    <h2>Name In Lit Element: ${user.firstName + " " + user.lastName}</h2>
                    <h2>Items In Lit Element</h2>
                    ${(items).map((item, index) => {
                      return html`<h3>${item}</h3>
                   `})}
                </div>
            `;
  }
}
export class NgMultiNgPropsElement extends NgLit(LitElement) {
  static get properties() {
    return {
      user: {fromNg: true},
      items: {fromNg: true, watch: true},
    };
  }

  render() {
    const {
      user = {},
      items = []
    } = this;

    return html`
                <div>
                    <h2>Lit Name: ${user.firstName + " " + user.lastName}</h2>
                    <h2>Lit Items</h2>
                    ${(items).map((item, index) => {
      return html`<div>${item}</div>`
    })}
                </div>
            `;
  }
}
