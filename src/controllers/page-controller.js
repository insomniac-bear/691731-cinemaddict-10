import ButtonShowMoreComponent from '../components/button-show-more.js';
import ExtraFilmsListComponent from '../components/extra-film-list.js';
import FilmsComponent from '../components/films.js';
import FilmsListComponent from '../components/films-list.js';
import NoCardsComponent from '../components/no-cards.js';
import SortListComponent, {SortType} from '../components/sort-list.js';

import MovieController from './movie-controller.js';

import {render, RenderPosition, remove} from '../utils/render.js';

const ExtraFilmType = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`,
};

const SHOWING_CARD_FILM_COUNT_ON_START = 5;
const SHOWING_CARD_FILM_COUNT_BY_BUTTON = 5;

// Функция отрисовки списка карточек
const renderCardsList = (cardsListElement, cards, onDataChange, onViewChange, api) => {
  return cards.map((card) => {
    const movieController = new MovieController(cardsListElement, onDataChange, onViewChange, api);
    movieController.render(card);
    return movieController;
  });
};

// Тело контроллера
export default class PageController {
  constructor(container, cardsModel, api) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._api = api;

    this._showedCardControllers = [];

    this._navigationsCounts = {};

    this._showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
    this._filmsContainerElement = null;

    this._buttonShowMoreComponent = new ButtonShowMoreComponent();
    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._mostCommentedFilmsListComponent = new ExtraFilmsListComponent(ExtraFilmType.MOST_COMMENTED);
    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortListComponent();
    this._topRatedFilmsListComponent = new ExtraFilmsListComponent(ExtraFilmType.TOP_RATED);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onButtonShowMoreClick = this._onButtonShowMoreClick.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._sortComponent.hide();
    this._filmsComponent.hide();
  }

  show() {
    this._sortComponent.show();
    this._filmsComponent.show();
  }

  render() {
    const cardsModel = this._cardsModel;
    const cards = cardsModel.getCards(); // Получаем карточки из модели

    const container = this._container;

    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    render(container, this._filmsComponent, RenderPosition.BEFOREEND); // Рендерим элемент films где размещаются все списки фильмов если фильмы есть и сообщение заглушка, если фильмов - нет

    // Проверяем, есть ли фильмы в базе
    const isFilmCardsEmpty = (cards.length === 0) ? true : false;

    if (isFilmCardsEmpty) {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND); // Если массив карточек пуст - рендерим сообщение-заглушку
      return;
    }

    const filmsElement = this._filmsComponent.getElement();

    // Ренедерим основную разметку блока _filmsComponent
    render(filmsElement, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(filmsElement, this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);
    render(filmsElement, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    this._renderCards(cards.slice(0, this._showingCardsFilmCount));
    this._renderLoadMoreButton();

    // Рендерим по 2 карточки популярных и комментируемых фильмов
    this._renderPopularCads(cards);
    this._renderMostCommentedCards(cards);

    // Подключаем переключатель сортировки
    this._sortComponent.setSortTypeChangeHandler(this._onSortChange);
  }

  _removeCards() {
    const filmsListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    filmsListContainerElement.innerHTML = ``;

    this._showedCardControllers = [];
  }

  _removePopularCards() {
    const popularFilmsListContainerElement = this._topRatedFilmsListComponent.getElement().querySelector(`.films-list__container`);
    popularFilmsListContainerElement.innerHTML = ``;
  }

  _removeMostCommentedCards() {
    const commentedFilmsListContainerElement = this._mostCommentedFilmsListComponent.getElement().querySelector(`.films-list__container`);
    commentedFilmsListContainerElement.innerHTML = ``;
  }

  _renderCards(cards) {
    const filmsListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    const newCards = renderCardsList(filmsListContainerElement, cards, this._onDataChange, this._onViewChange, this._api);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardsFilmCount = this._showedCardControllers.length;
  }

  _renderPopularCads(cards) {
    const popularFilmsListContainerElement = this._topRatedFilmsListComponent.getElement().querySelector(`.films-list__container`);
    renderCardsList(popularFilmsListContainerElement, this._getSortedCards(cards, SortType.RATING).slice(0, 2), this._onDataChange, this._onViewChange, this._api);
  }

  _renderMostCommentedCards(cards) {
    const commentedFilmsListContainerElement = this._mostCommentedFilmsListComponent.getElement().querySelector(`.films-list__container`);
    renderCardsList(commentedFilmsListContainerElement, this._getSortedCards(cards, SortType.COMMENTS).slice(0, 2), this._onDataChange, this._onViewChange, this._api);
  }

  _onDataChange(movieController, oldData, newData) {
    const isSuccess = this._cardsModel.updateCard(oldData.id, newData);

    if (isSuccess) {
      movieController.render(newData);
      this._removePopularCards();
      this._removeMostCommentedCards();
      this._renderPopularCads(this._cardsModel.getCards());
      this._renderMostCommentedCards(this._cardsModel.getCards());
    }
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  // Функция обработки клика на кнопке Show more
  _onButtonShowMoreClick() {
    const prevCardFilmCount = this._showingCardsFilmCount;
    const cards = this._cardsModel.getCards();
    this._showingCardsFilmCount = this._showingCardsFilmCount + SHOWING_CARD_FILM_COUNT_BY_BUTTON;

    this._renderCards(cards.slice(prevCardFilmCount, this._showingCardsFilmCount));

    if (this._showingCardsFilmCount >= cards.length) {
      remove(this._buttonShowMoreComponent);
    }
  }

  // Функция отрисовки кнопки Show more
  _renderLoadMoreButton() {
    remove(this._buttonShowMoreComponent);

    if (this._showingCardsFilmCount >= this._cardsModel.getCards().length) {
      return;
    }
    render(this._filmsListComponent.getElement(), this._buttonShowMoreComponent, RenderPosition.BEFOREEND);
    this._buttonShowMoreComponent.setClickHandler(this._onButtonShowMoreClick);
  }

  // Функция сортировки
  _getSortedCards(cardsList, typeOfSort) {
    const filteredCardsList = cardsList.slice();

    switch (typeOfSort) {
      case `date`:
        filteredCardsList.sort((a, b) => {
          return b.filmInfo.release.date - a.filmInfo.release.date;
        });
        break;
      case `rating`:
        filteredCardsList.sort((a, b) => {
          if (b.filmInfo.totalRating - a.filmInfo.totalRating === 0) {
            return b.comments.length - a.comments.length;
          } else {
            return b.filmInfo.totalRating - a.filmInfo.totalRating;
          }
        });
        break;
      case `comments`:
        filteredCardsList.sort((a, b) => {
          if (b.comments.length - a.comments.length === 0) {
            return b.filmInfo.totalRating - a.filmInfo.totalRating;
          } else {
            return b.comments.length - a.comments.length;
          }
        });
        break;
      default:
        break;
    }

    return filteredCardsList;
  }

  _onSortChange(sortType) {
    let sortedCards = this._getSortedCards(this._cardsModel.getCards(), sortType);
    this._showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;

    this._removeCards();
    if (sortType === `default`) {
      this._renderCards(sortedCards.slice(0, this._showingCardsFilmCount));
    } else {
      this._renderCards(sortedCards);
    }
    this._renderLoadMoreButton();
  }

  _onFilterChange() {
    this._showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
    this._sortComponent.resetButtonsByDefault();
    this._removeCards();
    this._removePopularCards();
    this._removeMostCommentedCards();
    this._renderCards(this._cardsModel.getCards().slice(0, this._showingCardsFilmCount));
    this._renderPopularCads(this._cardsModel.getCards());
    this._renderMostCommentedCards(this._cardsModel.getCards());
    this._renderLoadMoreButton();
  }
}
