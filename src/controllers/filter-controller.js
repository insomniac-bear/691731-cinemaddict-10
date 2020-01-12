import SiteNavigationComponent from '../components/site-navigation.js';
import {render, RenderPosition, replace} from '../utils/render.js';
import {getCardsByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class FilterController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._activeFilterType = FilterType.ALL;
    this._siteNavigationComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._handler = null;

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allCards = this._cardsModel.getCardsAll();
    const counts = {
      allCount: allCards.length,
      watchlistCount: getCardsByFilter(allCards, FilterType.WATCHLIST).length,
      historyCount: getCardsByFilter(allCards, FilterType.HISTORY).length,
      favoritesCount: getCardsByFilter(allCards, FilterType.FAVORITES).length,
    };
    const oldComponent = this._siteNavigationComponent;

    this._siteNavigationComponent = new SiteNavigationComponent(counts);

    if (oldComponent) {
      replace(this._siteNavigationComponent, oldComponent);
    } else {
      render(container, this._siteNavigationComponent, RenderPosition.BEFOREEND);
    }
  }

  onNavigationChange(handler) {
    this._siteNavigationComponent.getElement().addEventListener(`click`, (evt) => {
      const navigationItemName = evt.target.id;

      this._siteNavigationComponent.setActiveItem(navigationItemName);
      handler(navigationItemName);
    });
    this._handler = handler;
  }

  _onDataChange() {
    this.render();
    this.onNavigationChange(this._handler);
  }
}
