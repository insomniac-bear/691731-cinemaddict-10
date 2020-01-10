import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter__`;
const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilerMarkup = (filter, isActive) => {
  const {name, count} = filter;

  return (
    `<a href="#${name}"
        id="filter__${name}"
        class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}"
    >${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createNavigationTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilerMarkup(it, it.isActive)).join(`\n`);
  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class SiteNavigation extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
