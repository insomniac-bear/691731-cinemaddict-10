import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AbstractSmartComponent from './abstract-smart-component.js';
import {UserRank, FilterType} from '../const.js';
import {getCardsByFilter} from '../utils/filter.js';

const Period = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const getCardsFromPeriod = (cards, dateTo, period) => {
  switch (period) {
    case Period.ALL_TIME:
      return cards.filter((card) => {
        return card.userDetails.watchingDate <= dateTo;
      });
    case Period.TODAY:
      return cards.filter((card) => {
        return card.userDetails.watchingDate === dateTo;
      });
    case Period.WEEK:
      return cards.filter((card) => {
        const firstDayOfPeriod = new Date(dateTo);
        firstDayOfPeriod.setDate(firstDayOfPeriod.getDate() - 7);
        return card.userDetails.watchingDate <= dateTo && card.userDetails.watchingDate >= firstDayOfPeriod;
      });
    case Period.MONTH:
      return cards.filter((card) => {
        const firstDayOfPeriod = new Date(dateTo);
        firstDayOfPeriod.setMonth(firstDayOfPeriod.getMonth() - 1);
        return card.userDetails.watchingDate <= dateTo && card.userDetails.watchingDate >= firstDayOfPeriod;
      });
    case Period.YEAR:
      return cards.filter((card) => {
        const firstDayOfPeriod = new Date(dateTo);
        firstDayOfPeriod.setFullYear(firstDayOfPeriod.getFullYear() - 1);
        return card.userDetails.watchingDate <= dateTo && card.userDetails.watchingDate >= firstDayOfPeriod;
      });
  }

  return cards;
};

const getAllTimesOfMovies = (movies) => {
  return movies.reduce((acc, it) => acc + it.filmInfo.runtime, 0);
};

const generateUserRank = (countOfWatchedFilms) => {
  if (countOfWatchedFilms <= 0) {
    return ``;
  } else if (countOfWatchedFilms >= 1 && countOfWatchedFilms <= 10) {
    return UserRank.NOVICE;
  } else if (countOfWatchedFilms >= 11 && countOfWatchedFilms <= 20) {
    return UserRank.FAN;
  } else {
    return UserRank.MOVIE_BUFF;
  }
};

const getAllGeneres = (films) => {
  const generesList = new Set();
  films.forEach((film) => {
    film.filmInfo.genre.forEach((genere) => {
      generesList.add(genere);
    });
  });

  return Array.from(generesList);
};

const calcGenere = (films, genre) => {
  const filmOfGenere = [];
  films.forEach((film) => {
    const styles = Array.from(film.filmInfo.genre);
    if (styles.some((it) => it === genre)) {
      filmOfGenere.push(film);
    }
  });

  return filmOfGenere.length;
};

const renderBar = (barCtx, cards, dateTo, period) => {
  const watchedFilms = getCardsByFilter(cards, FilterType.HISTORY);
  const cardsFromPeriod = getCardsFromPeriod(watchedFilms, dateTo, period);

  const allGenere = getAllGeneres(cardsFromPeriod).map((it) => {
    return {
      name: it,
      count: calcGenere(cardsFromPeriod, it),
    };
  });

  allGenere.sort((a, b) => {
    return b.count - a.count;
  });

  const legend = allGenere.map((it) => it.name);
  const count = allGenere.map((it) => it.count);

  return new Chart(barCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: legend,
      datasets: [{
        data: count,
        backgroundColor: `#ffe800`,
        borderColor: `#ffe800`,
        barPercentage: 0.6,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 22,
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 10,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true,
            fontColor: `#ffffff`,
            fontSize: 22,
            padding: 30,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false,
          },
          gridLines: {
            display: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    }
  });
};

const createStatisticTemplate = ({cards, dateTo, period}) => {
  const watchedFilms = getCardsByFilter(cards, FilterType.HISTORY);
  const cardsFromPeriod = getCardsFromPeriod(watchedFilms, dateTo, period);
  const moviesCount = cardsFromPeriod.length;
  const totalFilmDuration = getAllTimesOfMovies(cardsFromPeriod);
  const allGenere = getAllGeneres(cardsFromPeriod).map((it) => {
    return {
      name: it,
      count: calcGenere(cardsFromPeriod, it),
    };
  });

  allGenere.sort((a, b) => {
    return b.count - a.count;
  });

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${generateUserRank(watchedFilms.length)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${period === `all-time` ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today"
        ${period === `today` ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week"
        ${period === `week` ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month"
        ${period === `month` ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year"
        ${period === `year` ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${moviesCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${Math.trunc(totalFilmDuration / 60)} <span class="statistic__item-description">h</span> ${totalFilmDuration % 60} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${allGenere.length !== 0 ? allGenere[0].name : `none`}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor({cards, dateTo}) {
    super();
    this._cards = cards;
    this._barChart = null;

    this._dateTo = dateTo;
    this._period = Period.ALL_TIME;

    this._allTimeButton = null;
    this._todayButton = null;
    this._weekButton = null;
    this._monthButton = null;
    this._yearButton = null;
  }

  getTemplate() {
    return createStatisticTemplate({cards: this._cards.getCardsAll(), dateTo: this._dateTo, period: this._period});
  }

  show() {
    super.show();

    this._renderChart();
    this.setPeriodFilterHandler();
  }

  rerender(cards, period, dateTo) {
    this._cards = cards;
    this.dateTo = dateTo;
    this._period = period;

    super.rerender();
    this._renderChart();
  }

  setPeriodFilterHandler() {
    this._allTimeButton = this.getElement().querySelector(`#statistic-all-time`);
    this._allTimeButton.addEventListener(`change`, () => {
      this._period = this._allTimeButton.value;
      this.rerender(this._cards, this._period, this.dateTo);
    });

    this._todayButton = this.getElement().querySelector(`#statistic-today`);
    this._todayButton.addEventListener(`change`, () => {
      this._period = this._todayButton.value;
      this.rerender(this._cards, this._period, this.dateTo);
    });

    this._weekButton = this.getElement().querySelector(`#statistic-week`);
    this._weekButton.addEventListener(`change`, () => {
      this._period = this._weekButton.value;
      this.rerender(this._cards, this._period, this.dateTo);
    });

    this._monthButton = this.getElement().querySelector(`#statistic-month`);
    this._monthButton.addEventListener(`change`, () => {
      this._period = this._monthButton.value;
      this.rerender(this._cards, this._period, this.dateTo);
    });

    this._yearButton = this.getElement().querySelector(`#statistic-year`);
    this._yearButton.addEventListener(`change`, () => {
      this._period = this._yearButton.value;
      this.rerender(this._cards, this._period, this.dateTo);
    });
  }

  recoveryListeners() {
    this.setPeriodFilterHandler();
  }

  _renderChart() {
    const element = this.getElement();

    const chartCtx = element.querySelector(`.statistic__chart`);
    this._barChart = renderBar(chartCtx, this._cards.getCards(), this._dateTo, this._period);
  }

  _resetChart() {
    if (this._barChart) {
      this._barChart.destroy();
      this._barChart = null;
    }
  }
}
