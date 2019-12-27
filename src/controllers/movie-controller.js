import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import FilmDetailsContainerComponent from '../components/film-details-container.js';

import {render, RenderPosition, remove, replace} from '../utils/render.js';

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
    this._filmDetailsContainer = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onClickCloseButton = this._onClickCloseButton.bind(this);
  }

  // Публичный метод добавления карточки фильма
  render(card) {
    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(card);
    this._filmDetailsComponent = new FilmDetailsComponent(card);

    // Подписываемся на клики по карточке фильма
    this._filmCardComponent.setOpenDetailsButtonsClickHandler(() => {
      const popupPlace = document.querySelector(`body`);
      this._filmDetailsContainer = new FilmDetailsContainerComponent();
      render(popupPlace, this._filmDetailsContainer, RenderPosition.BEFOREEND);

      this._onViewChange();

      render(this._filmDetailsContainer.getElement(), this._filmDetailsComponent, RenderPosition.BEFOREEND);

      this._mode = Mode.OPENED;

      // Подписываемся на кнопки попапа
      this._filmDetailsComponent.setCloseButtonClickHandler((evt) => this._onClickCloseButton(evt));
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    // Подписываемся на клик по кнопке addToWatchList
    this._filmCardComponent.setWatchListButton((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatchList: !card.isWatchList,
      }));
    });
    // Подписываемся на клик по кнопке addToWatched
    this._filmCardComponent.setWatchedButton((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
      }));
    });
    // Подписываемся на клик по кнопке addToFavorite
    this._filmCardComponent.setFavoriteButton((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._filmDetailsComponent);
    }
  }

  _onClickCloseButton(evt) {
    evt.preventDefault();
    remove(this._filmDetailsComponent);
    remove(this._filmDetailsContainer);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  // Функция удаления попапа нажатием клавиши Esc
  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._onClickCloseButton(evt);
    }
  }
}
