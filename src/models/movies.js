import {getCardsByFilter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class Cards {
  constructor() {
    this._cards = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  // Публичный метод получения карточек фильмов в зависимости от выбранного фильтра
  getCards() {
    return getCardsByFilter(this._cards, this._activeFilterType);
  }

  // Публичный метод получения всех карточек фильмов без учета фильтрации
  getCardsAll() {
    return this._cards;
  }

  // Публичный метод установки карточек фильмов
  setCards(cards) {
    this._cards = Array.from(cards);
  }

  // Публичный метод установки фильтра
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  // Публичный метод обновления карточек фильмов
  updateCard(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
