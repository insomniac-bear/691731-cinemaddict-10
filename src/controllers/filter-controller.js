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
    this._onFilterChange = this._onFilterChange.bind(this);

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allCards = this._cardsModel.getCardsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getCardsByFilter(allCards, filterType).length,
        isActive: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._siteNavigationComponent;

    this._siteNavigationComponent = new SiteNavigationComponent(filters);
    this._siteNavigationComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._siteNavigationComponent, oldComponent);
    } else {
      render(container, this._siteNavigationComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._cardsModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}
