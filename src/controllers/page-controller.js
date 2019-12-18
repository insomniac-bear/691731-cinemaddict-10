import ButtonShowMoreComponent from '../components/button-show-more.js';
import CardFilmComponent from '../components/card-film.js';
import ExtraFilmsListComponent from '../components/extra-film-list.js';
import FilmDetailsComponent from '../components/film-details.js';
import FilmsListComponent from '../components/films-list.js';
import NoCardsComponent from '../components/no-cards.js';
import {setFilter} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';

const ExtraFilmType = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`,
};

const SortType = {
  RATING_SORT: `Sort by rating`,
  DATE_SORT: `Sort by date`,
  COMMENTS_COUNT_SORT: `Sort by comment count`,
  DEFAULT_SORT: `Sort by default`,
};

const SHOWING_CARD_FILM_COUNT_ON_START = 5;
const SHOWING_CARD_FILM_COUNT_BY_BUTTON = 5;

// Функция отрисовки карточки фильма
const renderCard = (cardListElement, card) => {
  const cardComponent = new CardFilmComponent(card);

  // Функция открытия попапа с полной информацией о фильме
  const onClickFilmDetailsOpen = () => {
    const popupPlace = document.querySelector(`body`);
    const filmDetailsComponent = new FilmDetailsComponent(card);

    render(popupPlace, filmDetailsComponent, RenderPosition.BEFOREEND);

    // Функция удаления попапа с информацией о фильме из DOM-дерева
    const onClickBtnCloseCardDetails = () => {
      remove(filmDetailsComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        onClickBtnCloseCardDetails();
      }
    };

    filmDetailsComponent.setCloseButtonClickHandler(onClickBtnCloseCardDetails);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  cardComponent.setOpenDetailsButtonsClickHandler(onClickFilmDetailsOpen);

  render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._buttonShowMoreComponent = new ButtonShowMoreComponent();
    this._cardFilmComponent = new CardFilmComponent();
    this._topRatedFilmsListComponent = new ExtraFilmsListComponent(ExtraFilmType.TOP_RATED);
    this._mostCommentedFilmsListComponent = new ExtraFilmsListComponent(ExtraFilmType.MOST_COMMENTED);
    this._filmDetailsComponent = new FilmDetailsComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._noCardsComponent = new NoCardsComponent();
  }


  render(cards) {
    const container = this._container.getElement();

    // Проверяем, есть ли фильмы в базе
    const isFilmCardsEmpty = (cards.length === 0) ? true : false;


    if (isFilmCardsEmpty) {
      render(container, this._noCardsComponent, RenderPosition.BEFOREEND); // Если массив карточек пуст - рендерим сообщение-заглушку
      return;
    }

    render(container, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(container, this._topRatedFilmsListComponent, RenderPosition.BEFOREEND);
    render(container, this._mostCommentedFilmsListComponent, RenderPosition.BEFOREEND);

    const filmsListContainerElement = this._filmsListComponent.getElement().querySelector(`.films-list__container`);

    // Рендерим первые 5 карточек фильмов
    let showingCardsFilmCount = SHOWING_CARD_FILM_COUNT_ON_START;
    cards.slice(0, showingCardsFilmCount).forEach((generateCard) => {
      renderCard(filmsListContainerElement, generateCard);
    });

    render(this._filmsListComponent.getElement(), this._buttonShowMoreComponent, RenderPosition.BEFOREEND);

    // Показываем скрытые карточки
    const onClickLoadMoreButton = () => {
      const prevCardFilmCount = showingCardsFilmCount;
      showingCardsFilmCount = showingCardsFilmCount + SHOWING_CARD_FILM_COUNT_BY_BUTTON;

      cards.slice(prevCardFilmCount, showingCardsFilmCount)
        .forEach((generateCard) => {
          renderCard(filmsListContainerElement, generateCard);
        });
      if (showingCardsFilmCount >= cards.length) {
        remove(this._buttonShowMoreComponent);
      }
    };

    this._buttonShowMoreComponent.setClickHandler(onClickLoadMoreButton);

    const popularFilteredCards = setFilter(cards, SortType.RATING_SORT);
    // Список карточек отсортированных по рейтингу
    const commentsFilteredCards = setFilter(cards, SortType.COMMENTS_COUNT_SORT); // Список карточек отсортированных по количеству комментариев

    popularFilteredCards.slice(0, 2).forEach((generateCard) => {
      renderCard(this._topRatedFilmsListComponent.getElement().querySelector(`.films-list__container`), generateCard); // Рендерим 2 фильма с самым высоким рейтингом
    });

    commentsFilteredCards.slice(0, 2).forEach((generateCard) => {
      renderCard(this._mostCommentedFilmsListComponent.getElement().querySelector(`.films-list__container`), generateCard); // Рендерим 2 самых комментируемых фильма
    });
  }
}
