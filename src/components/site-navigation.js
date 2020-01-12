import AbstractComponent from './abstract-component.js';

const ACTIVE_CLASS = `main-navigation__item--active`;

const createNavigationTemplate = (counts) => {
  const {allCount, watchlistCount, historyCount, favoritesCount} = counts;
  return (
    `<nav class="main-navigation">
      <a href="#all"
        id="all"
        class="main-navigation__item ${ACTIVE_CLASS}">
        All movies
        <span class="main-navigation__item-count">${allCount}</span>
      </a>
      <a href="#watchlist"
        id="watchlist"
        class="main-navigation__item">
        Watchlist
        <span class="main-navigation__item-count">${watchlistCount}</span>
      </a>
      <a href="#history"
        id="history"
        class="main-navigation__item">
        History
        <span class="main-navigation__item-count">${historyCount}</span>
      </a>
      <a href="#favorites"
        id="favorites"
        class="main-navigation__item">
        Favorites
        <span class="main-navigation__item-count">${favoritesCount}</span>
      </a>
      <a href="#stats" id="stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class SiteNavigation extends AbstractComponent {
  constructor(filtersCount) {
    super();

    this._activeItem = `all`;
    this._filtersCount = filtersCount;
  }

  getTemplate() {
    return createNavigationTemplate(this._filtersCount, this._activeItem);
  }

  setActiveItem(itemId) {
    if (itemId === this._activeItem) {
      return;
    }

    this.getElement().querySelector(`#${this._activeItem}`).classList.remove(ACTIVE_CLASS);
    this.getElement().querySelector(`#${itemId}`).classList.add(ACTIVE_CLASS);
    this._activeItem = itemId;
  }
}
