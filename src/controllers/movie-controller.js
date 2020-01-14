import FilmCardComponent from '../components/film-card.js';
import FilmDetailsComponent from '../components/film-details.js';
import FilmDetailsContainerComponent from '../components/film-details-container.js';
import CardModel from '../models/card.js';

import {render, RenderPosition, remove, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  OPENED: `opened`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._card = null;
    this._commentsList = null;
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._filmDetailsContainer = null;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onClickCloseButton = this._onClickCloseButton.bind(this);
  }

  // Публичный метод добавления карточки фильма
  render(card) {
    this._card = card;
    let commentsList = [];
    if (this._card.comments.length !== 0) {
      this._api.getComments(this._card.id)
      .then((comments) => {
        this._commentsList = Array.from(comments);
      });
    }


    const oldFilmCardComponent = this._filmCardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmCardComponent = new FilmCardComponent(this._card);
    this._filmDetailsComponent = new FilmDetailsComponent(this._card, commentsList);

    // Подписываемся на клики по карточке фильма
    this._filmCardComponent.setOpenDetailsButtonsClickHandler(() => {
      const popupPlace = document.querySelector(`body`);
      this._filmDetailsContainer = new FilmDetailsContainerComponent();
      render(popupPlace, this._filmDetailsContainer, RenderPosition.BEFOREEND);

      render(this._filmDetailsContainer.getElement(), this._filmDetailsComponent, RenderPosition.BEFOREEND);

      this._onViewChange();

      this._mode = Mode.OPENED;

      // Подписываемся на кнопки попапа
      if (this._card.comments.length > 0) {
        this._filmDetailsComponent.setDeleteCommentButtonsClickHandler((deletingCommentIndex) => {
          this._card.comments.splice(deletingCommentIndex, 1);
          const data = this._filmDetailsComponent.getData();
          this._onDataChange(this, this._card, data);
        });
      }

      this._filmDetailsComponent.setWatchlistHandler(() => {
        const newCard = CardModel.clone(this._card);
        newCard.userDetails.isWatchlist = !newCard.userDetails.isWatchlist;
        this._onDataChange(this, this._card, newCard);
      });

      this._filmDetailsComponent.setWatchedHandler(() => {
        const newCard = CardModel.clone(this._card);
        newCard.userDetails.isWatched = !newCard.userDetails.isWatched;
        this._onDataChange(this, this._card, newCard);

        if (this._card.userDetails.isWatched) {
          this._card.userDetails.watchingDate = new Date();
        } else {
          this._card.userDetails.watchingDate = null;
        }
      });

      this._filmDetailsComponent.setFavoriteHandler(() => {
        const newCard = CardModel.clone(this._card);
        newCard.userDetails.isFavorite = !newCard.userDetails.isFavorite;
        this._onDataChange(this, this._card, newCard);
      });

      this._filmDetailsComponent.setSubmitCommentHandler();
      this._filmDetailsComponent.setCloseButtonClickHandler((evt) => this._onClickCloseButton(evt, this._card));
      document.addEventListener(`keydown`, (evt) => this._onEscKeyDown(evt, this._card));
    });

    if (oldFilmCardComponent && oldFilmDetailsComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    // Подписываемся на клик по кнопке addToWatchList
    this._filmCardComponent.setWatchListButton((evt) => {
      evt.preventDefault();
      const newCard = CardModel.clone(this._card);
      newCard.userDetails.isWatchlist = !newCard.userDetails.isWatchlist;
      this._onDataChange(this, this._card, newCard);
    });
    // Подписываемся на клик по кнопке addToWatched
    this._filmCardComponent.setWatchedButton((evt) => {
      evt.preventDefault();
      const newCard = CardModel.clone(this._card);
      newCard.userDetails.isWatched = !newCard.userDetails.isWatched;

      if (newCard.userDetails.isWatched) {
        newCard.userDetails.watchingDate = new Date();
      } else {
        newCard.userDetails.watchingDate = null;
      }

      this._onDataChange(this, this._card, newCard);
    });
    // Подписываемся на клик по кнопке addToFavorite
    this._filmCardComponent.setFavoriteButton((evt) => {
      evt.preventDefault();
      const newCard = CardModel.clone(this._card);
      newCard.userDetails.isFavorite = !newCard.userDetails.isFavorite;
      this._onDataChange(this, this._card, newCard);
    });
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._filmDetailsComponent);
    }
  }

  _onClickCloseButton(evt) {
    evt.preventDefault();
    const data = this._filmDetailsComponent.getData();
    this._onDataChange(this, this._card, data);
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
