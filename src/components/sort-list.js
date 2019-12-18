import AbstractComponent from './abstract-component.js';

export const SortType = {
  DATE: `date`,
  RATING: `rating`,
  COMMENTS: `comments`,
  DEFAULT: `default`,
};

const sortListTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class SortList extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return sortListTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const target = evt.target;

      if (target.tagName !== `A`) {
        return;
      }

      const sortType = target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      const allSortButton = this.getElement().querySelectorAll(`.sort__button`);

      allSortButton.forEach((it) => {
        if (it.classList.contains(`sort__button--active`)) {
          it.classList.toggle(`sort__button--active`);
        }
      });

      target.classList.toggle(`sort__button--active`);

      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }
}
