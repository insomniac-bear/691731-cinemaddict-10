import API from './api.js';
import FooterComponent from './components/footer-statistic.js';
import StatisticsComponent from './components/statistics.js';
import UserProfileComponent from './components/user-profile.js';

import CardsModel from './models/movies.js';

import FilterController from './controllers/filter-controller.js';
import PageController from './controllers/page-controller.js';

import {render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic er883jdzbdw666`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerContainer = document.querySelector(`.footer`);

// подключаем API для работы с сервером
const api = new API(END_POINT, AUTHORIZATION);

const cardsModel = new CardsModel();

api.getCards()
  .then((cards) =>{
    cardsModel.setCards(cards);
    render(siteHeaderElement, new UserProfileComponent({cards: cardsModel}), RenderPosition.BEFOREEND);
    filterController.render();
    filterController.onNavigationChange(navigationHandler);
    render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
    statisticComponent.hide();
    render(footerContainer, new FooterComponent({cards: cardsModel}), RenderPosition.BEFOREEND);
    pageController.render();
  });

// подключаем контроллеры
const filterController = new FilterController(siteMainElement, cardsModel);
const pageController = new PageController(siteMainElement, cardsModel, api);

const statisticComponent = new StatisticsComponent({cards: cardsModel});

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


