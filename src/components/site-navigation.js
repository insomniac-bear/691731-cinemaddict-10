import AbstractComponent from './abstract-component.js';

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

export default class SiteNavigation extends AbstractComponent {
  constructor(navigations) {
    super();

    this._navigations = navigations;
  }

  getTemplate() {
    return createNavigationTemplate(this._navigations);
  }
}
