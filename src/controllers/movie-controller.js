import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';

import {render, RenderPosition, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  OPENED: `opened`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  // Публичный метод добавления карточки фильма
  render(card) {
    this._filmCardComponent = new FilmCardComponent(card);
    this._filmDetailsComponent = new FilmDetailsComponent(card);

    // Подписываемся на клики по карточке фильма
    this._filmCardComponent.setOpenDetailsButtonsClickHandler(() => {
      const popupPlace = document.querySelector(`body`);

      this._onViewChange();
      render(popupPlace, this._filmDetailsComponent, RenderPosition.BEFOREEND);
      this._mode = Mode.OPENED;
      this._filmDetailsComponent.setCloseButtonClickHandler(() => {
        remove(this._filmDetailsComponent);
        this._mode = Mode.DEFAULT;
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._filmDetailsComponent);
    }
  }

  // Функция удаления попапа нажатием клавиши Esc
  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(this._filmDetailsComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  // Функции обработчики событий на карточках в списке
  _addToWatchList(card) {
    this._onDataChange(this, card, Object.assign({}, card, {
      isWatchList: !card.isWatchList,
    }));
  }

  _addToWatched(card) {
    this._onDataChange(this, card, Object.assign({}, card, {
      isWatched: !card.isWatched,
    }));
  }

  _addToFavorite(card) {
    this._onDataChange(this, card, Object.assign({}, card, {
      isFavorite: !card.isFavorite,
    }));
  }
}
