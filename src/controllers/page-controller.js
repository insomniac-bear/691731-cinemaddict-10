import ButtonShowMoreComponent from '../components/button-show-more.js';
import ExtraFilmsListComponent from '../components/extra-film-list.js';
import FilmsComponent from '../components/films.js';
import FilmsListComponent from '../components/films-list.js';
import NoCardsComponent from '../components/no-cards.js';
import SiteNavigationComponent from '../components/site-navigation.js';
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
const renderCardsList = (cardsListElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const movieController = new MovieController(cardsListElement, onDataChange, onViewChange);
    movieController.render(card);
    return movieController;
  });
};

// Тело контроллера
export default class PageController {
  constructor(container) {
    this._container = container;

    this._cards = [];
    this._showedCardsFilm = [];
    this._watchListMovie = [];
    this._historyMovie = [];
    this._favoritesMovie = [];

    this._navigationsCounts = {};

    this._showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
    this._filmsContainerElement = null;

    this._buttonShowMoreComponent = new ButtonShowMoreComponent();
    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._mostCommentedFilmsListComponent = new ExtraFilmsListComponent(ExtraFilmType.MOST_COMMENTED);
    this._noCardsComponent = new NoCardsComponent();
    this._siteNavigationComponent = null;
    this._sortComponent = new SortListComponent();
    this._topRatedFilmsListComponent = new ExtraFilmsListComponent(ExtraFilmType.TOP_RATED);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }


  render(cards) {
    this._cards = cards;

    this._watchListMovie = this._cards.filter((it) => {
      return it.isWatchList === true;
    });
    this._historyMovie = this._cards.filter((it) => {
      return it.isWatched === true;
    });
    this._favoritesMovie = this._cards.filter((it) => {
      return it.isFavorite === true;
    });

    this._navigationsCounts.watchlistCount = this._watchListMovie.length ? this._watchListMovie.length : 0;
    this._navigationsCounts.historyCount = this._historyMovie.length ? this._historyMovie.length : 0;
    this._navigationsCounts.favoritesCount = this._favoritesMovie.length ? this._favoritesMovie.length : 0;

    this._siteNavigationComponent = new SiteNavigationComponent(this._navigationsCounts);

    const container = this._container;

    render(container, this._siteNavigationComponent, RenderPosition.BEFOREEND);
    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    render(container, this._filmsComponent, RenderPosition.BEFOREEND); // Рендерим элемент films где размещаются все списки фильмов если фильмы есть и сообщение заглушка, если фильмов - нет

    // Проверяем, есть ли фильмы в базе
    const isFilmCardsEmpty = (this._cards.length === 0) ? true : false;

    if (isFilmCardsEmpty) {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND); // Если массив карточек пуст - рендерим сообщение-заглушку
      return;
    }

    // Ренедерим основную разметку блока _filmsComponent
    render(this._filmsComponent.getElement(), this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    this._filmsListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    // Рендерим первые 5 карточек фильмов
    const newCards = renderCardsList(this._filmsListContainerElement, this._cards.slice(0, this._showingCardsFilmCount), this._onDataChange, this._onViewChange);
    this._showedCardsFilm = this._showedCardsFilm.concat(newCards);

    this._renderLoadMoreButton();

    const popularFilteredCards = this._setFilter(this._cards, SortType.RATING); // Список карточек отсортированных по рейтингу
    const commentsFilteredCards = this._setFilter(this._cards, SortType.COMMENTS); // Список карточек отсортированных по количеству комментариев

    renderCardsList(this._topRatedFilmsListComponent.getElement().querySelector(`.films-list__container`), popularFilteredCards.slice(0, 2), this._onDataChange, this._onViewChange); // Рендерим список самых популярных карточек фильмов
    renderCardsList(this._mostCommentedFilmsListComponent.getElement().querySelector(`.films-list__container`), commentsFilteredCards.slice(0, 2), this._onDataChange, this._onViewChange); // Рендерим список самых комментируемых фильмов

    // Подключаем переключатель сортировки
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = this._setFilter(this._cards, sortType);

      this._filmsListContainerElement.innerHTML = ``;
      remove(this._buttonShowMoreComponent);

      renderCardsList(this._filmsListContainerElement, sortedCards.slice(0, this._showingCardsFilmCount), this._onDataChange, this._onViewChange);
      this._renderLoadMoreButton();
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    movieController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedCardsFilm.forEach((it) => it.setDefaultView());
  }


  _renderLoadMoreButton() {
    if (this._showingCardsFilmCount >= this._cards.length) {
      return;
    }

    render(this._filmsListComponent.getElement(), this._buttonShowMoreComponent, RenderPosition.BEFOREEND);

    this._buttonShowMoreComponent.setClickHandler(() => {
      const prevCardFilmCount = this._showingCardsFilmCount;
      this._showingCardsFilmCount = this._showingCardsFilmCount + SHOWING_CARD_FILM_COUNT_BY_BUTTON;

      const newCards = renderCardsList(this._filmsListContainerElement, this._cards.slice(prevCardFilmCount, this._showingCardsFilmCount), this._onDataChange, this._onViewChange);
      this._showedCardsFilm = this._showedCardsFilm.concat(newCards);

      if (this._showingCardsFilmCount >= this._cards.length) {
        remove(this._buttonShowMoreComponent);
      }
    });
  }

  // Функция сортировки
  _setFilter(array, value) {
    const filteredArray = array.slice();

    switch (value) {
      case `date`:
        filteredArray.sort((a, b) => {
          return b.filmDate - a.filmDate;
        });
        break;
      case `rating`:
        filteredArray.sort((a, b) => {
          if (b.filmRating - a.filmRating === 0) {
            return b.coomentsCount - a.commentsCount;
          } else {
            return b.filmRating - a.filmRating;
          }
        });
        break;
      case `comments`:
        filteredArray.sort((a, b) => {
          if (b.commentsCount - a.commentsCount === 0) {
            return b.filmRating - a.filmRating;
          } else {
            return b.commentsCount - a.commentsCount;
          }
        });
        break;
      default:
        break;
    }

    return filteredArray;
  }
}
