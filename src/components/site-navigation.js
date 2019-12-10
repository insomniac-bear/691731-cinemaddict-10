import {createElement} from '../util.js';

const createNavigationMarkup = (navigation, isActive) => {
  const {name, count} = navigation;

  return (
    `<a href="#watchlist" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
      ${name}${(name !== `All movies`) ? `<span class="main-navigation__item-count"> ${count}</span>` : ``}
    </a>`
  );
};

const createNavigationTemplate = (navigationsList) => {
  const navigationsMarkup = navigationsList.map((it, i) => createNavigationMarkup(it, i === 0)).join(`\n`);
  return (
    `<nav class="main-navigation">
      ${navigationsMarkup}
    </nav>`
  );
};

export default class SiteNavigation {
  constructor(navigations) {
    this._navigations = navigations;

    this._element = null;
  }

  getTemplate() {
    return createNavigationTemplate(this._navigations);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
