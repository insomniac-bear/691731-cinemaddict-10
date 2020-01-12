import FooterComponent from './components/footer-statistic.js';
import StatisticsComponent from './components/statistics.js';
import UserProfileComponent from './components/user-profile.js';

import CardsModel from './models/movies.js';

import FilterController from './controllers/filter-controller.js';
import PageController from './controllers/page-controller.js';

import {generateFilmCards} from './mock/card.js';

import {render, RenderPosition} from './utils/render.js';
import {generateUserStatistic} from './utils/common.js';

// Рендерим основную разметку сайта
const siteHeaderElement = document.querySelector(`.header`);
const userStats = generateUserStatistic();
render(siteHeaderElement, new UserProfileComponent(userStats), RenderPosition.BEFOREEND);
const siteMainElement = document.querySelector(`.main`);

// создаем карточки фильмов
const cards = generateFilmCards();
const cardsModel = new CardsModel(); // Подключаем модель
cardsModel.setCards(cards); // Передаем в модель карточки фильмов

const statisticComponent = new StatisticsComponent({cards: cardsModel, userStatistic: userStats});

const navigationHandler = (itemNavigation) => {
  if (itemNavigation === `stats`) {
    pageController.hide();
    statisticComponent.show();
  } else {
    statisticComponent.hide();
    pageController.show();
    cardsModel.setFilter(itemNavigation);
  }
};

const filterController = new FilterController(siteMainElement, cardsModel);
filterController.render();
filterController.onNavigationChange(navigationHandler);

const pageController = new PageController(siteMainElement, cardsModel); // Подключаем контроллер
pageController.render();

render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();

const footerContainer = document.querySelector(`.footer`);
render(footerContainer, new FooterComponent(cards.length), RenderPosition.BEFOREEND);
